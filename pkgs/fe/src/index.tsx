import ReactDOM from 'react-dom/client'
import React from 'react';
import App from './App';
import { create } from './gql/client';


(async () => {


  const root = document.querySelector('.stage');

  if (root !== null) 
    ReactDOM.createRoot(root).render(
      <App client={create()}/>
    )
  
})()