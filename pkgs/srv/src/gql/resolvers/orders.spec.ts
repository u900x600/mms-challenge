import { describe, expect, it } from "vitest";
import { container, Types, Entities } from '../../di';


import * as R  from './orders';

const Orders = () => container.get<Entities.Orders>(Types.Orders);

describe('gql/resolvers/orders', () => {

  it ('create', async () => {
    // will throw if fails
    await R.create(undefined, { by: 'test', lines: [''] });
  })

  it ('reads all orders', async () => {
    await Orders().create('test', ['test-line']);
    const result = await R.search();
    expect(result.length).to.greaterThan(0);
  })

  it ('touch', async () => {
    const 
      // @ts-ignore
      { _id  } = await R.create(undefined, {by: 'test', lines: ['line-1']}),
      touched = await R.touch(undefined, {id: _id.toString(), by: 'test', message: 'test'})
    ;
    expect (touched).not.toBeNull();
  });
})