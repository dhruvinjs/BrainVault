
import { useMutation,useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';
import { AxiosError } from 'axios';
import { Content } from './useContentQueries';

const baseUrl = import.meta.env.VITE_BASE_URL;
const frontEndBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL;

// 1. Type Definitions
// interface ShareResponse {
//   link: string;
// }
export interface BrainData {
  ownerName: string;
  posts: Content[];
}
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


const fetchPublicBrain = async (brainId: string): Promise<BrainData & { isPrivate: boolean }> => {
  const res = await api.get(`/brain/${brainId}`);

  // Check if brain is private
  if (res.data?.private === true || res.data?.success === false) {
    return {
      ownerName: res.data?.username?.username || "Unknown User",
      posts: [],
      isPrivate: true,
    };
  }

  const brain = res.data.brain;
  const username = res.data.username;

  return {
    ownerName: username?.username || brain.userId?.username || "Unknown User",
    posts: brain.content.map((item: any) => ({
      _id: item._id,
      title: item.title,
      link: item.link,
      content: item.content,
      type: item.type,
      tags: item.tags || [],
      createdAt: item.createdAt || item.created_at,
      is_starred: item.is_starred || false,
    })),
    isPrivate: false,
  };
};

export const usePublicBrainQuery = (brainId: string) => {
  return useQuery<BrainData & { isPrivate: boolean }, AxiosError<ApiError>>({
    queryKey: ['publicBrain', brainId],
    queryFn: () => fetchPublicBrain(brainId),
    enabled: !!brainId,
  });
};


