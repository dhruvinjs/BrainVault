
import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery } from "../store/useAuthStore";

/**
 * ProtectedLayout: A gatekeeper for private pages.
 *
 * This component wraps all routes that should only be accessible to authenticated
 * users.
 *
 * How it works:
 * 1. It uses the `useCheckAuthQuery` to determine the user's login status.
 * 2. While the query is loading, it renders nothing to prevent flickers.
 * 3. If the query fails (no user is logged in), it automatically redirects
 *    the user to the "/login" page.
 * 4. If the query succeeds (user is logged in), it renders the requested
 *    child component (e.g., Dashboard, Profile) using the <Outlet /> component.
 */
export const ProtectedLayout = () => {
  const { isSuccess, isLoading, isError } = useCheckAuthQuery();

  // While we're checking the user's status, we don't render anything.
  if (isLoading) {
    return null; 
  }

  // If the auth check failed (isError) or didn't return a success state with a user,
  // we know the user is not logged in. Redirect them to the login page.
  // The `replace` prop prevents the user from navigating "back" to the protected page.
  if (isError || !isSuccess) {
    return <Navigate to="/login" replace />;
  }

  // If the auth check was successful, we render the intended child route.
  return <Outlet />;
};
