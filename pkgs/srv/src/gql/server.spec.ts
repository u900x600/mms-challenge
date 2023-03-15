import { describe, it, expect } from "vitest";

import * as Srv from './server';

describe('gql/server', () => {

  const createOrder = async (by: string, lines: readonly string[]) => await Srv
    .create()
    .executeOperation({
      query: `
          mutation CreateOrder ($by: String!, $lines: [String!]!) { 
            createOrder(by: $by, lines: $lines) { 
              _id 
            }  
          }`,
        variables: { by, lines}
    });

  it ('creates orders', async () => {
    const 
      resp = await createOrder('test', [])
    ;

    expect(resp.body.kind).to.eql('single');
    //@ts-ignore
    expect(resp.body.singleResult.errors).toBeUndefined();
  });

  it ('searches orders', async () => {
    // create at least one order to find
    // in case the dab is empty
    await createOrder('test', []);

    const 
      srv = Srv.create(),
      resp = await srv.executeOperation({
        query: `
          query SearchOrder {
            orders {
              _id
              log {
                ... on OrderActionCreate {
                  at
                  action
                }
              }
            }
          }
        `,
        variables: { by: 'test', lines: ['line1'] }
      });

    expect(resp.body.kind).to.eql('single');
    //@ts-ignore
    expect(resp.body.singleResult.errors).toBeUndefined();
  });

  it ('lookup', async () => {
    //@ts-ignore
    const { body: { singleResult: { data: { createOrder: { _id } } } }} = await createOrder('test', ['line1', 'line2']);

    const resp = await Srv.create().executeOperation({
      query: `
        query LookupOrder ($id: String!) {
          lookupOrder (id: $id) {
            log {
              ... on OrderActionCreate {
                by
                lines
              }
            }
          }
        }`,
        variables: { id: _id }
    });
    

    // @ts-ignore
    const { log: [{ by, lines: [l1, l2]} ] } = resp.body.singleResult.data.lookupOrder;
    
    expect(by).to.eq('test');
    expect(l1).to.eq('line1');
    expect(l2).to.eq('line2');
    
  });

  it('touchOrder', async () => {
    //@ts-ignore
    const { body: { singleResult: { data: { createOrder: { _id } } } }} = await createOrder('test', ['line1', 'line2']);

    const resp = await Srv.create().executeOperation({
      query: `
        mutation TouchOrder ($id: String!, $by: String!, $msg: String!) {
          touchOrder (id: $id, by: $by, message: $msg) {
            _id
            log {
              ... on OrderActionCreate {
                lines
              }

              ... on OrderActionTouch {
                message
              }
            }
          }
        }
        
      `,
      variables: { id: _id, by: 'test2', msg: 'Test Touch' }
    });


    // @ts-ignore
    const { _id: id, log: [_, { message }] } = resp.body.singleResult.data.touchOrder;

    
    expect(message).to.eq('Test Touch');
  });

  it ('processOrder', async () => {
    //@ts-ignore
    const { body: { singleResult: { data: { createOrder: { _id } } } }} = await createOrder('test', ['line1', 'line2']);

    const resp = await Srv.create().executeOperation({
      query: `
        mutation ProcessOrder($id: String!, $by: String!) {
          processOrder (id: $id, by: $by) {
            state,
            log {
              ... on OrderActionProcess {
                by
                at
              }
            }
          }
        }
      `,
      variables: { by: 'Test', id: _id }
    });

    //@ts-ignore
    const  { body: { singleResult: { data: { processOrder: { state, log: [_, { by }] } }}}} = resp;

    expect(state).to.eq('IN_PROGRESS');
    expect(by).to.eq('Test');
   
  })

})