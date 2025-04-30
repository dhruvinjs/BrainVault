"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useNavigate } from "react-router-dom"
interface PasteLinkModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (link: string) => void,

}

export function PasteLinkModal({ open, setOpen, }: PasteLinkModalProps) {
  const [link, setLink] = useState("")
  
    const nav=useNavigate()
    const handleLoad = () => {
      if (link) {
        const parts = link.split("/") 
        const brainId = parts[parts.length - 1] 
    
        if (brainId) {
          setOpen(false)
          nav(`/anotherBrain/${brainId}`)
        }
      }
    }
  

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 backdrop-blur-sm bg-opacity-40"
        onClick={() => setOpen(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Load Another Brain</h3>
          <X
            size={30}
            className="absolute top-6 right-6 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-gray-300"
            onClick={() => setOpen(false)}
          />
        </div>

        <p className="text-gray-600 mb-6">
          Paste the shared brain link here to load someone else's knowledge hub:
        </p>

        <input
          type="text"
          placeholder="Paste Brain Link Here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleLoad}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
        >
          Load Brain
        </button>
      </div>
    </div>
  )
}
