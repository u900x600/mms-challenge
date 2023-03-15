import { describe, it, expect} from 'vitest';
import * as O from './Order';

import { isLeft, isRight } from 'fp-ts/Either'
import { ObjectId } from 'mongodb';

describe('domain/order/Order', () => {

  it ('OrderState.decode', () => {
    expect(isRight(O.OrderState.decode('OPEN'))).to.true;
    expect(isRight(O.OrderState.decode('XOPEN'))).to.false;
  })

  it('Order.decode', () => {
    const o = O.Order.decode({
      _id: new ObjectId(100),
      state: 'OPEN',
      log: [{ at: new Date(), by: 'root', action: 'create', lines: [''] }]
    });

    expect (isRight(o)).to.true
    
  });

  it('Order.decode - fails if first action is not CREATED', () => {
    const o = O.Order.decode({
      _id: new ObjectId(1),
      state: 'OPEN',
      log: [{ at: new Date(), by: 'xx', action: 'process' }]
    });

    expect(isLeft(o)).to.true;
  });

  it ('concatReport', () => {
    const 
      r1 = O.concatReport(O.emptyReport(), { create: [1], process: [], touch: [], close: []  }),
      r2 = O.concatReport(r1, { create: [2], process: [], touch: [], close: []  })
    ;

    expect(r2.create).to.deep.eq([1,2]);

  });

  it ('createLogReport', () => {
    const o: O.Order['log'] = [
        { by: 'test', at: new Date(), action: 'create', lines: [''] },
        { by: 'root', at: new Date(), action: 'process' },
        { by: 'xxxx', at: new Date(), action: 'touch', message: 'don\' touch this' },
        { by: 'xxxx', at: new Date(), action: 'touch', message: 'don\' touch this' }
      ];

    expect(
      O.createLogReport(o)).to.deep.eq(
        { create: [ 0 ], process: [ 1 ], touch: [ 2, 3 ], close: [] }
     )
  });

  it ('validate report', () => {
    const mkReport = (create: number[], process: number[], close: number[]) => O.concatReport(
      O.emptyReport(), 
      { create, process, close }) as O.LogReport;
      

    
    expect(O.validateReport(mkReport([0],   [],     []))).to.true;
    expect(O.validateReport(mkReport([0,1], [],     []))).to.false;

    expect(O.validateReport(mkReport([0],   [1],    []))).to.true;
    expect(O.validateReport(mkReport([1],   [0],    []))).to.false;
    expect(O.validateReport(mkReport([0],   [1,2],  []))).to.false;

    expect(O.validateReport(mkReport([0],   [1],    [2]))).to.true;
    expect(O.validateReport(mkReport([0],   [3],    [2]))).to.false;

    expect(O.validateReport(mkReport([0],   [7],    [9]))).to.true;
    
    expect(O.validateReport(mkReport([0],   [],     [5]))).to.false;
  })
})