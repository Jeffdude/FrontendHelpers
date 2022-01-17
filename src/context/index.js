import React from 'react';

import Cookies from 'universal-cookie';

import { QueryClientProvider } from 'react-query';
import { queryClient } from '../data.js';

import { useReducerWithMiddleware } from './hooks';
import reducer from './reducer';
import { DEFAULT_STATE } from './constants';
import { useLoadUserInfo } from '../hooks/auth.js';

export { useGetDispatch } from './hooks';
export { ACTIONS } from './constants';

export const JFHContext = React.createContext();
JFHContext.displayName = "JFHContext"

const JFHCookies = new Cookies();

const UserLoader = ({children}) => {
  useLoadUserInfo();
  return children;
}

const JFHApp = ({config, children}) => {
  const loggingMiddleware = (action, state) => { if(state.debug) console.log(action) };
  const persistAfterware = (_, state) => {
    JFHCookies.set('JFHCookie', state, {path: '/'})
  }
  const cookieState = JFHCookies.get('JFHCookie');
  const [state, dispatch] = useReducerWithMiddleware(
    reducer, 
    {...DEFAULT_STATE, ...cookieState, ...config, config},
    {
      middlewareFns: [loggingMiddleware],
      afterwareFns: [persistAfterware],
    }
  );
  return (
    <QueryClientProvider client={queryClient}>
      <JFHContext.Provider value={[state, dispatch]}>
        <UserLoader>
          {children}
        </UserLoader>
      </JFHContext.Provider>
    </QueryClientProvider>
  );
}
export default JFHApp;