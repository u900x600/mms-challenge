import React from "react"

import * as Queries from '../gql/queries';
import { useQuery } from '@apollo/client';
import * as Result from '../gql/result';
import * as E from 'fp-ts/Either';

import * as D from 'io-ts/Decoder';
import * as O from '../domain/Order';
import * as A from '../domain/Action';
import { DateTime } from "luxon";

import OrderActions from './OrderActions';


const Create = (props: { c: A.Create }) => <div>
  <span>[Lines]</span>
  <ul className="log-lines">
    {props.c.lines.map((l, idx) => <li key={idx}>{l}</li>)}
  </ul>
</div>

const matchAction = A.match<JSX.Element>(
  create => <Create c={create} />,
  touch => <div>[message] {touch.message}</div>,
  process => <div>n/a</div>,
  close => <div>n/v</div>
);

const Action = (props: { action: A.Action, order: O.Order }) => <div className="action">
  <div className="action-common">
    <span>[{props.action.action}]</span>
    <span>[by: {props.action.by}]</span>
    <span>[at: {props.action.at.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}]</span>
  </div>
  {matchAction(props.action)}
</div>

const Log = (props: { order: O.Order }) => 
<ol className="log">
  {props.order.log.map((action, idx) => <li key={`${props.order._id}-action-${idx}`}>
    <Action action={action} order={ props.order }/>  
  </li>)}
</ol>

const Item = (props: { order: O.Order }) => 
<li className="main-list-item">
  <h4 className={`order-state order-state-${props.order.state.toLowerCase()}`}>
    <span>[{ props.order.state }]</span>
    <span>{`${props.order._id}`}</span>
  </h4>
  <b>Log:</b>
  <Log order={props.order} />
  <OrderActions order={props.order}/>
</li>

const decode = E.traverseArray(O.Order.decode)

const Data = (props: { orders: O.Order[] }) => {
  const decoded = decode(props.orders);


  return E.isRight(decoded)
    ? (
      <ul className="main-list">{decoded.right.map(order => <Item 
        order={order}
        key={order._id} />)}</ul>
    )
    : 
    (
      <div>
        <h1>Error Decoding Orders</h1>
        <code>
          <pre>{D.draw(decoded.left)}</pre>
        </code>
      </div>
    )
}


const onChange = Result.match<JSX.Element, {orders: O.Order[]}>(
  e => <h1>Error</h1>,
  l => <h1>Loading</h1>,
  d => <Data orders={d.orders}/>
)

export default () => {
  const result = useQuery<{orders: O.Order[]}>(Queries.Search);
  return onChange(result);
}