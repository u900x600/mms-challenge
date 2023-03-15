import { injectable } from "inversify";
import * as Entities from './entities';

@injectable()
export default class Env implements Entities.Env {
  get (key: keyof ImportMetaEnv) {
    const v = import.meta.env[key];
    if(v == undefined)
      throw new Error(`Key: [${key}] is not defined in .env`);
    return v;
  }
}