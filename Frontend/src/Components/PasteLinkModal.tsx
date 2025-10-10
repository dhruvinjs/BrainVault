import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PasteLinkModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PasteLinkModal({ open, setOpen }: PasteLinkModalProps) {
  const [link, setLink] = useState("");
  const nav = useNavigate();

  const handleLoad = () => {
    if (!link) return;
    const parts = link.split("/");
    const brainId = parts[parts.length - 1];

    if (brainId) {
      setOpen(false);
      nav(`/anotherBrain/${brainId}`);
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Load Another Brain
              </h3>
              <X
                size={30}
                className="cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-gray-300"
                onClick={() => setOpen(false)}
              />
            </div>

            <p className="text-gray-600 mb-6">
              Paste the shared brain link here to load someone else's knowledge hub:
            </p>

            <input
              type="text"
              placeholder="Paste Brain Link Here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleLoad}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
            >
              Load Brain
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
