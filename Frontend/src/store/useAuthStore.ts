
import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { AxiosError } from 'axios';
import { Content } from '../hooks/useContentQueries';

// 1. Type Definitions
interface User {
  _id: string;
  username: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// CORRECTED: Renamed and added email field
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

// 2. Zustand Store for Auth State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));

// 3. API Functions
const loginUser = async (credentials: LoginCredentials): Promise<{ message: string }> => {
  const { data } = await api.post('/login', credentials);
  return data;
};

// CORRECTED: Renamed function and changed endpoint to /register
const registerUser = async (credentials: RegisterCredentials): Promise<{ message: string }> => {
  const { data } = await api.post('/register', credentials);
  return data;
};

const logoutUser = async (): Promise<{ message: string }> => {
  const { data } = await api.post('/logout');
  return data;
};

const checkAuthStatus = async (): Promise<{ user: User }> => {
  const { data } = await api.get('/user/checkAuth');
  return data;
};

// 4. React Query Hooks
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    LoginCredentials
  >({ 
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
  });
};

// CORRECTED: Renamed hook to useRegisterMutation and updated types
export const useRegisterMutation = () => {
  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    RegisterCredentials
  >({
    mutationFn: registerUser,
  });
};

export const useLogoutMutation = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    AxiosError<ApiError>
  >({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuth();
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
  });
};

export const useCheckAuthQuery = () => {
  return useQuery<
    { user: User },
    AxiosError<ApiError>
  >({
    queryKey: ['checkAuth'],
    queryFn: checkAuthStatus,
    refetchOnWindowFocus: false,
    retry:false
  });
};

export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { user: User },
    AxiosError<ApiError>,
    void
  >({
    mutationFn: async () => {
      console.log("Simulating Google login...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyUser: User = { _id: 'google-user-id', username: 'Google User' };
      return { user: dummyUser };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    }
  });
};

const fetchUserProfile = async (): Promise<{ user: User; content: Content[] }> => {
  const { data } = await api.get('/user/profile');
  return {
    user: data.user,
    content: data.content ?? [],
  };
};



// Profile Query Hook
export const useProfileQuery = () => {
  return useQuery<{ user: User; content: Content[] }, AxiosError<ApiError>>({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
