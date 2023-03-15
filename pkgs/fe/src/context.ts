import * as R from 'react';
import { Client } from './gql/client'
export type Context = Readonly<{
  login: string,
  update: (c: Context) => void
}>;

const Ctx = R.createContext<Context>({
  login: 'Frank',
  update: () => {}
});

export default Ctx;

export const useContext = () => R.useContext(Ctx)
