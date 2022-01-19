import { ACTIONS, DEFAULT_STATE } from './constants';
import { permissionLevelToAuthState } from '../constants'

export default function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.setAuthTokens:
      const {access_token, refresh_token, expires_at} = action.payload;
      return {...state, access_token, refresh_token, expires_at}

    case ACTIONS.resetAuth:
      return {...DEFAULT_STATE, ...state.config};

    case ACTIONS.setUserId:
      const id = action.payload;
      return {...state, user_id: id}

    case ACTIONS.setUserInfo:
      const { permissionLevel, ...userInfo} = action.payload;
      return {
        ...state,
        auth_state: permissionLevelToAuthState(permissionLevel),
        user: userInfo
      }

    case ACTIONS.setDebug:
      return {...state, debug: action.payload}

    default:
      throw new Error("Unrecognized reducer action");
  }
}
