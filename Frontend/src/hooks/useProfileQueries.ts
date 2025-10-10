// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api as apiClient } from "../api/axios";

// // ----------------------
// // 🔹 TYPE DEFINITIONS
// // ----------------------
// export interface UserRef {
//   _id: string;
//   username: string;
//   email?: string;
// }

// export interface Content {
//   _id: string;
//   title: string;
//   link: string;
//   type: "twitter" | "youtube" | "article" | "note";
//   tags: string[];
//   content?: string;
//   is_starred?: boolean;
// }

// export interface ProfileData {
//   user: UserRef;
//   content: Content[];
// }

// // ----------------------
// // 🔹 API FUNCTIONS
// // ----------------------
// const fetchProfile = async (): Promise<ProfileData> => {
//   const { data } = await apiClient.get("/api/v1/user/checkAuth");
//   if (!data.user || !Array.isArray(data.user.content)) {
//     throw new Error("Failed to fetch profile data");
//   }

//   return {
//     user: data.user,
//     content: data.user.content,
//   };
// };

// const updateProfile = async (updates: { username?: string; password?: string }) => {
//   const { data } = await apiClient.patch("/api/v1/profile/edit", updates);
//   return data; // backend returns { success: true }
// };

// // ----------------------
// // 🔹 REACT QUERY HOOKS
// // ----------------------
// export const useProfileQueries = () => {
//   const queryClient = useQueryClient();
//   const queryKey = ["profile"];

//   // --- GET PROFILE ---
//   const useGetProfile = () =>
//     useQuery<ProfileData>({
//       queryKey,
//       queryFn: fetchProfile,
//       refetchOnWindowFocus: false,
//       retry: 1,
//     });

//   // --- UPDATE PROFILE ---
//   const useUpdateProfile = () =>
//     useMutation({
//       mutationFn: updateProfile,
//       onSuccess: (_, updates) => {
//         queryClient.setQueryData<ProfileData>(queryKey, (old) => {
//           if (!old) return old;
//           return {
//             ...old,
//             user: {
//               ...old.user,
//               ...updates,
//             },
//           };
//         });
//         queryClient.invalidateQueries(queryKey);
//       },
//     });

//   return {
//     useGetProfile,
//     useUpdateProfile,
//   };
// };
