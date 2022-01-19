import { useContext } from 'react';

import { JFHContext } from '../context';

export const useGetUserId = () => {
  const [{user_id},] = useContext(JFHContext);
  return user_id;
}

export const useGetUserInfo = () => {
  const [{ user_id, user },] = useContext(JFHContext);
  return { ...user, user_id }
}