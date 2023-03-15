import { ApolloServer } from '@apollo/server';

import Schema from './schema';

import * as Orders from './resolvers/orders';
import * as Action from '../domain/order/Action';
import { isRight } from 'fp-ts/Either'

export const create = () => new ApolloServer({
  typeDefs: Schema,
  resolvers: {
        
    OrderAction: {
      __resolveType: (obj: unknown) => {
        const a = Action.Action.decode(obj);

        return isRight(a)
          ? `OrderAction${a.right.action.charAt(0).toLocaleUpperCase() + a.right.action.slice(1)}`
          : null
      }
    },
    
    
    Query: { 
      orders: Orders.search,
      lookupOrder: Orders.lookup
    },
    
    Mutation: { 
      createOrder:  Orders.create,
      touchOrder:   Orders.touch,
      processOrder: Orders.process,
      completeOrder: Orders.complete
    }
  }
});

