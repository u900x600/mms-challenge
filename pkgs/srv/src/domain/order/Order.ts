import * as D from 'io-ts/Decoder';
import * as A from './Action';

import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';
//import * as E from 'fp-ts/Either';
import * as RR from 'fp-ts/ReadonlyRecord';
import { pipe } from 'fp-ts/function'
import { ObjectId } from 'mongodb';

export const OrderState = D.union(
  D.literal('OPEN'),
  D.literal('IN_PROGRESS'),
  D.literal('COMPLETE')
);

export type OrderState = D.TypeOf<typeof OrderState>

const NonEmptyLog = pipe(
  D.array(A.Action),
  D.refine<readonly A.Action[], ReadonlyNonEmptyArray<A.Action>>(
    (x): x is ReadonlyNonEmptyArray<A.Action> => x.length > 0,
    'NonEmpty'
  )
);

const FirstIsCreated = pipe(
  NonEmptyLog,
  D.refine(
    (l): l is ReadonlyNonEmptyArray<A.Action> => A.isCreate(l[0]),
    'First Action is Creation'
  )
);

const IsValidLog: D.Decoder<ReadonlyNonEmptyArray<A.Action>, ReadonlyNonEmptyArray<A.Action>> = {
  decode: i => validateReport(createLogReport(i)) ? D.success(i) : D.failure(i, 'Log Validation Failed')
}

export const Order = D.struct({
  _id: { decode: (i: unknown) => i instanceof ObjectId ? D.success(i) : D.failure(i, 'Not an ObjectID') },
  state: OrderState,
  log: D.compose (IsValidLog) (FirstIsCreated)
});


export type Order = D.TypeOf<typeof Order>;

export type NewOrder = Omit<Order, '_id'>;


export const create = (by: string, at: Date, lines: string[]): NewOrder => ({
  state: 'OPEN',
  log: [{ at, by, action: 'create', lines }]
});

export const progress = (_id: ObjectId, log: Order['log']): Order => ({
  _id,
  state: 'IN_PROGRESS',
  log
});


export type LogReport = Readonly<{ [K in A.Action['action']]: number[] }>;

export const emptyReport = (): LogReport => ({
  create: [],
  process: [],
  touch: [],
  close: []
});

export const concatReport: (r1: Partial<LogReport>, r2: Partial<LogReport>) => Partial<LogReport> = 
  (r1, r2) => RR.union<number[]>({ concat: (x,y) => x.concat(y) }) (r2) (r1) as Partial<LogReport>


export const createLogReport = (log: Order['log']) => log.reduce(
  (report, action, index) => concatReport(report, {[action.action]: [index]}),
  emptyReport() as Partial<LogReport>
) as LogReport;



export const validateReport = (report: LogReport): boolean => {
  const { create:   [cridx  = Infinity,  ...crrest], 
          process:  [pidx   = -1,        ...prest], 
          close:    [clidx  = -1,       ...clrest] } = report;

  // the create index must be zero
  if (cridx > 0) return false;

  // each of those actions should apprear only once
  if (crrest.length > 0 || prest.length > 0 || clrest.length > 0)
    return false;

  // if closed
  if (clidx > 0) return clidx > pidx && pidx > cridx

  if (pidx > 0) return clidx < 0 && pidx > cridx

  return cridx == 0;

}

export const canTouch = (order: Order) => 
  order.state == 'OPEN' || 
  order.state == 'IN_PROGRESS';


export const canProcess = (order: Order) => 
  order.state == 'OPEN';

export const canComplete = (order: Order) =>
  order.state == 'IN_PROGRESS';