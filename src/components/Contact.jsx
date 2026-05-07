import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
        setStatus('success');
        formRef.current.reset();
        setTimeout(() => setStatus('idle'), 5000);
    }, (error) => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
    });
  };

  return (
    <section id="contact" className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Side: Info */}
          <div className="lg:col-span-5">
            <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">Contact</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
              Let's build <br />
              something <span className="text-sky-600">Great.</span>
            </h2>
            
            <p className="text-base text-slate-500 font-medium mb-12 leading-relaxed max-w-md">
              Ready to start a new project or just have a question? I'm here to help you bring your ideas to life.
            </p>

            <div className="space-y-6 mb-12">
               <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Me</p>
                    <a href={`mailto:${personalInfo.email}`} className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors">{personalInfo.email}</a>
                  </div>
               </div>
               
               <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Call Me</p>
                    <a href={`tel:${personalInfo.phone}`} className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors">{personalInfo.phone}</a>
                  </div>
               </div>

               <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">WhatsApp</p>
                    <a href={`https://wa.me/${personalInfo.whatsapp}`} target="_blank" rel="noreferrer" className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors">{personalInfo.whatsapp}</a>
                  </div>
               </div>

               <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-base font-bold text-slate-900">{personalInfo.location}</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-3">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-600 transition-all">
                <Github size={18} />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-600 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Right Side: Simple Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Your Name</label>
                    <input 
                      required
                      name="user_name"
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-sm font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Email Address</label>
                    <input 
                      required
                      name="user_email"
                      type="email" 
                      placeholder="e.g. john@example.com" 
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Subject</label>
                  <input 
                    required
                    name="subject"
                    type="text" 
                    placeholder="e.g. New Project Inquiry" 
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-sm font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Your Message</label>
                  <textarea 
                    required
                    name="message"
                    rows="5" 
                    placeholder="How can I help you?" 
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all text-sm font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={status === 'sending'}
                  className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200 ${
                    status === 'sending' ? 'bg-slate-400 cursor-not-allowed' : 
                    status === 'success' ? 'bg-emerald-600' : 
                    status === 'error' ? 'bg-red-600' : 'bg-slate-900 hover:bg-sky-600'
                  } text-white`}
                >
                  {status === 'idle' && <><Send size={16} /> Send Message</>}
                  {status === 'sending' && <>Sending...</>}
                  {status === 'success' && <><CheckCircle size={16} /> Sent Successfully!</>}
                  {status === 'error' && <><AlertCircle size={16} /> Failed to Send</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
