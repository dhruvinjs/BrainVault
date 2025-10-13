import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { AxiosError } from "axios";
import {  Content } from "./useContentQueries"; // Assuming types can be imported from here or a central types file
import {User} from './useAuthQueries'
export interface ProfileData {
  user: User;
  content: Content[];
}

interface ProfileUpdates {
  username: string;
}

interface ApiError {
  message: string;
}

// ----------------------
// 🔹 API FUNCTIONS
// ----------------------
const fetchProfile = async (): Promise<ProfileData> => {
  const { data } = await api.get("/user/profile");
  return {
    user: data.user,
    content: data.content ?? [],
  };
};

const updateProfile = async (updates: ProfileUpdates): Promise<{ message: string }> => {
  const { data } = await api.patch("/profile/edit", updates);
  return data;
};

// ----------------------
// 🔹 REACT QUERY HOOKS
// ----------------------
export const useProfileQueries = () => {
  const queryClient = useQueryClient();
  const queryKey = ["profile"];

  // --- GET PROFILE ---
  const useGetProfile = () =>
    useQuery<ProfileData, AxiosError<ApiError>>({
      queryKey,
      queryFn: fetchProfile,
      refetchOnWindowFocus: false,
      retry: 1,
    });

  // --- UPDATE PROFILE ---
  const useUpdateProfile = () =>
    useMutation<{ message: string }, AxiosError<ApiError>, ProfileUpdates>({
      mutationFn: updateProfile,
      onSuccess: () => {
        // Invalidate both profile and auth check to ensure UI consistency
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ["checkAuth"] });
      },
    });

  return {
    useGetProfile,
    useUpdateProfile,
  };
};
