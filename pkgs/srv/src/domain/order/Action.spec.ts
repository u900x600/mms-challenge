import { describe, it, expect} from 'vitest';
import * as D from 'io-ts/Decoder';
import * as A from './Action';


import * as E from 'fp-ts/Either'


const run = (decoder: D.Decoder<unknown, any>) => (i: unknown) => {
  const result = decoder.decode(i);

  if (E.isLeft(result)) 
    throw new Error(D.draw(result.left));
  
  expect(E.isRight(result)).to.true
}

describe('domain/order/Action', () => {

  it('Action.decode', () => {
    const runAction = run(A.Action);

    runAction({
      at: new Date(),
      by: 'root',
      action: 'create',
      lines: ['']
    });

    runAction({
      at: new Date(),
      by: 'test',
      action: 'touch',
      message: 'test touch'
    });
    
  });


})