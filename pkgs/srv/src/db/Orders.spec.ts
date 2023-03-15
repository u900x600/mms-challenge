import { ObjectId } from 'mongodb';
import { describe, it, expect } from 'vitest';
import { container, Types, Entities } from '../di';
import { isSome } from 'fp-ts/Option'

describe('db/Orders', () => {

  const 
    Orders = () => container.get<Entities.Orders>(Types.Orders),
    DB = () => container.get<Entities.DB>(Types.DB)
  ;

  
  it ('create', async () => {
    const result = await Orders().create('test', []);
    expect(result instanceof ObjectId).to.true;
  });

  it('lookup', async () => {
    const 
      id = (await Orders().create('test', [])).toString(),
      result = await Orders().lookup(id)
    ;
    expect(isSome(result)).to.true;
  });
  
  it ('touch', async () => {
    const 
      id = (await Orders().create('test', [])).toString(),
      touched = await Orders().touch(id, 'Frank', 'Franks touch')
    ;

    expect(isSome(touched)).to.true;
  });

  it ('complete', async () => {
    const id = (await Orders().create('test', [])).toString()

    await Orders().process(id, 'test');

    const result = await Orders().complete(id, 'test');

    expect(result.state).to.eq('COMPLETE');
    expect(result.log[result.log.length - 1].action).to.eq('close')
  })

  it ('complete - fail', async () => {
    const id = (await Orders().create('test', [])).toString();
    let c = 0;
    try {
      await Orders().complete(id, 'test');
    
    } catch (e) {
      c += 1;
    }

    expect(c).to.eq(1);
  })
  

}) 