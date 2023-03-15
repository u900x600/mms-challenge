import { injectable, inject } from "inversify";
import { MongoClient, Db } from 'mongodb';
import * as Entities from './entities';
import Types from './types'


@injectable()
export default class DB implements Entities.DB {
  @inject(Types.Env) private env: Entities.Env;
  private _client: MongoClient | null = null;

  public get client (): MongoClient {

    if (this._client == null)
      this._client = new MongoClient(this.env.get('VITE_MONGO_CONNECTION_STRING'))

    return this._client;
  }

  public get db (): Db {
    return this.client.db(this.env.get('VITE_MONGO_DB_NAME'))
  }
}