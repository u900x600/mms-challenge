export default `
  #graphql

  # Everything should be Uppercase
  # I know
  # Changing that would take me too long now
  # I hope one can excuse that
  enum OrderActionType {
    create
    touch
    process
    close
  }

  interface OrderActionCommon {
    at: String!
    by: String!
    action: OrderActionType!
  }

  type OrderActionCreate implements OrderActionCommon {
    at: String!
    by: String!
    action: OrderActionType!
    lines: [String!]!
  }

  type OrderActionTouch implements OrderActionCommon {
    at: String!
    by: String!
    action: OrderActionType!
    message: String!
  }

  type OrderActionProcess implements OrderActionCommon {
    at: String!
    by: String!
    action: OrderActionType!
  }

  type OrderActionClose implements OrderActionCommon {
    at: String!
    by: String!
    action: OrderActionType!
  }

  union OrderAction = OrderActionCreate | OrderActionTouch | OrderActionProcess | OrderActionClose

  enum OrderState {
    OPEN
    IN_PROGRESS
    COMPLETE
  }

  type Order {
    _id: String!
    state: OrderState!
    log: [OrderAction!]!
  }
  

  type Query {
    orders (state: [OrderState!] = []): [Order]
    lookupOrder (id: String!): Order
  }

  type Mutation {
    createOrder (by: String!, lines: [String!]!): Order
    touchOrder (id: String!, by: String!, message: String!): Order
    processOrder (id: String!, by: String!): Order
    completeOrder (id: String!, by: String!): Order
  }
`