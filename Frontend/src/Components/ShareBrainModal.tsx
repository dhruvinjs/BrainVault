import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareBrainModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  link: string;
  error: string | null;
  isLoading?: boolean; // optional if you're showing loader when generating link
}

export function ShareBrainModal({ open, setOpen, link, error, isLoading = false }: ShareBrainModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Brain 🧠
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Generating your brain link...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 font-medium py-6">
                {error || "Something went wrong. Please try again."}
              </div>
            ) : (
              <>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Copy the link below and share your knowledge hub with others:
                </p>

                {/* Input + Copy */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={link}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
