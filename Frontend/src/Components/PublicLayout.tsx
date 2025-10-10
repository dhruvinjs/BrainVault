
import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery } from "../store/useAuthStore";

/**
 * PublicLayout: A gatekeeper for public-only pages.
 *
 * This component wraps routes like /login and /register that an authenticated
 * user should not be able to see.
 *
 * How it works:
 * 1. It checks the user's login status.
 * 2. While loading, it renders nothing.
 * 3. If the user IS logged in, it automatically redirects them away from the
 *    public page to their "/dashboard".
 * 4. If the user is NOT logged in, it shows the requested public page (e.g., the
 *    login form).
 */
export const PublicLayout = () => {
  const { isSuccess, isLoading } = useCheckAuthQuery();

  if (isLoading) {
    return null;
  }

  // If the user is successfully logged in, redirect them away from the public page.
  if (isSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is not logged in, render the intended public page (Login, Register, etc.).
  return <Outlet />;
};
