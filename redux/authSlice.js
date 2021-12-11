import { createSlice } from '@reduxjs/toolkit';

import { AUTH_STATE } from '../constants.js';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    auth_state: AUTH_STATE.NONE,
    user_id: undefined,
    access_token: undefined,
    refresh_token: undefined,
    expires_at: undefined,
  },
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setAuthTokens: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.expires_at = action.payload.expires_at;
    },
    setAuthState: (state, action) => {
      state.auth_state = action.payload;
    },
    setUserInfo: (state, action) => {
      state.user_email = action.payload.email;
      state.user_firstname = action.payload.firstName;
      state.user_lastname = action.payload.lastName;
      state.user_fullname = action.payload.fullName;
      state.created_at = action.payload.createdAt;
    },
    resetAuth: state => {
      state.auth_state = AUTH_STATE.NONE;
      state.user_id = undefined;
      state.access_token = undefined;
      state.refresh_token = undefined;
      state.expires_at = undefined;
    },
    fetchAuthRequest: state => state,
    fetchUserIdRequest: state => state,
    verifyAuthRequest: state => state,
  }
})

export const {
  setUserName,
  setUserId,
  setAuthTokens,
  setAuthState,
  setUserInfo,
  resetAuth,
  fetchAuthRequest,
  fetchUserIdRequest,
  verifyAuthRequest,
} = authSlice.actions;

export const selectAuthState = state => state.auth.auth_state;
export const selectUserId = state => state.auth.user_id;
export const selectUserInfo = state => ({
  email: state.auth.user_email,
  firstName: state.auth.user_firstname,
  lastName: state.auth.user_lastname,
  fullName: state.auth.user_fullname,
  createdAt: state.auth.created_at,
})
export const selectAuthExpiration = state => state.auth.expires_at;
export const selectAccessToken = state => state.auth.access_token;
export const selectRefreshToken = state => state.auth.refresh_token;

export const selectAuthHeader = state => {
  return {"Authorization": "Bearer " + state.auth.access_token}
}

export const selectIsAdmin = state => state.auth.auth_state === AUTH_STATE.ADMIN;

export default authSlice.reducer;
