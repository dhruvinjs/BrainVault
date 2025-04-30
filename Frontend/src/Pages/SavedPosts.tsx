"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { ArrowLeft, Trash2, Loader2, Bookmark, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { contentStore } from "../store/contentStore"
import { Button } from "../Components/Button"
import { Card } from "../Components/Card"

export function SavedPosts() {
  const savedPosts = contentStore((s) => s.savedPosts)
  const viewSavedPosts = contentStore((s) => s.viewSavedPosts)
  const deleteSaveContents = contentStore((s) => s.deleteSaveContents)
  const loading = contentStore((s) => s.loading)
  const error = contentStore((s) => s.error)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

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

  const handleDelete = async (id: string) => {
    setDeleteInProgress(id)
    try {
      await deleteSaveContents(id)
    } finally {
      setDeleteInProgress(null)
    }
  }

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

  // console.log(searchTerm)
  const filteredPosts = searchTerm
  ? savedPosts.filter((post) =>
      post.contentId.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  : savedPosts

  if (isInitialLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">Loading your saved content...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
          {/* Left section */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              variant="secondary"
              text="Back"
              startIcon={<ArrowLeft size={16} />}
              className="shrink-0"
            />
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <Bookmark className="text-primary" size={20} />
              Saved Content
            </h1>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              size={16}
              onClick={handleSearch}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search saved content by title..."
              defaultValue={searchTerm}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Loader during action */}
        {loading && !isInitialLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="bg-white p-6 rounded-full mb-4 shadow">
              <Bookmark className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No saved content found</h2>
            <p className="text-gray-400 max-w-md mb-6">
              {searchTerm
                ? `No results for "${searchTerm}".`
                : "Your saved posts will appear here. Start exploring content!"}
            </p>
            <Button
              size="md"
              onClick={() => navigate("/dashboard")}
              variant="primary"
              text="Explore Content"
              startIcon={<ArrowLeft size={16} />}
            />
          </div>
        )}

        {/* Saved Content Grid */}
        {filteredPosts.length > 0 && !loading && (
          <>
            <p className="text-gray-400 mb-6">
              {filteredPosts.length} {filteredPosts.length === 1 ? "item" : "items"} saved
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="relative flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-end p-2">
                    <button
                      onClick={() => handleDelete(post.contentId._id)}
                      disabled={deleteInProgress === post.contentId._id}
                      className="p-2 rounded-full bg-white border border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-400 hover:bg-red-50 transition"
                      aria-label="Unsave content"
                    >
                      {deleteInProgress === post.contentId._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  <div className="p-4 pt-0">
                    <Card
                      _id={post.contentId._id}
                      title={post.contentId.title}
                      link={post.contentId.link}
                      type={post.contentId.type}
                      viewOnly={true}
                      tags={post.contentId.tags}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
