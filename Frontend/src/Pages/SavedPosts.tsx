"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { ArrowLeft, Loader2, Bookmark, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { contentStore } from "../store/contentStore"
import { Button } from "../Components/Button"
import { Card } from "../Components/Card"

export function SavedPosts() {
  const savedPosts = contentStore((s: any) => s.savedPosts)
  const viewSavedPosts = contentStore((s: any) => s.viewSavedPosts)
  const deleteSaveContents = contentStore((s: any) => s.deleteSaveContents)
  const loading = contentStore((s: any) => s.loading)
  const error = contentStore((s: any) => s.error)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const[localError,setLocalError]=useState<string | null>()
  useEffect(() => {
    const fetchContent = async () => {
      try {
        await viewSavedPosts()
      } catch (err) {
        console.error("Error fetching saved posts:", err)
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchContent()
  }, [viewSavedPosts])

  const handleSearch = () => {
    if (searchInputRef.current) {
      setSearchTerm(searchInputRef.current.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
    setSearchTerm("")
  }

  const filteredPosts = searchTerm
    ? savedPosts.filter((post: any) => post.contentId.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : savedPosts

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading your saved content...</p>
        </div>
      </div>
    )
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSaveContents(id)
      
    } catch (error:any) {
      console.error("Failed to delete saved content:", error)
      setLocalError(error)
    }
  }
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              variant="secondary"
              text="Back"
              startIcon={<ArrowLeft size={16} />}
            />
            <h1 className="text-lg font-bold flex items-center gap-1.5 text-gray-900">
              <Bookmark className="text-primary" size={18} />
              Saved Content
            </h1>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
              onClick={handleSearch}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title..."
              defaultValue={searchTerm}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-8 py-1.5 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5">
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
            <p>{error}</p>
          </div>
        )}

        {loading && !isInitialLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-white p-4 rounded-full mb-3 shadow">
              <Bookmark className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No saved content found</h2>
            <p className="text-gray-400 max-w-sm mb-5 text-sm">
              {searchTerm
                ? `No results for "${searchTerm}".`
                : "Your saved posts will appear here. Start exploring content!"}
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              variant="primary"
              text="Explore Content"
              startIcon={<ArrowLeft size={14} />}
            />
          </div>
        )}

        {filteredPosts.length > 0 && !loading && (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {filteredPosts.length} {filteredPosts.length === 1 ? "item" : "items"} saved
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post: any) => (
                <Card
                  key={post._id}
                  _id={post.contentId._id}
                  title={post.contentId.title}
                  link={post.contentId.link}
                  type={post.contentId.type}
                  viewOnly={true}
                  tags={post.contentId.tags}
                  savedPosts={true}
                  onDeleteSaved={()=>handleDelete(post.contentId._id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
