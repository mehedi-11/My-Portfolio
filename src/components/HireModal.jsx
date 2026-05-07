import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const HireModal = ({ isOpen, onClose }) => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          setStatus('idle');
          onClose();
        }, 3000);
    }, (error) => {
        console.error("EmailJS Hire Error Detailed:", error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hire Me</h2>
              <p className="text-xs text-slate-400 font-medium">Please provide your company details to start a collaboration.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Company Name</label>
                  <input 
                    required
                    name="company_name"
                    type="text" 
                    placeholder="e.g. Acme Corp" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Company Location</label>
                  <input 
                    required
                    name="company_location"
                    type="text" 
                    placeholder="e.g. New York, USA" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Official Email</label>
                  <input 
                    required
                    name="user_email"
                    type="email" 
                    placeholder="hr@company.com" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Official Phone</label>
                  <input 
                    required
                    name="user_phone"
                    type="tel" 
                    placeholder="+1 234 567 890" 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Working Responsibilities</label>
                <textarea 
                  required
                  name="responsibilities"
                  rows="3" 
                  placeholder="Describe the role..." 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Offer Salary</label>
                <input 
                  required
                  name="salary"
                  type="text" 
                  placeholder="e.g. $5,000 / month" 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Additional Message</label>
                <textarea 
                  name="message"
                  rows="2" 
                  placeholder="Any extra details..." 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all text-sm font-medium resize-none"
                ></textarea>
              </div>

              {/* Hidden field for template consistency */}
              <input type="hidden" name="subject" value="Hiring Offer" />
              <input type="hidden" name="user_name" value="Employer" />
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
            <button 
              disabled={status === 'sending'}
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={status === 'sending'}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                status === 'sending' ? 'bg-slate-400 cursor-not-allowed' : 
                status === 'success' ? 'bg-emerald-600 shadow-emerald-100' : 
                status === 'error' ? 'bg-red-600 shadow-red-100' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-100'
              } text-white`}
            >
              {status === 'idle' && <><Send size={16} /> Send Offer</>}
              {status === 'sending' && <>Sending...</>}
              {status === 'success' && <><CheckCircle size={16} /> Offer Sent!</>}
              {status === 'error' && <><AlertCircle size={16} /> Failed</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HireModal;
