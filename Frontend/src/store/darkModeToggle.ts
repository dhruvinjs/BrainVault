import{ create }from 'zustand'

interface DarkMode{
    darkMode:boolean,
    toggleDarkMode: () => void

}

export const useDarkModeStore=create<DarkMode>((set)=>({
    darkMode:false,
    toggleDarkMode:()=>set((state) => ({darkMode:!state.darkMode}))
}))