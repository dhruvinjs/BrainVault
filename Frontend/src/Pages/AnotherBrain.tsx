import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Tag, Loader2, AlertCircle,
  Search, X, Star, Globe, Lock
} from "lucide-react";
import { usePublicBrainQuery } from "../hooks/useBrainQueries"; // ✅ new hook

export function AnotherBrain() {
  const { brainId } = useParams<{ brainId: string }>();
  const navigate = useNavigate();

  // ✅ React Query
  const { data: brainData, error, isLoading, isError } = usePublicBrainQuery(brainId!);

  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Search
  const clearSearch = () => {
    setSearchTerm("");
    if (searchRef.current) searchRef.current.value = "";
  };

  const filteredPosts = brainData?.posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content?.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  ) || [];

  const getColorClass = (type: string) => {
    switch (type) {
      case 'twitter': return 'bg-sky-50 border-sky-200 dark:bg-sky-900/30 dark:border-sky-700';
      case 'youtube': return 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700';
      case 'article': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700';
      case 'note': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700';
      default: return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const isPrivate = brainData?.isPrivate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 py-3"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </motion.button>

            {!isLoading && !isPrivate && brainData?.posts && brainData.posts.length > 0 && (
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search content..."
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading brain content...</p>
          </div>
        )}

        {/* Private */}
        {!isLoading && isPrivate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center"
          >
            <div className="flex flex-col items-center gap-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-12">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-full flex items-center justify-center shadow-md">
                <Lock size={64} className="text-orange-600 dark:text-orange-400" />
              </div>

              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                Brain is Private 🔒
              </h2>

              <p className="text-lg text-slate-700 dark:text-slate-300 max-w-lg">
                {"This brain is currently private or the share link has been deactivated."}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Please request a new share link from the brain owner to access this content.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Return to Dashboard
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Error (non-private) */}
        {!isLoading && isError && !isPrivate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
              <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Unable to Access Brain</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
              {(error as any)?.message || "Failed to load this brain."}
            </p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        )}

        {/* Main Content */}
        {!isLoading && !isError && !isPrivate && brainData && (
          <>
            {/* Owner Info */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }} className="mb-8"
            >
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {brainData.ownerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {brainData.ownerName}
                      </h2>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Globe size={12} /> Public Brain
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Shared <span className="font-semibold text-blue-600 dark:text-blue-400">{brainData.posts.length}</span>{" "}
                      {brainData.posts.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className={`${getColorClass(post.type)} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative`}
                    >
                      {post.is_starred && (
                        <div className="absolute top-3 right-3">
                          <Star size={18} className="text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-tight mb-2">
                          {post.title}
                        </h3>
                        {post.type === 'youtube' && post.link && (
                          <div className="aspect-video w-full rounded-lg overflow-hidden my-3">
                            <iframe
                              src={post.link}
                              title={post.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        )}
                        {post.link && ['article', 'twitter'].includes(post.type) && (
                          <a href={post.link} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all block my-2"
                          >
                            {post.link}
                          </a>
                        )}
                        {post.content && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 my-2">
                            {post.content}
                          </p>
                        )}
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-medium uppercase">
                          {post.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-full mb-6">
                  <Search size={48} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {searchTerm ? `No results for "${searchTerm}"` : "This brain is empty"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "No content has been shared yet"}
                </p>
                {searchTerm && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Clear Search
                  </motion.button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
