import { useContext } from 'react';
import { ACTIONS, JFHContext } from '../context';

export const useSetDebug = () => {
  const [, dispatch] = useContext(JFHContext);
  return (value) => dispatch({type: ACTIONS.setDebug, payload: !!value});
}

export const useGetDebug = () => {
  const [{debug},] = useContext(JFHContext);
  return debug;
}