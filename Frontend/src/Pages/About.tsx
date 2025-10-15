import { motion } from 'framer-motion';
import { Github, Mail, Linkedin, Code2, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          {/* Profile Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 p-[3px]"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <User className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-slate-800 dark:text-slate-100">
              Dhruvin J Soni
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Full-Stack Developer | Passionate about building real-world systems
            </p>
          </div>

          {/* Content Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* About Project */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Code2 size={24} className="text-blue-500" />
                About BrainVault
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                BrainVault is your personal digital memory vault — a place to store tweets, YouTube videos, and notes 
                you want to revisit later. Built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Node.js</strong>, 
                it features smooth animations, a secure OAuth2 backend, and intuitive UI designed with <strong>Framer Motion</strong>.
              </p>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion', 'React Query', 'Node.js', 'Express', 'MongoDB'].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Connect Section */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                Connect With Me
              </h2>
              <div className="space-y-3">
                <motion.a
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://github.com/dhruvinjs/BrainVault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg hover:border-blue-400 dark:hover:border-blue-400 transition-colors group"
                >
                  <Github className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-100">GitHub</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">View BrainVault source code</div>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:dhruvinjs.me@gmail.com"
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg hover:border-blue-400 dark:hover:border-blue-400 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-100">Email</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">dhruvinsoni.js@gmail.com</div>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://linkedin.com/in/dhruvinjsoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg hover:border-blue-400 dark:hover:border-blue-400 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-100">LinkedIn</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Connect with me professionally</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-4"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Crafted with ❤️ by Dhruvin J Soni
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
