import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axios';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 1. Type Definitions
export interface User {
  _id: string;
  username: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

// 2. API Functions
const loginUser = async (credentials: LoginCredentials): Promise<{ user: User }> => {
  const { data } = await api.post('/login', credentials);
  return data;
};

const registerUser = async (credentials: RegisterCredentials): Promise<{ user: User }> => {
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

// 3. React Query Hooks

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ user: User }, AxiosError<ApiError>, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const nav=useNavigate()
  return useMutation<{ user: User }, AxiosError<ApiError>, RegisterCredentials>({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration Successfull")
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
      nav('/dashboard')
    },
    onError:(err)=>{
      const msg=err.response?.data?.message || "Registration Failed"
      toast.error(msg)
    }
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, AxiosError<ApiError>>({
    mutationFn: logoutUser,
    onSuccess: () => {
      // On logout, invalidate auth status and clear the entire query cache for a clean state.
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
      queryClient.clear();
    },
  });
};

// Check Auth Query
export const useCheckAuthQuery = () => {
  return useQuery<{ user: User }, AxiosError<ApiError>>({
    queryKey: ['checkAuth'],
    queryFn: checkAuthStatus,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

// Google Login Mutation (dummy)
export const useGoogleRegisterMutation = () => {
  const queryClient = useQueryClient();
  const nav=useNavigate()
  return useMutation<{ user: User;message:string }, AxiosError<ApiError>,string, void>({
    mutationFn: async (token) => {
      const response=await api.post('/auth/google',{token})
      return response.data


    },
    onSuccess: () => {
      nav('/dashboard',)
      toast.success("Google Registration Successful")
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
    },
    onError:(err)=>{
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);    
    }
  });
};


export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation<{ message: string; success: boolean }, AxiosError<ApiError>, string>({
    mutationFn: async (token) => {
      const res = await api.post('/auth/google/login', { token });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Google login successful");
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
      nav('/dashboard', { replace: true });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Google login failed";
      toast.error(msg);
    },
  });
};