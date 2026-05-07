import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import SuccessModal from './SuccessModal';

const HireModal = ({ isOpen, onClose }) => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen && !showSuccess) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Safety check for keys
    if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      console.error("EmailJS Keys are missing in your environment variables!");
      setStatus('error');
      return;
    }

    setStatus('sending');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
        console.log("Hire Email Sent Successfully!", result.text);
        setStatus('success');
        setTimeout(() => {
            setShowSuccess(true);
            onClose(); // Close the hire modal to show success modal
        }, 1000);
    }, (error) => {
        console.error("EmailJS Hire Error Detailed:", error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
    });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  return (
    <>
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">Direct Inquiry</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Hire Me.</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Company / Name</label>
                      <input 
                        required
                        name="company"
                        type="text" 
                        placeholder="Organization Name"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Expected Salary (Monthly)</label>
                      <input 
                        required
                        name="salary"
                        type="text" 
                        placeholder="e.g. 50,000 BDT"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Key Responsibilities</label>
                    <textarea 
                      required
                      name="responsibilities"
                      rows="4" 
                      placeholder="Briefly describe the role..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium text-slate-900 resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={status === 'sending'}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${
                        status === 'sending' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                        status === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                        status === 'error' ? 'bg-red-500 text-white shadow-red-200' :
                        'bg-slate-900 text-white hover:bg-sky-600 shadow-slate-200'
                      }`}
                    >
                      {status === 'idle' && <><Send size={18} /> Submit Proposal</>}
                      {status === 'sending' && <>Processing...</>}
                      {status === 'success' && <><CheckCircle size={18} /> Proposal Received</>}
                      {status === 'error' && <><AlertCircle size={18} /> Failed to Send</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HireModal;
