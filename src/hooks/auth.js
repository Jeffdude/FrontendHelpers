import { useContext } from 'react';

import { useCreateMutation, useGetQuery, queryClient } from '../data';
import { getDateAfter } from '../date';
import { useGetUserId } from './user'

import { JFHContext, useGetDispatch, ACTIONS } from '../context';

const useGetAccessToken = () => {
  const [{access_token},] = useContext(JFHContext);
  return access_token;
}

export const useGetHeader = () => {
  const [{access_token},] = useContext(JFHContext);
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

export function useCreateAccount(){
  const dispatch = useGetDispatch();
  let login = useLogin();
  return useCreateMutation({
    endpoint: "users/create",
    method: "POST",
    verb: "creating account",
    options: {
      onSuccess: async () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      }
    },
    createMutationCallOptions: {
      onSuccess: ({result, submittedData})=> {
        if(result && result.id) {
          dispatch({type: ACTIONS.setUserId, payload: result.id});
          const { email, password } = submittedData;
          return login({email, password});
        }
        return false;
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
      refetchOnWindowFocus: false,
      onSettled: (result) => {
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
      refetchOnWindowFocus: false,
      onSettled: (result) => {
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
    options,
    createMutationCallOptions: { onSuccess: ({result}) => {
      console.log(result);
      if (result && result.accessToken && result.refreshToken && result.expiresIn) {
        dispatch({
          type: ACTIONS.setAuthTokens, 
          payload: {
            access_token: result.accessToken,
            refresh_token: result.refreshToken,
            expires_at: getDateAfter(result.expiresIn),
          },
        });
      }
      return false;
    }}
  })
}

export function useDeleteSelfSession(options) {
  const dispatch = useGetDispatch();
  const accessToken = useGetAccessToken();
  const mutation = useCreateMutation({
    endpoint: "auth/sessions/self",
    method: "DELETE",
    verb: "logging out",
    body: false,
    options: {
      onSuccess: async() => {
        await dispatch({type: ACTIONS.resetAuth});
        queryClient.invalidateQueries('auth');
      }
    }
  })
  return accessToken ? mutation : () => dispatch({type: ACTIONS.resetAuth});
}

export function useLogout() {
  return useDeleteSelfSession();
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
    options: {onSuccess: () => queryClient.invalidateQueries('auth')}
  })
}
/*
  const header = useGetHeader();
  const backendURL = useGetBackendURL();

  const mutationFn  = useMutation(
    ({to_submit}) => fetch(
      backendURL.v1 + "auth/sessions/id/" + to_submit.session_id,
      {
        method: "DELETE",
        headers: header,
      }
    ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('auth');
      },
    }
  );

  return createMutationCall(mutationFn, "disabling session");
}
*/

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

export function useGetAllUsers() {
  return useGetAuthQuery("users/all", {version: "v2"});
}

export function useGetUser(id) {
  return useGetAuthQuery("users/id/" + id, {version: "v2"});
}

export function usePatchUser(userId, options = {}) {
  return useCreateMutation({
    endpoint: "users/id/" + userId,
    method: "PATCH",
    verb: "patching user",
    options,
  })
}
