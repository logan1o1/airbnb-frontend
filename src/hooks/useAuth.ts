import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, clearError } from "../slices/authSlice";
import type { AppDispatch, RootState } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    clearError: handleClearError,
    isAuthenticated,
  };
};
