//import container from "./di/container";
//import Types from './di/types';
//import { DB } from './di/entities';

import * as GqlSrv from './gql/server';
import { startStandaloneServer } from '@apollo/server/standalone'

(async () => {

  //const client = container.get<DB>(Types.DB).client;
  //const collection = await client.db('mms').collection('orders').find().toArray();
  const gqlSrv = GqlSrv.create();

  //console.log(collection);

  //client.close();

  await startStandaloneServer(gqlSrv, {
    listen: { port: 80 }
  })

})();

