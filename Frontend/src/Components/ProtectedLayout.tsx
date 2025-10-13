
import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery, useLogoutMutation } from "../hooks/useAuthQueries";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { LoadingScreen } from "./LoadingScreen"; // Import the new component

export const ProtectedLayout = () => {
  const { isSuccess, isLoading, isError, isFetched } = useCheckAuthQuery();
  const { mutate: logout } = useLogoutMutation();

  useEffect(() => {
    if (isError) {
      toast.error("Session expired, please login again.");
      logout();
    }
  }, [isError, logout]);

  // Use the new LoadingScreen component
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isFetched && !isSuccess) {
    return <Navigate to="/login" replace />;
  }

  if (isSuccess) {
    return <Outlet />;
  }

  return null;
};
