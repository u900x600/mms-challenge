import React, { useEffect, useState } from "react";
import { useMutation } from '@apollo/client';
import { useContext } from '../context';

import Hint from './Hint';

import * as O from '../domain/Order';
import * as Queries from '../gql/queries';


const Touch = (props: { id: string }) => {
  const 
    ctx = useContext(),
    [run, { data, loading, error }] = useMutation<any, {id: string, by: string, message: string}>(Queries.Touch, {
      refetchQueries: [{query: Queries.Search}]
    }),
    [message, setMessage] = useState<string>('n/a')
  ;

  return (
    <span>
      <input type="text" defaultValue={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={_ => run({ variables: { id: props.id, by: ctx.login, message }})}>Touch</button>
    </span>
  )
}

const Process = (props: {id: string}) => {
  const 
    ctx = useContext(),
    [run, { data, loading, error }] = useMutation<any, {id: string, by: string}>(Queries.Process, {
      refetchQueries: [{query: Queries.Search}]
    })  
  ;
  
  return <button onClick={_ => run({ variables: { id: props.id, by: ctx.login} })}>
    Process
  </button>
}

const Complete = (props: {id: string}) => {
  const 
    ctx = useContext(),
    [run] = useMutation<any, {id: string, by: string }>(Queries.Complete, { 
      refetchQueries: [{query: Queries.Search}] 
    });

  return (
    <button onClick={_ => run({variables: {id: props.id, by: ctx.login}})}>Complete</button>
  )
  
}

export const Create = () => {
  const 
    ctx = useContext(),
    [run] = useMutation<any, {by: string, lines: string[]}>(Queries.Create, {
      refetchQueries: [{query: Queries.Search}]
    }),
    [lines, setLines] = useState<string []>(['line 1'])
  ;

  return (
    <div className="create-action">
      <Hint hint="Lines will be split by \\n to mimik certain Order lines" />
      <br  />
      <textarea 
        defaultValue={lines.join('\n')}
        onChange={e => setLines(e.target.value.split('\n'))}
      />
      <button onClick={_ => run({variables: { by: ctx.login, lines }})}>Create</button>
    </div>
  )

}

export default (props: {order: O.Order}) => <div className="order-actions">
  <Process id={props.order._id} />
  <Touch id={props.order._id} />
  <Complete id={props.order._id} />
</div>