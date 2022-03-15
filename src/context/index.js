import React, { useContext, useReducer } from 'react';

import Cookies from 'universal-cookie';

import { QueryClientProvider } from 'react-query';
import { queryClient } from '../data.js';

import { useReducerWithMiddleware } from './hooks';
import reducer from './reducer';
import { DEFAULT_STATE } from './constants';
import { useRefresh, useLoadUserInfo } from '../hooks/auth.js';

export { useGetDispatch } from './hooks';
export { ACTIONS } from './constants';

export const JFHContext = React.createContext();
JFHContext.displayName = "JFHContext"

const JFHCookies = new Cookies();

const UserLoader = () => {
  useLoadUserInfo();
  return <></>;
}

const JWTRefresher = () => {
  const [{refresh_token, expires_at},] = useContext(JFHContext);
  const refreshToken = useRefresh();
  const [timerTrigger, triggerTimer] = useReducer(state => !state, false);
  React.useEffect(
    () => {
      if(expires_at){
        const timer = setTimeout(() => triggerTimer(), 1000 * 60 * 5) // check again every 5 minutes
        const expirationDate = new Date(expires_at)
        const now = new Date()
        const msLeft = (expirationDate - now)
        if(msLeft < ((1000 * 60 * 60 * 24))){ // < 1 day remaining
          refreshToken({refresh_token})
        }
        return () => clearTimeout(timer);
      }
    }, [expires_at, timerTrigger]
  )
  return <></>
}

const JFHApp = ({config, children}) => {
  const loggingMiddleware = (action, state) => {
    if(state.debug) {
      console.log("[Debug][JFH Action][" + action.type + "]:", {action})
    }
  };
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
        <UserLoader/>
        <JWTRefresher/>
        {children}
      </JFHContext.Provider>
    </QueryClientProvider>
  );
}
export default JFHApp;