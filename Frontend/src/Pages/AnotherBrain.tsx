
import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api/axios"
import type { Content } from "../store/contentStore"
import { Button, Card } from "../Components"
import { ArrowLeft, Brain, Loader2, AlertCircle, Search } from "lucide-react"

export function AnotherBrain() {
  const { brainId } = useParams<{ brainId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<Content[]>([])
  const [brainInfo, setBrainInfo] = useState<{ name: string; owner: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (brainId) fetchBrainContent()
  }, [brainId])

  const fetchBrainContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await api.get(`/brain/${brainId}`)
      setContent(res.data.brain.content)

      setBrainInfo({
        name: "Shared Brain",
        owner: res.data.brain.userId.username || "Unknown User",
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load this brain. It may not exist or you don't have access."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const term = searchRef.current?.value.trim().toLowerCase() || ""
    setSearchTerm(term)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (searchRef.current) searchRef.current.value = ""
  }

  const filteredContent = searchTerm
    ? content.filter((item) => item.title.toLowerCase().includes(searchTerm))
    : content

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            size="sm"
            onClick={() => navigate("/dashboard")}
            variant="primary"
            text="Back to Your Brain"
            startIcon={<ArrowLeft size={16} />}
          />

          {!loading && !error && content.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                size={16}
                onClick={handleSearch}
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search content..."
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!loading && !error && brainInfo && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
              <Brain size={32} className="text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{brainInfo.name}</h1>
            <p className="text-gray-400">Shared by {brainInfo.owner}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
            <p className="text-gray-300 text-lg">Loading brain content...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-red-500/20 p-4 rounded-full mb-4">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Unable to Access Brain</h2>
            <p className="text-gray-400 max-w-md mb-6">{error}</p>
            <Button
              size="md"
              onClick={() => navigate("/dashboard")}
              variant="primary"
              text="Return to Your Brain"
              startIcon={<ArrowLeft size={16} />}
            />
          </div>
        )}

        {!loading && !error && (
          <>
            {content.length > 0 && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-400">
                  {filteredContent.length} {filteredContent.length === 1 ? "item" : "items"}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContent.map((item) => (
                  <Card
                    key={item._id}
                    _id={item._id!}
                    link={item.link}
                    title={item.title}
                    type={item.type}
                    tags={item.tags || []}
                    viewOnly={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {searchTerm ? (
                  <>
                    <div className="bg-gray-800 p-4 rounded-full mb-4">
                      <Search size={32} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No matching content</h2>
                    <p className="text-gray-400 max-w-md mb-4">No items match "{searchTerm}".</p>
                    <button onClick={clearSearch} className="text-purple-400 hover:text-purple-300 font-medium">
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-800 p-4 rounded-full mb-4">
                      <Brain size={32} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">This brain is empty</h2>
                    <p className="text-gray-400 max-w-md">There's no content in this shared brain yet.</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
