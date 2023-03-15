import * as D from 'io-ts/Decoder';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function'

export const Common = D.struct({
  by: D.string,
  at: { decode: (i: unknown) => i instanceof Date ? D.success(i) : D.failure(i, 'Not a date') }
});

export type Common = D.TypeOf<typeof Common>;

export const Create = D.struct({
  action: D.literal('create'),
  lines: D.array(D.string)
});

export const Touch = D.struct({
  action: D.literal('touch'),
  message: D.string
});

export const Process = D.struct({
  action: D.literal('process')
});

export const Close = D.struct({
  action: D.literal('close')
});

const Payload = D.sum ('action') ({
  create:   Create,
  touch:    Touch,
  process:  Process,
  close:    Close
});

type Payload = D.TypeOf<typeof Payload>

export const Action: D.Decoder<unknown, Common & Payload> = Object.freeze({
  decode: (i: unknown) => pipe(
    E.Do,
    E.apS('common', Common.decode(i)),
    E.apS('payload', Payload.decode(i)),
    E.map(({common, payload}) => ({ ...common, ...payload }))
  )
});


export type Action = D.TypeOf<typeof Action>;

export const isCreate = (a: Action) => a.action == 'create';

export const isTouch = (a: Action) => a.action == 'touch';

export const touch = (at: Date, by: string, message: string): Action => Object.freeze({
  action: 'touch',
  at,
  by,
  message
});

export const process = (at: Date, by: string): Action => Object.freeze({
  action: 'process',
  at,
  by
});

export const close = (at: Date, by: string): Action => Object.freeze({
  action: 'close',
  at,
  by
});
