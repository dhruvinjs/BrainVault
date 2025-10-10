
import { useEffect } from 'react';
import { useAuthStore, useCheckAuthQuery } from '../store/useAuthStore';

export const AuthStateSyncer = () => {
  const { setUser, clearAuth } = useAuthStore();
  const { data, isSuccess, isError } = useCheckAuthQuery();

  useEffect(() => {
    // When the API call succeeds, it means we have a valid user.
    // We update the global store with the user's data.
    if (isSuccess && data?.user) {
      setUser(data.user);
    }
    
    // When the API call fails, it means the user is not authenticated.
    // We clear any existing user data from the global store.
    if (isError) {
      clearAuth();
    }
  }, [isSuccess, isError, data, setUser, clearAuth]);

  // This component is for logic only and renders no UI.
  return null;
};
