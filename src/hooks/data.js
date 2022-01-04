import { useContext } from 'react';

import { JFHContext } from '../context';


export const useGetBackendURL = () => {
  const [{backendURL},] = useContext(JFHContext);
  return {
    backendURL,
    v1: backendURL + "/api/v1/",
    v2: backendURL + "/api/v2/",
  }
}