import { Container } from "inversify";
import "reflect-metadata";
import Types from './types';
import DB from './DB';
import Env from './Env';
import Orders from '../db/Orders';

const container = new Container();

container.bind(Types.Env).to(Env);
container.bind(Types.DB).to(DB);
container.bind(Types.Orders).to(Orders)

export default container;


