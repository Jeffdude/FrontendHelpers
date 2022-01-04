import { useContext } from 'react';

import { JFHContext } from '../context';

export const useGetUserId = () => {
  const [{user_id},] = useContext(JFHContext);
  return user_id;
}

export const useGetUserInfo = () => {
  const [{
    user_id, user_firstName, user_lastName, user_email, user_createdAt
  },] = useContext(JFHContext);
  return {
    user_id, user_firstName, user_lastName, user_email, user_createdAt,
    user_fullName: user_firstName + " " + user_lastName,
  }
}