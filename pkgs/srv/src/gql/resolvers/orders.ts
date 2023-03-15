import container from "../../di/container";
import Types from '../../di/types';
import * as Entities from '../../di/entities';
import * as Option from 'fp-ts/Option';
import { Order } from '../../domain/order/Order';



const getRepo = () => container.get<Entities.Orders>(Types.Orders)

export const search = async () => await getRepo().search()

export const create = async (_: any, args: { by: string, lines: string[] }) => {
  
  const 
    id = await getRepo().create(args.by, args.lines),
    result = await getRepo().lookup(id.toString())
  ;

  return Option.matchW<void, Order, Order>(
   () => { throw new Error('cannot create Order') },
    o => o
  ) (result)
}


export const lookup = async (_: any, args: { id: string }) => {
  
  const result = await getRepo().lookup(args.id);

  return Option.isNone(result) 
    ? null 
    : result.value;
};

export const touch = async (_:any, args: { id: string, by: string, message: string }): Promise<Order | null> => {
  const touched = await getRepo().touch(args.id, args.by, args.message);

  return Option.isNone(touched)
    ? null
    : touched.value
};

export const process = async (_:undefined, args: { id: string, by: string }) : Promise<Order | null> => 
  await getRepo().process(args.id, args.by);

export const complete = async (_:undefined, args: { id: string, by: string }): Promise<Order | null> => 
  await getRepo().complete(args.id, args.by);
