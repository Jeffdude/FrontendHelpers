import { useContext } from 'react';

import { useCreateMutation, useGetQuery, queryClient, mergeQueryOptions } from '../data';
import { getDateAfter } from '../date';
import { useGetUserId } from './user'

import { JFHContext, useGetDispatch, ACTIONS } from '../context';

const useGetAccessToken = () => {
  const [{access_token},] = useContext(JFHContext);
  return access_token;
}

export const useGetHeader = () => {
  const [{access_token},] = useContext(JFHContext);
  if(!access_token){
    return undefined;
  }
  return {Authorization: 'Bearer ' + access_token}
}

export const useGetAuthState = () => {
  const [{auth_state,},] = useContext(JFHContext);
  return auth_state;
}

function useGetAuthQuery(endpoint, options) {
  return useGetQuery(
    endpoint,
    'auth', //global key for this file
    options,
  )
}

export const invalidateCache = () => {
  queryClient.invalidateQueries('user');
  queryClient.invalidateQueries('users');
  queryClient.invalidateQueries('auth');
}

export function useCreateAccount(options = {}){
  const dispatch = useGetDispatch();
  let login = useLogin();
  return useCreateMutation({
    endpoint: "users/create",
    method: "POST",
    verb: "creating account",
    options: mergeQueryOptions(options, { onSuccess: invalidateCache }),
    createMutationCallOptions: {
      onSuccess: ({result, submittedData})=> {
        if(result && result.id) {
          const { email, password } = submittedData;
          return login({email, password});
        }
        return {result: false};
      }
    }
  })
}

export function useLoadUserInfo(){
  const dispatch = useGetDispatch();
  const accessToken = useGetAccessToken();
  useGetAuthQuery(
    "users/self",
    {
      enabled: !!accessToken,
      version: "v2",
      refetchOnWindowFocus: false,
      onSettled: ({ result }) => {
        if(result?.id){
          dispatch({type: ACTIONS.setUserId, payload: result.id})
        } else {
          console.log("[!] Error fetching userId:", result);
        }
      }
    }
  )
  const userId = useGetUserId();
  useGetAuthQuery(
    "users/id/" + userId,
    {
      enabled: !!userId,
      version: "v2",
      refetchOnWindowFocus: false,
      onSettled: ({ result }) => {
        if(!result){
          console.log("[!] Error fetching user info:", result);
          dispatch({type: ACTIONS.resetAuth})
        } else {
          dispatch({type: ACTIONS.setUserInfo, payload: result})
        }
      }
    }
  )
}

export function useLogin(options = {}){
  const dispatch = useGetDispatch();
  return useCreateMutation({
    endpoint: "auth",
    method: "POST",
    verb: "logging in",
    options: mergeQueryOptions(options, { onSuccess: invalidateCache }),
    createMutationCallOptions: { onSuccess: ({result}) => {
      if (result && result.accessToken && result.refreshToken && result.expiresIn) {
        dispatch({
          type: ACTIONS.setAuthTokens, 
          payload: {
            access_token: result.accessToken,
            refresh_token: result.refreshToken,
            expires_at: getDateAfter(result.expiresIn),
          },
        });
        return {result: true}
      }
      return {result: false};
    }}
  })
}

export function useLogout(options = {}) {
  const dispatch = useGetDispatch();
  const accessToken = useGetAccessToken();
  const mutation = useCreateMutation({
    endpoint: "auth/sessions/self",
    method: "DELETE",
    verb: "logging out",
    body: false,
    options: mergeQueryOptions(options, { onSuccess: async () => {
      await dispatch({type: ACTIONS.resetAuth});
      invalidateCache();
    }}),
  })
  return accessToken ? mutation : () => dispatch({type: ACTIONS.resetAuth});
}

export function useGetSessions() {
  return useGetAuthQuery("auth/sessions/self", {version: "v2"});
}

//New interface! (sessionId in body, not endpoint) TODO: Double check these calls
export function useDisableSession(){
  return useCreateMutation({
    endpoint: "auth/session",
    method: "DELETE",
    verb: "disabling session",
    options: {onSuccess: invalidateCache}
  })
}

export function useAdminResetUserPassword(options = {}){
  return useCreateMutation({
    endpoint: "auth/reset_password/admin",
    method: "POST",
    verb: "resetting password with admin priviledges",
    options,
  })
}

export function useDeleteUser(userId, options = {}) {
  return useCreateMutation({
    endpoint: "users/id/" + userId,
    method: "DELETE",
    verb: "deleting user",
    options,
  })
}

export function useCreateUser(options = {}) {
  return useCreateMutation({
    endpoint: "users/create",
    method: "POST",
    verb: "creating user",
    options,
  })
}

export function useGetSelf(options = {}){
  const userId = useGetUserId()
  return useGetAuthQuery("users/id/" + userId, {...options, enabled: !!userId, version: "v2"})
}

export function useGetAllUsers() {
  return useGetAuthQuery("users/all", {version: "v2"});
}

export function useGetUser(id) {
  return useGetAuthQuery("users/id/" + id, {version: "v2"});
}

export function usePatchUser(userId, options = {}) {
  if(userId === undefined){
    userId = useGetUserId();
  }
  return useCreateMutation({
    endpoint: "users/id/" + userId,
    method: "PATCH",
    verb: "patching user",
    options: mergeQueryOptions(options, { onSuccess: invalidateCache }),
  })
}
