import React from "react";

import { useId } from 'react'

import { useContext } from '../context';
import Hint from './Hint';

export default () => {
  const 
    ctx = useContext(),
    id = useId()
  ;

  return (
    <header>
      <label htmlFor={id}>Login:</label>
      <input 
        id={id}
        type="text" 
        defaultValue={ctx.login}
        onChange={e => ctx.update({ ...ctx, login: e.target.value })} />
      <Hint hint="Name of Employee used for all actions" />
    </header>
  );
}