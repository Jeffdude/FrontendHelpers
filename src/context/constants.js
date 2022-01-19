export const DEFAULT_STATE = {
  auth_state: undefined,
  access_token: undefined,
  refresh_token: undefined,
  expires_at: undefined,

  user_id: undefined,
  user: {},

  backendURL: "http://192.168.0.88:3600",
  debug: true,
}

export const ACTIONS = {
  setAuthTokens: 'setAuthTokens',
  resetAuth: 'resetAuth',
  setUserId: 'setUserId',
  setUserInfo: 'setUserInfo',
  setDebug: 'setDebug',
}