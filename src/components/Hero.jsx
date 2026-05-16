import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Hero = () => {
  const { personalInfo } = usePortfolio();
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#fcfcfd]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 z-0" />
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-sky-100/30 rounded-full blur-[100px] z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] z-0" />

      <div className="container-custom relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-[1px] bg-sky-600"></span>
              <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px]">Hello, I am</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-6 tracking-tighter">
              I'm <span className="text-sky-600">Mehedi</span>,<br />
              Web Developer.
            </h1>
            
            <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
              I build clean, modern, and user-friendly websites that provide a <span className="text-slate-900 font-bold">smooth and fast</span> user experience.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects" 
                className="group relative px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 overflow-hidden shadow-2xl shadow-slate-200"
              >
                <span className="relative z-10">See My Projects</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} />
                <div className="absolute inset-0 bg-sky-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.a>
              
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={personalInfo.cvPath}
                download="Mehedi_Hasan_CV.pdf"
                className="px-7 py-3.5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-sm flex items-center gap-3 hover:border-sky-600 transition-colors shadow-sm"
              >
                <Download size={18} className="text-sky-600" /> Download CV
              </motion.a>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-4 ring-slate-50">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="client" />
                   </div>
                 ))}
                 <div className="w-9 h-9 rounded-full border-2 border-white bg-sky-600 flex items-center justify-center text-[9px] text-white font-bold ring-4 ring-slate-50">
                   10+
                 </div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900">10+ Happy Clients</p>
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} size={10} fill="currentColor" />)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Visual */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group">
               <img 
                 src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop" 
                 alt="Mehedi Hasan" 
                 className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>

            {/* Decorative Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-4 p-4 bg-white rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-50"
            >
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">03+</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Years Experience</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-4 p-4 bg-white rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-50"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <div className="text-lg font-bold">99%</div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900">Project Success</p>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-1">
                  <div className="w-[99%] h-full bg-sky-600 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
