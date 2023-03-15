import { MongoClient, Db, ObjectId } from "mongodb";
import { Option } from 'fp-ts/Option';
import * as O from '../domain/order/Order'

export interface DB  {
  readonly client : MongoClient;
  readonly db: Db;
};

export interface Env {
  get: (key:  keyof ImportMetaEnv) => string
};

export interface Orders {
  create: (by: string, lines: string[]) => Promise<ObjectId>;
  search: () => Promise<readonly O.Order[]>;
  lookup: (id: string) => Promise<Option<O.Order>>;
  touch: (id: string, by: string, message: string) => Promise<Option<O.Order>>;
  process: (id: string, by: string) => Promise<O.Order>;
  complete: (id: string, by: string) => Promise<O.Order>;
}