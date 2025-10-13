
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/axios';
import { AxiosError } from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;
const frontEndBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL;

// 1. Type Definitions
// interface ShareResponse {
//   link: string;
// }

interface ApiError {
  message: string;
}

interface ShareBrainOutput {
  shareLink: string;
  frontendLink: string;
}

// 2. API Function
const shareBrain = async (share: boolean): Promise<ShareBrainOutput> => {
  const res = await api.patch("/brain/share", { share });
  
  if (share) {
    const link = res?.data?.link;
    if (!link) {
      throw new Error("Failed to retrieve share link from API.");
    }
    return {
      shareLink: `${baseUrl}/brain/${link}`,
      frontendLink: `${frontEndBaseUrl}/anotherBrain/${link}`
    };
  } else {
    // When un-sharing, return empty links
    return {
      shareLink: "",
      frontendLink: ""
    };
  }
};

// 3. React Query Hook
export const useShareBrainMutation = () => {
  return useMutation<ShareBrainOutput, AxiosError<ApiError>, boolean>({
    mutationFn: shareBrain,
  });
};
