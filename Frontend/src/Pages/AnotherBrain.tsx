import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { api } from "../api/axios";
import { ArrowLeft, Twitter, Youtube, FileText, StickyNote, Calendar, Tag, Loader2, AlertCircle, Search } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  url?: string;
  content?: string;
  type: 'twitter' | 'youtube' | 'article' | 'note';
  tags: string[];
  createdAt: string;
}

interface BrainData {
  ownerName: string;
  posts: Post[];
}

export function AnotherBrain() {
  const { brainId } = useParams<{ brainId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brainData, setBrainData] = useState<BrainData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch brain data from API
  useEffect(() => {
    if (!brainId) return;

    const fetchBrain = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/brain/${brainId}`);
        const brain = res.data.brain;

        setBrainData({
          ownerName: brain.userId.username || "Unknown User",
          posts: brain.content.map((item: any) => ({
            _id: item._id,
            title: item.title,
            url: item.link,
            content: item.content,
            type: item.type,
            tags: item.tags || [],
            createdAt: item.createdAt || item.created_at,
          })),
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load this brain.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrain();
  }, [brainId]);

  // =================
  // Search handling
  // =================
  const handleSearch = () => {
    const term = searchRef.current?.value.trim().toLowerCase() || "";
    setSearchTerm(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchRef.current) searchRef.current.value = "";
  };

  const filteredPosts = brainData?.posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  ) || [];

  // =================
  // Helpers
  // =================
  const getIcon = (type: string) => {
    switch (type) {
      case 'twitter': return Twitter;
      case 'youtube': return Youtube;
      case 'article': return FileText;
      case 'note': return StickyNote;
      default: return FileText;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'twitter': return 'bg-sky-50 border-sky-200 dark:bg-sky-900/30 dark:border-sky-700';
      case 'youtube': return 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700';
      case 'article': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700';
      case 'note': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700';
      default: return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>

          {!loading && !error && brainData?.posts && brainData.posts.length > 0 && (
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
                className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black dark:text-white"
              />
            </div>
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium"
            >
              Return
            </button>
          </div>
        )}

        {!loading && !error && brainData && (
          <>
            {/* Brain info */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {brainData.ownerName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{brainData.ownerName}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">Shared {brainData.posts.length} items</p>
                </div>
              </div>
            </motion.div>

            {/* Filtered Posts */}
            {filteredPosts.length > 0 ? (
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => {
                  const Icon = getIcon(post.type);
                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={`${getColorClass(post.type)} border-2 rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Icon size={20} className="text-slate-700 dark:text-slate-200" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">{post.title}</h3>
                          {post.content && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-1">{post.content}</p>}
                          {post.url && (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              Visit Link
                            </a>
                          )}
                        </div>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                              <Tag size={12} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <Calendar size={14} /> {formatDate(post.createdAt)}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search size={32} className="text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {searchTerm ? `No matching content for "${searchTerm}"` : "This brain is empty"}
                </h2>
                {searchTerm && (
                  <button onClick={clearSearch} className="text-purple-400 hover:text-purple-300 font-medium mt-2">
                    Clear search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
