import React from "react";

import List from './List';
import { Create } from './OrderActions'



const Loading = (props: {info: string}) => <div className="loading">
  <h3>Loading :: {props.info}</h3>
</div>


export default () => <main className="main">
  <List />
  <Create />
</main>