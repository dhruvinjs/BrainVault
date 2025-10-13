
import { motion } from 'framer-motion';
import {
  Plus, Star, Filter, Search, LogOut, Twitter, Youtube, FileText, StickyNote, Loader2, Share2
} from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useLogoutMutation } from '../hooks/useAuthQueries';
import { toast } from 'react-hot-toast';
import { useProfileQueries } from '../hooks/useProfileQueries';
interface FilterOption {
  id: string;
  label: string;
  icon: any;
}

// CORRECTED: Added props for sharing functionality
interface DashboardHeaderProps {
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleShareBrain: () => void;
  isSharing: boolean;
}

export function DashboardHeader({
  setShowAddModal,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  handleShareBrain,
  isSharing,
}: DashboardHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

 const { useGetProfile } = useProfileQueries();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();
   const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully!");
        navigate('/login', { replace: true });
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      }
    });
  };

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

  const user = profileData?.user;

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 py-3"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <motion.button onClick={() => navigate('/profile')} disabled={isProfileLoading} className="flex items-center justify-center w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50" title="View Profile">
              {isProfileLoading ? <Loader2 size={16} className="animate-spin"/> : user?.username.charAt(0).toUpperCase()}
            </motion.button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-700 dark:from-slate-200 dark:via-blue-300 dark:to-slate-100 bg-clip-text text-transparent hidden sm:block">
              🧠 BrainVault
            </h1>
          </div>

          <div className="relative flex-1 max-w-xl mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search content... (Ctrl+K)" className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-800 dark:text-slate-100 transition-colors" />
          </div>

          <div className="flex items-center gap-2">
            {/* CORRECTED: Share button re-added */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShareBrain} disabled={isSharing} className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-70" title="Share Your Brain">
              {isSharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
              <span className="hidden md:inline">Share</span>
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddModal(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm">
              <Plus size={16} />
              <span className="hidden md:inline">Add</span>
            </motion.button>

        <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-emerald-700 transition-colors text-sm"
              title="Load Another Brain"
            >
              <span className="hidden md:inline">🧠 Load Brain</span>
            </motion.button>


            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} title="Logout" disabled={isLoggingOut} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 rounded-md transition-colors disabled:opacity-50">
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            </motion.button>
          </div>
        </div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="flex flex-wrap gap-2 mt-4">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const active = filter === option.id;
            return (
              <motion.button key={option.id} onClick={() => setFilter(option.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                <Icon size={14} /> {option.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.header>
  );
}
