import { create } from "zustand"
import { api } from "../api/axios";


export type Content = {
  _id?: string;
  title: string;
  type: string;
  link: string;
  tags: string[];
};

export interface UpdatedContent {
  _id: string;
  link?: string;
  title?: string;
  type?: string;
  tags?: string[];
}

export interface SavedPost{
  _id:string,
  contentId:string,
  userId:string,
}

export const contentStore = create((set, get:any) => ({
  content: null,        
  loading: false,       
  modalOpen: false,     
  error: null,          
  savedPosts: [],
  savedPostIds: [], 


  toggleModal: () => {
    //@ts-ignore
    const current = get().modalOpen
    set({ modalOpen: !current });
  },

  addContent: async (data: Content) => {
    set({ loading: true, error: null });
    try {
      await api.post("/content/add", data);
      //@ts-ignore
      await get().viewContent();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add content";
      set({ error: errMsg,loading:false });
      console.log("Failed to add content:", err);
    }

  },

  viewContent: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/content/view");
      // console.log(res.data)
      set({ content: res.data.content });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load content";
      set({ error: errMsg });
      console.log("Failed to get content:", err);
    }
    set({ loading: false });
  },

  updateContent: async (data: UpdatedContent) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/content/update/${data._id}`, data);
      await get().viewContent();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update content";
      set({ error: errMsg });
      console.log("Failed to update content:", err);
    }
    set({ loading: false });
  },

  deleteContent: async (id: string) => {
    set({ error: null });
    try {
      await api.delete(`/content/delete/${id}`);
      await get().viewContent();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete content";
      set({ error: errMsg });
      console.log("Failed to delete content:", err);
    }
    set({ loading: false });
  },


  saveContent:async(id:string)=>{
    set({ loading: true, error: null });
   
    try {
      await api.post('/saved-posts',{contentId:id})
      set((state:any) => ({
        savedPostIds: [...state.savedPostIds, id],
      }))
      await get().viewSavedPosts()
      set({ loading: false });
      return true
    } catch (err:any) {
      const errMsg =
      err?.response?.data?.error ||
      err?.message ||
      "Failed to load saved posts";
    set({ error: errMsg });
    console.log("Failed to get saved posts:", err);
    }
  },


  viewSavedPosts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/saved-posts");
      //@ts-ignore
      const savedContentId=res.data.map((id:SavedPost)=>res.data._id)
      set({ savedPosts: res.data,savedPostIds:savedContentId });

    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load saved posts";
      set({ error: errMsg });
      console.log("Failed to get saved posts:", err);
    }
    set({ loading: false });
  },

  deleteSaveContents: async (id: string) => {
    set({ loading: true });
    try {
      await api.delete(`/saved-posts/${id}`);
      //@ts-ignore
      set((state) => ({
        savedPostIds: state.savedPostIds.filter((postId:string) => postId !== id),
      }));
  
      await get().viewSavedPosts(); // Optional: this refreshes the savedPosts too
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to unsave content";
      set({ error: errMsg });
      console.log("Failed to unsave content:", err);
    }
    set({ loading: false });
  },


  isSaved: (id: string) => {
    return get().savedPostIds.includes(id)
  },
}));
