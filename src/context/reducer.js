import { ACTIONS } from './constants';
import { permissionLevelToAuthState } from '../constants'

export default function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.setAuthTokens:
      const {access_token, refresh_token, expires_at} = action.payload;
      return {...state, access_token, refresh_token, expires_at}

    case ACTIONS.resetAuth:
      return {
        ...state,
        auth_state: undefined,
        access_token: undefined,
        refresh_token: undefined,
        expires_at: undefined,
        user_id: undefined,
        user_firstName: undefined,
        user_lastName: undefined,
        user_email: undefined,
        user_createdAt: undefined,
      }

    case ACTIONS.setUserId:
      const id = action.payload;
      return {...state, user_id: id}

    case ACTIONS.setUserInfo:
      const { permissionLevel, firstName, lastName, email, createdAt } = action.payload;
      return {
        ...state,
        auth_state: permissionLevelToAuthState(permissionLevel),
        user_firstName: firstName,
        user_lastName: lastName, 
        user_email: email,
        user_createdAt: createdAt,
      }

    case ACTIONS.setDebug:
      return {...state, debug: action.payload}

    default:
      throw new Error("Unrecognized reducer action");
  }
}
