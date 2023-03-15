import * as D from 'io-ts/Decoder';
import { Action } from './Action';

export const Order = D.struct({
  _id: D.string,
  state: D.literal('OPEN', 'IN_PROGRESS', 'COMPLETE'),
  log: D.array(Action)
});

export type Order = D.TypeOf<typeof Order>;