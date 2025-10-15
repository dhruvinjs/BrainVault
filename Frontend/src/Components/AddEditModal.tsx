import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateContentData, Content } from '../hooks/useContentQueries';

interface AddEditModalProps {
  post: Content | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: CreateContentData) => void;
}

export function AddEditModal({ post, isSaving, onClose, onSave }: AddEditModalProps) {
  // Refs for input fields
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);

  // State for type selection (to keep the active button highlighted)
  const [type, setType] = useState<Content['type']>(post?.type || 'note');

  // Populate refs when editing
  useEffect(() => {
    if (post) {
      if (titleRef.current) titleRef.current.value = post.title || '';
      if (linkRef.current) linkRef.current.value = post.link || '';
      if (contentRef.current) contentRef.current.value = post.content || '';
      if (tagsRef.current) tagsRef.current.value = post.tags?.join(', ') || '';
      setType(post.type || 'note');
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const data: CreateContentData = {
      title: titleRef.current?.value || '',
      link: linkRef.current?.value || '',
      content: contentRef.current?.value || '',
      type,
      tags: tagsRef.current?.value.split(',').map(t => t.trim()).filter(Boolean) || [],
    };

    onSave(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {post ? 'Edit Post' : 'Add New Post'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={24} className="text-slate-600 dark:text-slate-400" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              defaultValue={post?.title || ''}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              placeholder="Enter post title"
              required
              disabled={isSaving}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(['twitter', 'youtube', 'article', 'note'] as const).map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setType(t)}
                  className={`p-3 rounded-lg border-2 capitalize transition-colors ${
                    type === t
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              URL
            </label>
            <input
              ref={linkRef}
              type="url"
              defaultValue={post?.link || ''}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              placeholder="https://example.com"
              disabled={isSaving}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content
            </label>
            <textarea
              ref={contentRef}
              defaultValue={post?.content || ''}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 resize-none"
              placeholder="Add notes or description..."
              disabled={isSaving}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              ref={tagsRef}
              type="text"
              defaultValue={post?.tags?.join(', ') || ''}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              placeholder="productivity, learning, tips"
              disabled={isSaving}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : post ? 'Update Post' : 'Add Post'}
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={isSaving}
              className="px-6 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
