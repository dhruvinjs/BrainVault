import { create } from "zustand";
import { api } from "../api/axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const frontEndBaseUrl=import.meta.env.VITE_FRONTEND_BASE_URL

interface BrainStore {
  brainShare: boolean;
  shareLink: string | "";
  setBrainShare: (value: boolean) => void;
  shareBrain: (share: boolean) => Promise<void>;
  error: string | null;
  frontendLink:string | ""
}

const brainStore = create<BrainStore>((set, _get) => ({
  brainShare: false,
  shareLink: "",
  error: null,
  frontendLink:"",
  setBrainShare: (value) => set({ brainShare: value }),

  shareBrain: async (share: boolean) => {
    try {
      
      const res = await api.patch("/brain/share", { share });

      if (share) {
        const link = res?.data?.link;
        console.log(link)
        set({
          brainShare: true,
          shareLink: `${baseUrl}/brain/${link}`,
          error: null,
          frontendLink:`${frontEndBaseUrl}/anotherBrain/${link}`
        });
      } else {
        set({
          brainShare: false,
          shareLink: "",
          error: null,
        });
      }
    } 
    catch (error: any) {
      const errMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      set({ error: errMsg });
      console.error("Error while generating link:", error);
    }
  },
  

  
}));

export default brainStore;
