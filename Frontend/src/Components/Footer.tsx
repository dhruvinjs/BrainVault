import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-slate-400 dark:text-slate-500"
        >
          © 2025 BrainVault. Built with care for knowledge seekers.
        </motion.p>

        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-slate-300 dark:text-slate-400 hover:text-white transition-colors duration-200"
        >
          <Github size={24} />
          <span>View on GitHub</span>
        </motion.a>
      </div>
    </footer>
  );
}
