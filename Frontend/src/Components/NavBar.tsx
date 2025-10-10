// import { Brain, Plus, ChevronDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import { useBrainStore } from '../stores/useBrainStore';

// interface NavbarProps {
//   onAddContent: () => void;
// }

// export default function Navbar({ onAddContent }: NavbarProps) {
//   const [showBrainDropdown, setShowBrainDropdown] = useState(false);
//   const { activeBrain, brains, setActiveBrain } = useBrainStore();

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center space-x-3">
//             <Brain className="w-8 h-8" />
//             <h1 className="text-2xl font-bold">BrainVault</h1>
//           </div>

//           <div className="flex items-center space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={onAddContent}
//               className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Add Content</span>
//             </motion.button>

//             <div className="relative">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setShowBrainDropdown(!showBrainDropdown)}
//                 className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
//               >
//                 <span className="capitalize">{activeBrain}</span>
//                 <ChevronDown className="w-4 h-4" />
//               </motion.button>

//               <AnimatePresence>
//                 {showBrainDropdown && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-10"
//                       onClick={() => setShowBrainDropdown(false)}
//                     />
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden"
//                     >
//                       {brains.map((brain) => (
//                         <button
//                           key={brain}
//                           onClick={() => {
//                             setActiveBrain(brain);
//                             setShowBrainDropdown(false);
//                           }}
//                           className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors capitalize ${
//                             activeBrain === brain
//                               ? 'bg-blue-100 text-blue-600 font-semibold'
//                               : 'text-gray-700'
//                           }`}
//                         >
//                           {brain}
//                         </button>
//                       ))}
//                     </motion.div>
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
