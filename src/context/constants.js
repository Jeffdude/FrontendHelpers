export const DEFAULT_STATE = {
  auth_state: undefined,
  access_token: undefined,
  refresh_token: undefined,
  expires_at: undefined,

  user_id: undefined,
  user_firstName: undefined,
  user_lastName: undefined,
  user_email: undefined,
  user_createdAt: undefined,

  debug: true,
}

export const ACTIONS = {
  setAuthTokens: 'setAuthTokens',
  resetAuth: 'resetAuth',
  setUserId: 'setUserId',
  setUserInfo: 'setUserInfo',
  setDebug: 'setDebug',
}