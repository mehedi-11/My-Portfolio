import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Coffee } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const About = () => {
  const { education, personalInfo } = usePortfolio();

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">My Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
              Passionate About <br />
              <span className="text-sky-600 italic">Coding.</span>
            </h2>
            
            <div className="space-y-5 mb-10">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {personalInfo?.statement?.split('.')[0] || 'Loading statement...'}.
              </p>
              <p className="text-base text-slate-500 leading-relaxed">
                {personalInfo?.statement?.split('.').slice(1).join('.')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 mb-1">10+</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Clients</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 mb-1">99%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfaction</span>
               </div>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-3">
                 <MapPin className="text-sky-600" size={18} />
                 <span className="text-xs font-bold text-slate-600">{personalInfo?.address || 'Bangladesh'}</span>
               </div>
               <div className="flex items-center gap-3">
                 <Coffee className="text-sky-600" size={18} />
                 <span className="text-xs font-bold text-slate-600">Coffee & Biryani</span>
               </div>
            </div>
          </motion.div>

          {/* Education - Reverted to side position */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                <GraduationCap className="text-sky-600" size={24} /> Education
              </h3>
              <div className="space-y-6">
                {education.map((item, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-slate-100 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-slate-200 rounded-full group-hover:border-sky-600 transition-colors" />
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1 block">{item.duration}</span>
                    <h4 className="text-sm font-black text-slate-800 mb-1">{item.degree}</h4>
                    <p className="text-slate-500 text-[11px] font-medium">{item.institution} • {item.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
