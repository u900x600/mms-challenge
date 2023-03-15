import { gql } from "@apollo/client"

export const Search = gql`
  query SearchOrders {
    orders {
      _id
      state
      log {
        ... on OrderActionCreate {
          action
          at
          by
          lines
        }

        ...on OrderActionProcess {
          action
          at
          by
        }

        ... on OrderActionClose {
          action
          at
          by
        }

        ... on OrderActionTouch {
          action
          at
          by
          message
        }
      }
    }
  }
`;

export const Process = gql`
  mutation ProcessOrder($id: String!, $by: String!) {
    processOrder(id: $id, by: $by) {
      _id
    }
  }
`;

export const Touch = gql`
  mutation TouchOrder($id: String!, $by: String!, $message: String!) {
    touchOrder(id: $id, by: $by, message: $message) {
      _id
    }
  }
`;


export const Create = gql`
  mutation CreateOrder($by: String!, $lines: [String!]!) {
    createOrder(by: $by, lines: $lines) {
      _id
    }
  }
`;

export const Complete = gql`
  mutation CompleteOrder($id: String!, $by: String!) {
    completeOrder(id: $id, by: $by) {
      _id
    }
  }
`;
