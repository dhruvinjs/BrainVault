"use client"

import { X } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "./Button"
import { InputBoxes } from "./Input"

type ContentFormModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: { title: string; type: string; link: string; tags: string[] }) => void
}

export function ContentModal({ open, setOpen, onSubmit }: ContentFormModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLInputElement>(null)
  const linkRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  const [tags, setTags] = useState<string[]>([])

  if (!open) return null

  const handleSubmit = () => {
    const newContent = {
      title: titleRef.current?.value || "",
      type: typeRef.current?.value || "",
      link: linkRef.current?.value || "",
      tags,
    }
    onSubmit(newContent)
    setOpen(false)
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
     if(e.key==="Enter" || e.key===","){
      const raw=tagInputRef.current?.value.trim().replace(/^#/,"")
      if(raw && !tags.includes(raw)){
        setTags([...tags,raw])
      }
      if(tagInputRef.current) tagInputRef.current.value=""
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">

        <X
          size={30}
          className="absolute top-6 right-6 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-gray-300"
          onClick={() => setOpen(false)}
        />

        <h2 className="text-xl font-semibold text-center mb-4">
          Add New Content
        </h2>

        {/* Input Fields */}
        <div className="flex flex-col gap-3">
          <InputBoxes
            type="text"
            placeholder="Title"
            ref={titleRef}
          />
          <InputBoxes
            type="text"
            placeholder="Type"
            ref={typeRef}
          />
          <InputBoxes
            type="text"
            placeholder="Link"
            ref={linkRef}
          />
          <InputBoxes
            type="text"
            placeholder="Add tags (Press Enter or ,)"
            ref={tagInputRef}
            onKeyDown={handleTagInput}
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-sm "
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4 text-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            text="Submit"
          />
        </div>
      </div>
    </div>
  )
}
