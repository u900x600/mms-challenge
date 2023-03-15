import { injectable, inject } from "inversify";
import * as Entities from '../di/entities';
import Types from '../di/types'

import * as O from '../domain/order/Order';
import * as Action from '../domain/order/Action';
import * as E from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';


import { pipe } from 'fp-ts/function';
import { ObjectId } from "mongodb";


export const validateOne = O.Order.decode
export const validateMany = E.traverseArray(validateOne);

export const throwing: <A, E>(fa: E.Either<E, A>) => A = E.matchW(
  e => { throw new Error(`Received invalid Orders from DB [${e}]`) },
  a => a
);

@injectable()
export default class Orders implements Entities.Orders {

  @inject(Types.DB) private readonly db: Entities.DB;

  get collection () {
    return this.db.db.collection('orders');
  }

  async create (by: string, lines: string[]) {
    const 
      o = O.create(by, new Date(), lines),
      { insertedId } = await this.collection.insertOne(o)
    ;
    return insertedId;
  }

  async search () {
    const result = await this.collection.find().toArray();
    return throwing(validateMany(result))
  }

  async lookup (id: string) {
    const item = await this.collection.findOne({ _id: new ObjectId(id) });
    
    return pipe(
      item,
      Option.fromNullable,
      Option.chain(i => Option.fromEither(O.Order.decode(i)))
    );
  }

  async touch (id: string, by: string, message: string) {
    const order = await this.lookup(id);

    const run = pipe(
      order,
      TE.fromOption(() => new Error(`Order with ID ${id} not found`)),
      
      TE.chain(TE.fromPredicate(
        O.canTouch,
        () => new Error('cannot ouch order')
      )),
      
      TE.chain(_ => TE.tryCatch(
        () => this.collection.updateOne(
          { _id: new ObjectId(id) },
          { 
            '$push': { 
              log: Action.touch(
                new Date(),
                by,
                message)
            } 
          }),
         e => e as Error
      )),

      TE.chainFirst(TE.fromPredicate(
        result => result.modifiedCount > 0,
        () => new Error('No Document Modified')  
      ))
    );

    const result = await run();
    
    if (E.isLeft(result))
        throw result.left;
   
    return await this.lookup(id);
  }

  async process (id: string, by: string) {
    

    const check = TE.fromPredicate(
      O.canProcess, 
      o => new Error(`Order [state=${o.state}] cannot be processed`)
    );

    const writeState = (order: O.Order) => pipe(
      TE.tryCatch(
        () => this.collection.updateOne(
          { _id: order._id },
          { 
            '$set': { state: 'IN_PROGRESS' },
            '$push': { log: Action.process(new Date(), by) }
          }
        ),
        e => e as Error
      ),
      TE.chainFirst(TE.fromPredicate(
        result => result.modifiedCount > 0,
        r => new Error(`No Items Modified`)
      ))
    );

    

    const action = pipe(
      TE.Do,
      TE.apS('order', this.find(id)),
      TE.bind('result', d => pipe(d.order, check, TE.chain(writeState))),
      TE.chain(r => this.find(r.order._id.toString()))
    )

    const result = await action();

    if (E.isLeft(result)) throw result.left;

    return result.right;
  }

  async complete (id: string, by: string): Promise<O.Order> {
    const action = pipe(
      this.find(id),

      TE.chain(TE.fromPredicate(
        O.canComplete, 
        o => new Error(`Order with state [${o.state}] cannot be completed`)
      )),

      TE.chain(order => TE.tryCatch(
        () => this.collection.updateOne(
          {_id: order._id}, 
          { 
            '$set': { state: 'COMPLETE' },
            '$push': { log: Action.close(new Date(), by) }
          }
        ),
        e => e as Error
      )),

      TE.chainFirst(TE.fromPredicate(
        r => r.modifiedCount > 0,
        _ => new Error('No items have been modified')
      )),

      TE.chain(r => this.find(id))
    );

    
    const result = await action();
    
    if (E.isLeft(result)) throw result.left;

    return result.right;
  }

  find (i: string) {
    return pipe(
      TE.tryCatch(
        async () => this.lookup(i),
        e => e as Error
      ),
      TE.chain(TE.fromOption(() => new Error(`Order [id=${i}] does not exist`)))
    );
  }
}