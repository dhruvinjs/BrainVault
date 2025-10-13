import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api as apiClient } from "../api/axios";

// ----------------------
// 🔹 TYPE DEFINITIONS
// ----------------------
export interface UserRef {
  _id: string;
  username: string;
}

export interface Content {
  _id: string;
  title: string;
  link: string;
  content?: string;
  type: "twitter" | "youtube" | "article" | "note";
  tags: string[];
  userId: UserRef;
  createdAt?: string;
  updatedAt?: string;
  is_starred: boolean;
}

export interface SavedPost {
  _id: string;
  contentId: { _id: string } | null; // safe handling of nulls
}

export type CreateContentData = {
  title: string;
  link: string;
  type: "twitter" | "youtube" | "article" | "note";
  tags?: string[];
  content?: string;
};

export type UpdateContentData = {
  _id: string;
} & Partial<Omit<CreateContentData, "type">>;

// ----------------------
// 🔹 API FUNCTIONS
// ----------------------
const fetchContents = async (): Promise<Omit<Content, "is_starred">[]> => {
  const { data } = await apiClient.get("/content/view");

  // Example: { success: true, content: [...] }
  // console.log("Fetched contents:", data);

  if (data && Array.isArray(data.content)) {
    return data.content;
  }

  return [];
};

const fetchSavedPostIds = async (): Promise<string[]> => {
  const { data } = await apiClient.get("/saved-posts");

  if (!Array.isArray(data)) return [];

  // Skip invalid/null entries safely
  const validIds = data
    .filter(
      (savedPost: SavedPost): savedPost is SavedPost & { contentId: { _id: string } } =>
        savedPost.contentId !== null && typeof savedPost.contentId._id === "string"
    )
    .map((savedPost) => savedPost.contentId._id);

  if (validIds.length < data.length) {
    console.warn(
      "⚠️ Some saved posts had null contentId and were skipped:",
      data.length - validIds.length
    );
  }

  return validIds;
};

const createContent = async (newContent: CreateContentData): Promise<Content> => {
  const { data } = await apiClient.post("/content/add", newContent);
  return data.newContent;
};

const updateContent = async (updatedData: UpdateContentData): Promise<Content> => {
  const { _id, ...payload } = updatedData;
  const { data } = await apiClient.patch(`/content/update/${_id}`, payload);
  return data.updatedContent;
};

const deleteContent = async (id: string): Promise<void> => {
  await apiClient.delete(`/content/delete/${id}`);
};

const starPost = async (contentId: string): Promise<void> => {
  await apiClient.post("/saved-posts", { contentId });
};

const unstarPost = async (contentId: string): Promise<void> => {
  await apiClient.delete(`/saved-posts/${contentId}`);
};

// ----------------------
// 🔹 REACT QUERY HOOKS
// ----------------------
export const useContentQueries = () => {
  const queryClient = useQueryClient();
  const queryKey = ["contents"];

  // --- GET ALL CONTENTS ---
  const useGetContents = () =>
    useQuery<Content[]>({
      queryKey,
      queryFn: async () => {
        try {
          const [contents, savedPostIds] = await Promise.all([
            fetchContents(),
            fetchSavedPostIds(),
          ]);

          const savedIdsSet = new Set(savedPostIds);

          return contents.map((content) => ({
            ...content,
            is_starred: savedIdsSet.has(content._id),
          }));
        } catch (error) {
          console.error("❌ Query failed in useGetContents:", error);
          return [];
        }
      },
      refetchOnWindowFocus: false,
      retry: 0,
    });

  // --- CREATE ---
  const useCreateContent = () =>
    useMutation({
      mutationFn: createContent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  // --- UPDATE ---
  const useUpdateContent = () =>
    useMutation({
      mutationFn: updateContent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  // --- DELETE ---
  const useDeleteContent = () =>
    useMutation({
      mutationFn: deleteContent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  // --- STAR / UNSTAR ---
  const useToggleStar = () =>
    useMutation({
      mutationFn: async ({
        id,
        is_starred,
      }: {
        id: string;
        is_starred: boolean;
      }) => {
        if (is_starred) {
          await unstarPost(id);
        } else {
          await starPost(id);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  return {
    useGetContents,
    useCreateContent,
    useUpdateContent,
    useDeleteContent,
    useToggleStar,
  };
};
