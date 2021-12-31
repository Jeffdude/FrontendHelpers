import React, { useReducer } from 'react';

const initialState = {
  auth_state: undefined,
  user_id: undefined,
  user_firstname: undefined,
  user_lastname: undefined,
  user_fullname: undefined,
  access_token: undefined,
  refresh_token: undefined,
  expires_at: undefined,
  debug: undefined,
}

export const ACTIONS = {
  setAuthTokens: 'setAuthTokens',
  setUserInfo: 'setUserInfo',
  setDebug: 'setDebug',
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.setAuthTokens:
      const {auth_state, access_token, refresh_token} = action.payload;
      return {...state, auth_state, access_token, refresh_token}

    case ACTIONS.setUserInfo:
      const { user_id, user_firstname, user_lastname } = action.payload;
      return {
        ...state, user_id, user_firstname, user_lastname, 
        user_fullname: user_firstname + " " + user_lastname,
      }

    case setDebug:
      return {...state, debug: action.payload}

    default:
      throw new Error("Unrecognized reducer action");
  }
}

const JFHContext = React.createContext();
JFHContext.displayName = "JFHContext"

export const JFHProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <JFHContext.Provider value={[state, dispatch]}>{children}</JFHContext.Provider>
  );
}