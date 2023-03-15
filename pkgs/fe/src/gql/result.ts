import { QueryResult } from '@apollo/client';

export const match = <B, A>(
  onError:    (e: QueryResult<A>['error']) => B,
  onLoading:  (l: QueryResult<A>['loading']) => B,
  onData:     (d: QueryResult<A>['data']) => B
) => (result: QueryResult<A>): B => {
  if (result.error) {
    return onError(result.error);
  
  } else if (result.loading) {
    return onLoading(result.loading);
  
  } else {
    return onData(result.data)
  }
}