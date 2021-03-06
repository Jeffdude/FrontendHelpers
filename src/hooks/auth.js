import { useRef, useContext, useEffect } from 'react';

import { useCreateMutation, useGetQuery, queryClient, mergeQueryOptions } from '../data';
import { getDateAfter } from '../date';
import { useGetUserId } from './user'

import { JFHContext, useGetDispatch, ACTIONS } from '../context';

export const useGetAccessToken = () => {
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

export function invalidateJFHCache() {
  queryClient.invalidateQueries();
}

export function useCreateAccount(options = {}){
  const dispatch = useGetDispatch();
  let login = useLogin();
  return useCreateMutation({
    endpoint: "users/create",
    method: "POST",
    verb: "creating account",
    options: mergeQueryOptions(options, { onSuccess: invalidateJFHCache }),
    createMutationCallOptions: {
      version: 1,
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useLoadUserInfo(){
  const dispatch = useGetDispatch();
  const accessToken = useGetAccessToken();
  const userId = useGetUserId();
  const previous = usePrevious({accessToken})

  const { refetch : refetchId } = useGetAuthQuery(
    "users/self",
    {
      enabled: false,
      version: "v2",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      onSettled: (data, error) => {
        if(error || !data?.result) {
          console.log("[!] Error fetching userId:", error, data?.result);
          dispatch({type: ACTIONS.resetAuth});
        }
        if(data?.result?.id){
          dispatch({type: ACTIONS.setUserId, payload: data.result.id})
        }
      }
    }
  )
  useEffect(() => {
    if(!!accessToken && !userId && previous?.accessToken !== accessToken){
      refetchId()
    }
  }, [accessToken, userId])

  useGetAuthQuery(
    "users/id/" + userId,
    {
      enabled: !!userId,
      version: "v2",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      onSettled: (data, error) => {
        if(error || !data?.result){
          console.log("[!] Error fetching user info:", data?.result);
          dispatch({type: ACTIONS.resetAuth})
        } else {
          dispatch({type: ACTIONS.setUserInfo, payload: data.result})
        }
      }
    }
  )
}

export function useRefresh(options = {}){
  const dispatch = useGetDispatch();
  return useCreateMutation({
    endpoint: "auth/refresh",
    method: "POST",
    verb: "refreshing token",
    options,
    createMutationCallOptions: { version: 1, onSuccess: ({result}) => {
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

export function useLogin(options = {}){
  const dispatch = useGetDispatch();
  return useCreateMutation({
    endpoint: "auth",
    method: "POST",
    verb: "logging in",
    options: mergeQueryOptions(options, { onSuccess: invalidateJFHCache }),
    createMutationCallOptions: { version: 1, onSuccess: ({result}) => {
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
      invalidateJFHCache();
    }}),
  })
  return accessToken ? mutation : () => {
    dispatch({type: ACTIONS.resetAuth});
  }
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
    options: {onSuccess: invalidateJFHCache}
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
    options: mergeQueryOptions(options, { onSuccess: invalidateJFHCache }),
  })
}

export function useCreatePasswordResetToken(options = {}){
  return useCreateMutation({
    endpoint: 'auth/token/password_reset',
    method: 'POST',
    verb: 'creating password reset token',
    ...options
  })
}

export function usePasswordResetWithToken(token, options = {}){
  return useCreateMutation({
    noAuth: true,
    endpoint: 'auth/reset_password/token/' + token,
    method: 'POST',
    verb: 'resetting password with a token',
  })
} 