import { Brain, X, User,  LogOut, SaveAll } from "lucide-react"
import { SideBarItems } from "./SideBarItems"
import { useNavigate } from "react-router-dom"
import { userAuth } from "../store/userAuth"
import { useState } from "react"
interface SideBarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SideBar({ open, setOpen }: SideBarProps) {
  const nav=useNavigate()
  const {logout,error}=userAuth()
  const [localError,setLocalError]=useState<string>("")
 async function handleLogout(){
    const success=await logout()
    if(success) nav('/login')
    else setLocalError(error)
  }


  return (
    <div
      className={`fixed top-0 left-0 h-full w-60 bg-white border-r shadow
        ${open ? "block" : "hidden"} md:block`}
    >

      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Brain size={28} className="text-purple-600" />
          <span className="text-xl font-bold text-purple-600">BrainVault</span>
        </div>

        <button
          className="md:hidden p-1 rounded hover:bg-gray-100"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

       {localError && 
       <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-opacity-40 backdrop-blur-sm  flex justify-center items-center">
        {localError}
        </div>
        } 
      <nav className="mt-6 space-y-1 px-4">
        <SideBarItems text="Profile"  icon={<User size={20} />} onClick={()=>nav('/profile')} />
        <SideBarItems text="Saved Posts" icon={<SaveAll size={20} />} onClick={()=>nav('/saved-posts')} />
        <SideBarItems text="Logout" icon={<LogOut size={20}  />} onClick={handleLogout}/>
      </nav>
    </div>
  )
}
