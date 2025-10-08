import { motion, useInView } from 'framer-motion';
import { useRef} from 'react';
import { Brain, Search, Folder, Trash2, Link2, FileText, Video, Twitter } from 'lucide-react';
import { Footer } from '../Components';

export function Landing() {
  

  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const inspirationRef = useRef(null);

  

  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const demoInView = useInView(demoRef, { once: true, margin: "-100px" });
  const inspirationInView = useInView(inspirationRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Link2,
      title: "Save Anything",
      description: "Capture tweets, YouTube videos, articles, and personal notes in one secure place."
    },
    {
      icon: Search,
      title: "Search Easily",
      description: "Find what you need instantly with powerful search and smart tagging."
    },
    {
      icon: Folder,
      title: "Switch Brains",
      description: "Organize content into multiple vaults for different projects or topics."
    },
    {
      icon: Trash2,
      title: "Safe Deletion",
      description: "Archive or permanently delete with confidence. Your data, your control."
    }
  ];

  const demoItems = [
    {
      type: "twitter",
      icon: Twitter,
      title: "Thread on productivity hacks",
      tags: ["productivity", "tips"],
      color: "bg-sky-50 border-sky-200 dark:bg-sky-900/30 dark:border-sky-700"
    },
    {
      type: "video",
      icon: Video,
      title: "Building a Second Brain - Tiago Forte",
      tags: ["learning", "PKM"],
      color: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700"
    },
    {
      type: "article",
      icon: FileText,
      title: "The Science of Memory Retention",
      tags: ["science", "memory"],
      color: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300">
      {/* Theme Toggle */}
     

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-blue-800 to-slate-700 dark:from-slate-200 dark:via-blue-300 dark:to-slate-100 bg-clip-text text-transparent">
              🧠 BrainVault
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-semibold mb-6 text-slate-700 dark:text-slate-200"
          >
            Save Smarter. Remember Better.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Your digital memory vault for capturing and organizing everything that matters.
            Save tweets, videos, articles, and notes — all in one beautifully organized space.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-800 dark:bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors duration-300"
          >
            Get Started
          </motion.button>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 opacity-20"
          >
            <Brain size={80} className="text-blue-600 dark:text-blue-400" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 opacity-20"
          >
            <FileText size={60} className="text-slate-600 dark:text-slate-400" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-slate-800 dark:text-slate-100"
          >
            Everything you need to build your knowledge
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotate: 1,
                  transition: { duration: 0.2 }
                }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-100 dark:border-slate-700"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-4"
                >
                  <feature.icon size={40} className="text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={demoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-slate-800 dark:text-slate-100"
          >
            Your content, beautifully organized
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={demoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {demoItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className={`${item.color} border-2 rounded-xl p-6 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon size={28} className="text-slate-700 dark:text-slate-200" />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-tight flex-1">
                    {item.title}
                  </h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-sm text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section ref={inspirationRef} className="py-24 px-6 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={inspirationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-8 text-slate-800 dark:text-slate-100"
          >
            Why a Second Brain?
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inspirationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed"
          >
            In the age of information overload, our minds aren't designed to remember everything.
            BrainVault acts as your external memory system — freeing your mind to focus on creativity
            and deep thinking while securely storing everything you want to remember. Build connections,
            discover insights, and never lose a valuable idea again.
          </motion.p>

          <motion.a
            href="https://www.youtube.com/watch?v=OP3dA2GcAh8"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={inspirationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors duration-300"
          >
            <Video size={24} />
            Why I Use a Second Brain
          </motion.a>
        </div>
      </section>

      {/* Footer */}
    <Footer/>
    </div>
  );
}


