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
  const valid = header !== undefined;

  // caching invalidations from either
  const cache = Array.isArray(key) ? key.concat(endpoint) : [key, endpoint];
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
    if (query.status === 'loading' || query.isFetching){
      if (debug && valid) console.log("[Debug][GET][" + version + "][" + endpoint + "] Loading...")
    }
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
    if (debug && query.status === 'success' && !query.isFetching) console.log("[Debug][GET][" + version + "][" + endpoint + "] Success.")
    return query;
  } catch (error) {
    console.log("[!] Error fetching", key, "endpoint \"", endpoint, "\":", error);
    return { data: {}, error: error, status: 'error'}
  }
}

export function useCreateMutation(
  {endpoint, method, headers = {}, verb, body = true, noAuth = false, options, createMutationCallOptions}
) {
  const authHeader = useGetHeader();
  const backendURL = useGetBackendURL();
  const debug = useGetDebug();

  const mutationFn  = useMutation(
    ({to_submit}) => fetch(
      backendURL.v1 + endpoint,
      {
        method,
        headers: {
          ...(noAuth ? {} : authHeader),
          ...(body ? {"Content-Type": "application/json"} : {}),
          ...headers,
        },
        body: body ? JSON.stringify(to_submit) : undefined,
      },
    ),
    mergeQueryOptions(options, {
      onMutate: ({ to_submit }) => {
        if(debug) console.log(`[Debug][${method}][v1][${endpoint}] Submitting:`, to_submit)
      },
      onSuccess: ({ to_submit }) => {
        if(debug) console.log(`[Debug][${method}][v1][${endpoint}] Success.`)
      }
    })
  )
  return createMutationCall(mutationFn, verb, createMutationCallOptions)
}

export function createMutationCall(mutationFn, mutationVerb, { version = 2, onSuccess } = {}) {
  const { mutateAsync, error, status } = mutationFn;
  return async (to_submit) => {
    let queryResult, body;
    try {
      queryResult = await mutateAsync({to_submit})
      body = await queryResult.json();
    } catch (error) {
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (error){
      console.log("[!] Error", mutationVerb, ":", error);
      return {result: false, status};
    }
    if (!queryResult || body.error || !queryResult.ok){
      console.log("[!] Error", mutationVerb, ":", queryResult.status, body?.error);
      return {result: false, status, error: body?.error};
    }
    if (queryResult.ok){ 
      let result = body;
      if(version === 2) result = body.result;
      return onSuccess ? onSuccess({result, status, submittedData: to_submit}) : {result, status};
    }
    return {result: false, status};
  }
}

export function onQuerySuccess(query, thenFn, {loadingComponent, name = "Resource", pageCard = false} = {}) {
  if(query.status === 'loading' || query.status === 'idle') {
    if(loadingComponent) return loadingComponent();
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

export function QueryLoader({query, propName, generateQuery = false, pageCard, loading, children, ...props}) {
  if(generateQuery) query = query();
  return onQuerySuccess(query, (data) => {
    if(!data.result) return (<h3>{propName} Not Found.</h3>);
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {[propName]: data.result, ...props})
      }
      return child;
    });
  }, {name: propName, pageCard, loadingComponent: loading});
}

/*
 * sometimes various middlewares will do naive {...options, key: value} merging
 *  which can overwrite functions. This will do naive merge, and for whitelisted
 *  function option keys, will execute both functions
 */
export function mergeQueryOptions(...optionsList) {
  let result = {};
  const onFns = {onMutate: [], onSuccess: [], onError: [], onSettled: []};
  optionsList.forEach(options => {
    for (const key in options) {
      if(["onMutate", "onSuccess", "onError", "onSettled"].includes(key)) {
        onFns[key].push(options[key])
      } else {
        result[key] = value
      }
    }
  });
  for (const fn in onFns) {
    result[fn] = (...args) => {
      onFns[fn].forEach(onFn => onFn(...args))
    }
  }
  return result;
}
