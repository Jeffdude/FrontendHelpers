import { useReducer, useEffect, useRef, useContext } from 'react'
import { JFHContext } from './index'

export const useReducerWithMiddleware = (
  reducer, initialState, 
  { middlewareFns = [], afterwareFns = [] } = {},
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const aRef = useRef();

  const dispatchWithMiddleware = (action) => {
    middlewareFns.forEach((middlewareFn) =>
      middlewareFn(action, state)
    );

    aRef.current = action;

    dispatch(action);
  };

  useEffect(() => {
    if (!aRef.current) return;

    afterwareFns.forEach((afterwareFn) =>
      afterwareFn(aRef.current, state)
    );

    aRef.current = null;
  }, [afterwareFns, state]);

  return [state, dispatchWithMiddleware];
};

export const useGetDispatch = () => { 
  const [, dispatch] = useContext(JFHContext);
  return dispatch;
}