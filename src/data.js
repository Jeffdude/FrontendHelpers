import React from 'react';

import { useQuery, useMutation, QueryClient  } from 'react-query';
import { useGetHeader } from './hooks/auth';
import { useGetBackendURL } from './hooks/data';
import { useGetDebug } from './hooks/debug';

import { InfoListFromObject } from './lists';

export const queryClient = new QueryClient();

export function useGetQuery(endpoint, key, { version = "v1", ...options } = {}) {
  const backendURL = useGetBackendURL();
  const header = useGetHeader();
  const debug = useGetDebug();
  const enabled = (options?.enabled !== undefined ? options.enabled : true) && header !== undefined;

  // caching invalidations from either
  const cache = Array.isArray(key) ? key.concat(endpoint) : [key, endpoint];
  if (debug && enabled) console.log("[Debug][GET][" + version + "][" + endpoint + "] Loading...")
  try {
    const query = useQuery(
      cache,
      () => fetch(
        (version === "v1" ? backendURL.v1 : backendURL.v2) + endpoint,
        {
          method: "GET",
          headers: header,
        },
      ).then(res => res.json()),
      options,
    )
    if (query.error) {
      console.log(
        "[!] Error fetching", key, "endpoint \"", endpoint, "\":", query.error
      );
      return query;
    }
    if (query.data && query.data.error){
      console.log(
        "[!] Error fetching", key, "endpoint \"", endpoint, "\":", query.error
      );
      return query;
    }
    if (debug && enabled) console.log("[Debug][GET][" + version + "][" + endpoint + "] Success.")
    return query;
  } catch (error) {
    console.log("[!] Error fetching", key, "endpoint \"", endpoint, "\":", error);
    return { data: {}, error: error, status: 'error'}
  }
}

export function useCreateMutation(
  {endpoint, method, headers = {}, verb, body = true, options, createMutationCallOptions}
) {
  const authHeader = useGetHeader();
  const backendURL = useGetBackendURL();
  const mutationFn  = useMutation(
    ({to_submit}) => fetch(
      backendURL.v1 + endpoint,
      {
        method,
        headers: {
          ...authHeader,
          ...(body ? {"Content-Type": "application/json"} : {}),
          ...headers,
        },
        body: body ? JSON.stringify(to_submit) : undefined,
      },
    ),
    options,
  )
  return createMutationCall(mutationFn, verb, createMutationCallOptions)
}

export function createMutationCall(mutationFn, mutationVerb, { onSuccess } = {}) {
  const { mutateAsync, error, status } = mutationFn;
  return async (to_submit) => {
    let result;
    try {
      result = await mutateAsync({to_submit})
    } catch (error) {
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (error){
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (!result || result.error || !result.ok){
      console.log("[!] Error", mutationVerb, ":", result.status, result?.error);
      return {result: false, status};
    }
    if (result){ 
      result = await result.json();
      return onSuccess ? onSuccess({result: result.result, status, submittedData: to_submit}) : {result: result.result, status};
    }
    return {result: false, status};
  }
}

export function onQuerySuccess(query, thenFn, {name = "Resource", pageCard = false} = {}) {
  if(query.status === 'loading' || query.status === 'idle') {
    return (
      <div>
        {name} loading...
      </div>
    )
  }
  if(query.status !== 'success') {
    console.log("[QueryLoader][Error Loading: " + name + "]",
      {
        status: query.status, error: JSON.stringify(query.error),
        data: query.data,
      },
    )
    return (
      <div>
        <h3 className="error-text">Error loading {name}!</h3>
        <InfoListFromObject data={{
          status: query.status,
          error: JSON.stringify(query.error) ,
          data: query.data 
            ? JSON.stringify(query.data).slice(0, 50) + "..."
            : query.data,
        }}/>
      </div>
    )
  }
  if (!Object.hasOwnProperty.call(query.data, 'result')) {
    console.log("[QueryLoader][No Data][Loading " + name + "]",
      {
        status: query.status, error: JSON.stringify(query.error),
        data: query.data,
      },
    )
  }
  return thenFn(query.data);
}

export function QueryLoader({query, propName, pageCard, children, ...props}) {
  return onQuerySuccess(query, (data) => {
    if(!data.result) return (<h3>{propName} Not Found.</h3>);
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[propName]: data.result, ...props})
      }
      return child;
    });
  }, {name: propName, pageCard});
}

/*
 * sometimes various middlewares will do naive {...options, key: value} merging
 *  which can overwrite functions. This will do naive merge, and for whitelisted
 *  function option keys, will execute both functions
 */
export function mergeQueryOptions(...optionsList) {
  let result = {};
  optionsList.forEach(options => Object.entries(options).forEach(([key, value]) => {
    if(result?.key && ["onMutate", "onSuccess", "onError", "onSettled"].includes(result.key)) {
      result[key] = (...queryResults) => {
        result[key](...queryResults);
        value(...queryResults);
      }
    } else {
      result = {...result, [key]: value}
    }
  }));
  return result;
}
