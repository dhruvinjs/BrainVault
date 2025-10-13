
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, FileText, ArrowLeft, Edit3,  X, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button,LoadingScreen } from "../Components";
import { useProfileQueries } from "../hooks/useProfileQueries"; // CORRECTED: Import the correct hook factory

export function Profile() {
  const navigate = useNavigate();

  // CORRECTED: Use the dedicated profile query hooks
  const { useGetProfile, useUpdateProfile } = useProfileQueries();
  const { data, isLoading, isError, error } = useGetProfile();
  const { mutate: updateProfile, isPending: isSaving, isSuccess: isSaveSuccess } = useUpdateProfile();

  const [isEditing, setEditing] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Handle profile fetch error
  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || "Could not load profile.");
      navigate("/login");
    }
  }, [isError, error, navigate]);

  // Show success message on successful update
  useEffect(() => {
    if (isSaveSuccess) {
      toast.success("Profile updated successfully!");
      setEditing(false);
    }
  }, [isSaveSuccess]);

  if (isLoading) {
     return <LoadingScreen />;
   }
  // This should not happen if error handling is correct, but it's a good safeguard
  if (!data || !data.user) {
    return null; 
  }

  const { user, content = [] } = data;

  const total = content.length;
  const twitterCount = content.filter((c) => c.type === "twitter").length;
  const youtubeCount = content.filter((c) => c.type === "youtube").length;
  const articleCount = content.filter((c) => c.type === "article").length;
  const noteCount = content.filter((c) => c.type === "note").length;

  // CORRECTED: Simplified handleSave to use the mutation hook
  const handleSave = () => {
    const newUsername = usernameRef.current?.value?.trim();
    if (!newUsername || newUsername === user.username) {
      setEditing(false);
      return;
    }
    updateProfile({ username: newUsername }, {
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to update profile.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-16 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 mb-12">
          <Button size="sm" text="Back" startIcon={<ArrowLeft size={16} />} onClick={() => navigate("/dashboard")} variant="dark" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Your Profile</h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="md:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"><User size={22} /> Account Info</h2>
              {!isEditing && <Button text="Edit" size="sm" variant="primary" startIcon={<Edit3 size={16} />} onClick={() => setEditing(true)} />}
            </div>

            {!isEditing ? (
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">{user.username}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Shield size={14} className="text-green-500" /><span>Verified Account</span></div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
                <input ref={usernameRef} defaultValue={user.username} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" disabled={isSaving} />
                <div className="flex gap-3 justify-end mt-4">
                  <Button text="Cancel" variant="secondary" size="md" startIcon={<X size={16} />} onClick={() => setEditing(false)} disabled={isSaving} />
                  <Button text={isSaving ? "Saving..." : "Save"} variant="primary" size="md" startIcon={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} onClick={handleSave} disabled={isSaving} />
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-6">
            <div className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Content Summary</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Total Items</span><span className="font-medium text-blue-600 dark:text-blue-400">{total}</span></div>
                 <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Twitter</span><span className="font-medium">{twitterCount}</span></div>
                 <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>YouTube</span><span className="font-medium">{youtubeCount}</span></div>
                 <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Articles</span><span className="font-medium">{articleCount}</span></div>
                 <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Notes</span><span className="font-medium">{noteCount}</span></div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Recent Content</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {content.slice(0, 10).map((c) => (
                  <motion.div key={c._id} whileHover={{ scale: 1.02 }} className="flex justify-between items-center border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 hover:bg-white dark:hover:bg-slate-900 transition">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{c.type}</p>
                    </div>
                    {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline ml-2 flex-shrink-0">View</a>}
                  </motion.div>
                ))}
                {content.length === 0 && (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-center text-gray-500 text-sm">You haven't added any content yet.</p>
                    <button onClick={() => navigate("/dashboard")} className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline">Add your first content</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
