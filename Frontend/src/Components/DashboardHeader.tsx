import { motion } from 'framer-motion';
import { Plus, Star, Filter, Search, LogOut, Twitter, Youtube, FileText, StickyNote, Loader2, Share2, User } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface FilterOption {
  id: string;
  label: string;
  icon: any;
}

interface DashboardHeaderProps {
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
  handleShareBrain: () => void;
  isSharing: boolean;
  handleLogout: () => void;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function DashboardHeader({
  setShowAddModal,
  handleShareBrain,
  isSharing,
  handleLogout,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery
}: DashboardHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // ====================
  // Ctrl+K focus handler
  // ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'twitter', label: 'Twitter', icon: Twitter },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'article', label: 'Articles', icon: FileText },
    { id: 'note', label: 'Notes', icon: StickyNote },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
    >
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-700 dark:from-slate-200 dark:via-blue-300 dark:to-slate-100 bg-clip-text text-transparent">🧠 BrainVault</h1>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} /> Add
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleShareBrain}
            disabled={isSharing}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm"
          >
            {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            {isSharing ? 'Sharing...' : 'Share'}
          </motion.button>

          {/* Profile Button */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1.5 rounded-md font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
              title="View Profile"
            >
              <User size={16} /> {user.username}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleLogout} title="Logout"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 rounded-md transition-colors"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <motion.div
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
          className="space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ctrl + k"
              className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-800 dark:text-slate-100 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const active = filter === option.id;
              return (
                <motion.button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} /> {option.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
