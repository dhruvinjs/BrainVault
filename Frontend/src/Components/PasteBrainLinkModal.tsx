import { X, Link as LinkIcon, Eye } from "lucide-react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

interface PasteBrainLinkModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Zod schema for brain link validation
const brainLinkSchema = z.object({
  link: z.string()
    .min(1, "Link cannot be empty")
    .refine((val) => {
      // Allow various formats
      const trimmed = val.trim();
      // Must either be a valid URL or a brain ID (alphanumeric, min 3 chars)
      const isValidUrl = /^https?:\/\/.+/i.test(trimmed);
      const isValidPath = /anotherBrain\/[\w-]+/.test(trimmed);
      const isValidId = /^[\w-]{3,}$/.test(trimmed);
      return isValidUrl || isValidPath || isValidId;
    }, {
      message: "Invalid brain link format. Please provide a valid URL, path, or brain ID"
    })
});

export function PasteBrainLinkModal({ open, setOpen }: PasteBrainLinkModalProps) {
  const [link, setLink] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  const handleOpenLink = () => {
    // Reset validation error
    setValidationError("");

    // Validate with Zod
    const validation = brainLinkSchema.safeParse({ link });
    
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Invalid link format";
      setValidationError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      // Extract brainId from the pasted link
      // Expected formats:
      // - http://localhost:5173/anotherBrain/abc123
      // - https://yourdomain.com/anotherBrain/abc123
      // - anotherBrain/abc123
      // - abc123 (just the ID)

      let brainId = "";
      const trimmedLink = link.trim();

      if (trimmedLink.includes("/anotherBrain/")) {
        // Extract from full URL
        brainId = trimmedLink.split("/anotherBrain/")[1].split(/[?#]/)[0];
      } else if (trimmedLink.includes("/")) {
        // If it has slashes but not the expected path, try last segment
        brainId = trimmedLink.split("/").pop() || "";
      } else {
        // Assume it's just the brainId
        brainId = trimmedLink;
      }

      // Clean up any extra characters
      brainId = brainId.replace(/[?#].*$/, "").trim();

      // Final validation for brainId
      const brainIdSchema = z.string().min(3, "Brain ID must be at least 3 characters");
      const brainIdValidation = brainIdSchema.safeParse(brainId);

      if (!brainIdValidation.success) {
        const errorMsg = "Invalid brain ID extracted from link";
        setValidationError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Navigate to the brain page
      navigate(`/anotherBrain/${brainId}`);
      toast.success("Opening brain...");
      setOpen(false);
      setLink("");
      setValidationError("");
    } catch (error) {
      const errorMsg = "Failed to parse the link. Please check and try again.";
      setValidationError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOpenLink();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLink("");
    setValidationError("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[340px] sm:w-[400px] p-6 border border-slate-200 dark:border-slate-700"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close Icon */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 text-center"
            >
              Load Another Brain 🧠
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-slate-600 dark:text-slate-300 mb-6 text-center leading-relaxed text-sm"
            >
              Paste a brain share link or ID to explore another user's brain.
            </motion.p>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 transition-all ${
                validationError 
                  ? 'ring-2 ring-red-500' 
                  : 'focus-within:ring-2 focus-within:ring-blue-500'
              }`}
            >
              <LinkIcon size={18} className={validationError ? "text-red-500" : "text-slate-500"} />
              <input
                type="text"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (validationError) setValidationError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Paste link or brain ID..."
                className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
              />
            </motion.div>

            {/* Validation Error */}
            {validationError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 text-center"
              >
                {validationError}
              </motion.p>
            )}

            {/* Example hint */}
            {!validationError && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Example: https://yoursite.com/anotherBrain/abc123 or just abc123
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  text="Cancel"
                  onClick={handleClose}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  size="sm"
                  text="Open Brain"
                  startIcon={<Eye size={16} />}
                  onClick={handleOpenLink}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}