import * as A from '@mms-cc/srv/src/domain/order/Action';
import * as D from 'io-ts/Decoder';
import { DateTime } from 'luxon'
import { pipe } from 'fp-ts/function'


export const Common = D.struct({
  by: D.string,
  at: pipe(
    D.string,
    D.parse<string, DateTime>(a => {
      try { return D.success(DateTime.fromSeconds(parseInt(a))) } 
      catch (e) { return D.failure(a, `Cannot parse DateTime :: ${(e as Error).message}`) }
    })
  )
});

export type Common = D.TypeOf<typeof Common>

// ugly typefixing here
export type Create  = D.TypeOf<typeof A.Create>   & Common;
export type Touch   = D.TypeOf<typeof A.Touch>    & Common;
export type Process = D.TypeOf<typeof A.Process>  & Common;
export type Close   = D.TypeOf<typeof A.Close>    & Common;

export const Action = D.sum('action')({
  create: D.intersect   (Common) (A.Create),
  touch: D.intersect    (Common) (A.Touch),
  process: D.intersect  (Common) (A.Process),
  close: D.intersect    (Common) (A.Close)
})

export type Action = D.TypeOf<typeof Action>

export const match = <A>(
  onOpen: (a: Create) => A,
  onTouch: (a: Touch) => A,
  onProcess: (a: Process) => A,
  onClose: (a: Close) => A
) => (action: Action): A => {
  switch (action.action) {
    case 'create':  return onOpen(action);
    case 'touch':   return onTouch(action);
    case 'process': return onProcess(action);
    case 'close':   return onClose(action);
    default:
      const e: never = action;
      return e;
  }
}
