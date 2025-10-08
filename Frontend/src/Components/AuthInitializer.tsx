
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useCheckAuthQuery } from '../store/useAuthStore';

/**
 * This component has two primary responsibilities:
 * 1.  It triggers the initial authentication check when the app loads.
 * 2.  It reacts to the result of that check to update the global state.
 * 3.  It acts as a global navigation guard, redirecting the user based on
 *     their authentication status.
 */
export function AuthInitializer() {
  // 1. Get the live authentication status from the global store and setters.
  const { isAuthenticated, setUser, clearAuth } = useAuthStore();
  
  // 2. Trigger the check to see if a user session exists.
  //    The query itself is now clean and has no side-effects.
  const { data, isSuccess, isError, isLoading } = useCheckAuthQuery();

  const navigate = useNavigate();
  const location = useLocation();

  // 3. This effect reacts to the result of the auth query.
  //    This is the CORRECT place to handle side-effects from a query.
  useEffect(() => {
    if (isSuccess && data?.user) {
      // If the query succeeds, update the global state with the user.
      setUser(data.user);
    } else if (isError) {
      // If the query fails, clear the global authentication state.
      clearAuth();
    }
  }, [isSuccess, isError, data, setUser, clearAuth]);

  // 4. This effect handles navigation based on the authentication state.
  useEffect(() => {
    // Don't do anything while the initial check is still loading.
    if (isLoading) return;

    if (isAuthenticated) {
      // If the user IS authenticated and on a public-only page...
      const publicOnlyPaths = ['/', '/login', '/signup'];
      if (publicOnlyPaths.includes(location.pathname)) {
        // ...redirect them to the dashboard.
        navigate('/dashboard');
      }
    } else {
      // If the user IS NOT authenticated and is on a protected page...
      // (Assuming all routes other than public ones are protected)
      const isProtectedRoute = !['/', '/login', '/register'].includes(location.pathname);
      if (isProtectedRoute) {
        // ...redirect them to the login page.
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // This component does not render anything. Its sole purpose is to handle
  // global authentication side-effects.
  return null;
}
