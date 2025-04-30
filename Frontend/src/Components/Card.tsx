"use client"

import { useState } from "react"
import { NotebookPen, Pencil, Trash2, Twitter, Youtube, ExternalLink, Star } from "lucide-react"
import { contentStore } from "../store/contentStore"
import { Link } from "react-router-dom"
import { ConfirmModal } from "./ConfirmModal"

interface CardProps {
  _id: string
  title: string
  link: string
  type: "twitter" | "youtube" | string
  onEdit?: () => void
  viewOnly: boolean
  tags: string[]
  onSave?: () => Promise<void>
  saved?: boolean
  savingState?: boolean
}

export function Card({
  _id,
  title,
  link,
  type,
  onEdit,
  viewOnly,
  tags = [],
  onSave,
  savingState = false,
  saved = false,
}: CardProps) {
  const deleteContent = contentStore((s:any) => s.deleteContent)
  const isSavedInStore = contentStore((s:any) => s.isSaved(_id))
  const saveContent = contentStore((s:any) => s.saveContent)

  const [deleteModal, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isSaved = isSavedInStore

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteContent(_id)
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave()
      return
    }

    setIsSaving(true)
    try {
      await saveContent(_id)
    } catch (err) {
      console.error("Error saving content:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const formattedLink = type === "youtube" && !link.includes("embed") ? link.replace("watch?v=", "embed/") : link

  return (
    <div className="w-[300px] bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2 max-w-[70%]">
          <div
            className={`p-1.5 rounded-full ${
              type === "twitter"
                ? "bg-blue-50 text-blue-500"
                : type === "youtube"
                  ? "bg-red-50 text-red-500"
                  : "bg-purple-50 text-purple-500"
            }`}
          >
            {type === "twitter" ? (
              <Twitter size={16} />
            ) : type === "youtube" ? (
              <Youtube size={16} />
            ) : (
              <NotebookPen size={16} />
            )}
          </div>
          <span className="font-medium text-sm truncate text-black" title={title}>
            {title}
          </span>
        </div>

        {!viewOnly && (
          <div className="flex items-center gap-2 text-gray-400">
            <button onClick={onEdit} className="p-1 rounded-full hover:bg-gray-100" aria-label="Edit content">
              <Pencil size={16} />
            </button>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Delete content"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={savingState || isSaving}
              className={`p-1 rounded-full hover:bg-gray-100 cursor-pointer ${isSaved ? "text-yellow-500" : "text-gray-400"}`}
              aria-label={isSaved ? "Saved" : "Save content"}
            >
              {savingState || isSaving ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              ) : (
                <Star size={16} className={isSaved ? "fill-yellow-500 text-amber-300" : ""} />
              )}
            </button>
          </div>
        )}
      </div>

      <ConfirmModal open={deleteModal} setOpen={setDeleteModalOpen} onConfirm={handleDelete} />

      {/* Content Preview */}
      <div className="p-3">
        {type === "youtube" && (
          <div className="aspect-video rounded-md overflow-hidden">
            <iframe
              className="w-full h-full"
              src={formattedLink}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        {type === "twitter" && (
          <div className="border rounded-md p-4 bg-gray-50">
            <blockquote className="twitter-tweet">
              <Link to={link} />
            </blockquote>
          </div>
        )}

        {type !== "youtube" && type !== "twitter" && (
          <div className="border rounded-md p-3 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">External content:</p>
              <Link
                to={link.startsWith("http") ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 text-sm font-medium hover:underline flex items-center justify-center gap-1"
              >
                {link}
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-900">Tags:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-900 text-white">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
