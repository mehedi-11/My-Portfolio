import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 text-center shadow-2xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Message Sent!</h3>
          <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
            Thank you for reaching out. I have received your inquiry and will get back to you shortly.
          </p>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-600 transition-all shadow-lg shadow-slate-200"
          >
            Acknowledged & Refresh
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SuccessModal;
