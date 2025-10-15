import { motion } from 'framer-motion';
import { Github, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const nav = useNavigate();

  return (
    <footer className="py-12 px-6 bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-slate-400 dark:text-slate-500"
        >
          © 2025 <span className="font-semibold text-white">BrainVault</span>. 
        </motion.p>

        {/* Center – About the Developer */}
        <motion.button
          onClick={() => nav('/about')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-lg font-bold text-blue-400 hover:text-blue-300 transition-all duration-200"
        >
          <User size={22} />
          <span>About the Developer</span>
        </motion.button>

        {/* Right – GitHub Link */}
        <motion.a
          href="https://github.com/dhruvinjs/BrainVault"
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
