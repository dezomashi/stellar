import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, X } from "lucide-react";

export default function Toast({ message, isVisible, onClose, type = "success" }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-[#0a0a0c] border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[300px]"
        >
          <div className={`p-2 rounded-lg ${type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Notification</p>
            <p className="text-sm font-bold text-white">{message}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-600 hover:text-white transition">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
