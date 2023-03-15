import React from "react";
import { useState, useEffect } from 'react';
import './App.css';
import Ctx, { Context } from './context';
import Header from './components/Header';
import Main from './components/Main';
import { Client } from './gql/client';
import { ApolloProvider} from '@apollo/client'


export default (props: { client: Client }) => {
  const [ctx, setCtx] = useState<Context>({ 
    login: 'Frank', 
    update: () => {}
  });

  useEffect(() => {
    console.log(ctx);
  }, [ ctx ])

  return (
    <div>
      <Ctx.Provider value={{ ...ctx, update: setCtx }}>
        <ApolloProvider client={props.client}>
          <Header />
          <Main />
        </ApolloProvider>
      </Ctx.Provider>
    </div>
  );
};