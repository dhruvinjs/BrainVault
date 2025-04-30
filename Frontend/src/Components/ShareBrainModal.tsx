"use client"

import { useState, useEffect } from "react";
import { X, Copy } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  link: string;
  error: string | null;
}

export function ShareBrainModal({ open, setOpen, link, error }: ShareModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0  bg-opacity-40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Share Your Brain</h3>
          <X
            size={30}
            className="absolute top-6 right-6 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-gray-300"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Body */}
        <p className="text-gray-600 mb-6">
          Copy the link below and share your knowledge hub with others:
        </p>

        {/* Input + Copy */}
        {error ? (
          <div className="text-red-500 text-md text-center">{error}</div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={link}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 cursor-pointer transition-all duration-300 hover:bg-purple-600 hover:text-white rounded-md"
            >
              <Copy size={20} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
