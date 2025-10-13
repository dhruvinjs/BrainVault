
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Star, Trash2, Edit2, Loader2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useContentQueries, Content, CreateContentData } from '../hooks/useContentQueries';
import { useShareBrainMutation } from '../hooks/useBrainQueries';
import { AddEditModal } from '../Components/AddContentModal';
import { ConfirmModal } from '../Components/ConfirmModal';
import { ShareBrainModal } from '../Components/ShareBrainModal';
import { DashboardHeader } from '../Components/DashboardHeader';

interface Post extends Content {}

export function DashBoard() {
  // ===========================
  // CONTENT QUERIES
  // ===========================
  const { useGetContents, useDeleteContent, useToggleStar, useCreateContent, useUpdateContent } = useContentQueries();
  const { data: posts = [], isLoading: isInitialLoading } = useGetContents();
  const { mutate: deleteContent, isPending: isDeleting, variables: deletingId } = useDeleteContent();
  const { mutate: toggleStar, isPending: isTogglingStar, variables: togglingStarVars } = useToggleStar();
  const { mutate: createContent, isPending: isCreating } = useCreateContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

  // ===========================
  // BRAIN QUERIES (SHARING)
  // ===========================
  // CORRECTED: Replaced brainStore with TanStack Query mutation
  const { mutate: shareBrain, isPending: isSharing, error: shareError } = useShareBrainMutation();

  // ===========================
  // STATES
  // ===========================
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBrainShareEnabled, setIsBrainShareEnabled] = useState(false); // To track the toggle state
  const [shareableLink, setShareableLink] = useState("");

  // ===========================
  // HANDLERS
  // ===========================
  const handleDeletePost = (id: string) => {
    setPostToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete) deleteContent(postToDelete);
    setPostToDelete(null);
    setShowConfirmModal(false);
  };

  const handleToggleStar = (id: string, is_starred: boolean) => toggleStar({ id, is_starred });

  const handleSavePost = (data: CreateContentData) => {
    if (editingPost) updateContent({ _id: editingPost._id, ...data });
    else createContent(data);
    setShowAddModal(false);
    setEditingPost(null);
  };

  // CORRECTED: Re-implemented handleShareBrain with TanStack Query
  const handleShareBrain = () => {
    const willShare = !isBrainShareEnabled;
    shareBrain(willShare, {
      onSuccess: (data) => {
        setShareableLink(data.frontendLink);
        setIsBrainShareEnabled(willShare);
        if (willShare) {
          setShowShareModal(true); // Only show modal when a new link is generated
          toast.success("Your Brain is now public!");
        } else {
          toast.success("Your Brain is now private.");
        }
      },
      onError: () => {
        toast.error("Failed to update sharing status. Please try again.");
      }
    });
  };

  // ===========================
  // FILTER AND UTIL
  // ===========================
  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.type === filter || (filter === 'starred' && post.is_starred);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const getColorClass = (type: string) => {
    switch (type) {
      case 'twitter': return 'bg-sky-50 border-sky-200 dark:bg-sky-900/30 dark:border-sky-700';
      case 'youtube': return 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700';
      case 'article': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700';
      case 'note': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700';
      default: return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300">
      
      {/* CORRECTED: Pass correct props to header */}
      <DashboardHeader
        setShowAddModal={setShowAddModal}
        handleShareBrain={handleShareBrain}
        isSharing={isSharing}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isInitialLoading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>
        ) : (
          <>
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => {
                  const isCurrentlyDeleting = isDeleting && deletingId === post._id;
                  const isCurrentlyTogglingStar = isTogglingStar && togglingStarVars?.id === post._id;

                  return (
                    <motion.div
                      key={post._id} layout
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }}
                      className={`${getColorClass(post.type)} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ${isCurrentlyDeleting ? 'opacity-50' : ''}`}
                    >
                      {/* ... Post content remains the same ... */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-tight mb-2">{post.title}</h3>
                          {post.type === 'youtube' && post.link ? (
                            <div className="aspect-video w-full rounded-lg overflow-hidden my-2">
                              <iframe src={post.link} title={post.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                            </div>
                          ) : post.link && ['article', 'twitter'].includes(post.type) ? (
                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">{post.link}</a>
                          ) : (
                            post.content && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{post.content}</p>
                          )}
                        </div>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                          {post.tags.map((tag, idx) => (<span key={idx} className="px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-xs text-slate-700 dark:text-slate-300 font-medium">{tag}</span>))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleToggleStar(post._id, post.is_starred)} disabled={isCurrentlyTogglingStar || isCurrentlyDeleting} className={`p-2 rounded-lg transition-colors relative ${post.is_starred ? 'bg-yellow-400 text-white' : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{isCurrentlyTogglingStar ? <Loader2 size={18} className="animate-spin"/> : <Star size={18} fill={post.is_starred ? 'currentColor' : 'none'} />}</motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingPost(post)} disabled={isCurrentlyTogglingStar || isCurrentlyDeleting} className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Edit2 size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeletePost(post._id)} disabled={isCurrentlyTogglingStar || isCurrentlyDeleting} className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors relative">{isCurrentlyDeleting ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18} />}</motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
            {!isInitialLoading && filteredPosts.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="text-slate-400 dark:text-slate-600 mb-4"><FileText size={64} className="mx-auto" /></div>
                <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No posts found</h3>
                <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or add a new post</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <ConfirmModal open={showConfirmModal} setOpen={setShowConfirmModal} onConfirm={confirmDelete} />
      <AnimatePresence>
        {(showAddModal || editingPost) && (<AddEditModal post={editingPost} isSaving={isCreating || isUpdating} onClose={() => {setShowAddModal(false); setEditingPost(null);}} onSave={handleSavePost} />)}
      </AnimatePresence>
      
      {/* CORRECTED: Pass correct props to the modal */}
      <ShareBrainModal
        open={showShareModal}
        setOpen={setShowShareModal}
        link={shareableLink}
        error={shareError?.message || null}
        isLoading={isSharing}
      />
    </div>
  );
}
