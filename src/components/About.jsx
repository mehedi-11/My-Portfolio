import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Coffee } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const About = () => {
  const { education, personalInfo, loading } = usePortfolio();

  if (loading && education.length === 0) return null;
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

            <div className="grid grid-cols-2 gap-8">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 mb-1">10+</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Clients</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 mb-1">99%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfaction</span>
               </div>
            </div>
          </motion.div>

          {/* Education & Fun Facts */}
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
                  <div key={index} className="relative pl-6 group">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100 group-hover:bg-sky-600 transition-colors" />
                    <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest mb-1 block">{item.duration}</span>
                    <h4 className="text-base font-black text-slate-800">{item.degree}</h4>
                    <p className="text-slate-500 text-xs font-medium">{item.institution}</p>
                    <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-tight">{item.location} • {item.result}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <div className="text-sky-600"><MapPin size={18} /></div>
                 <p className="text-xs font-black text-slate-800">Based In</p>
                 <p className="text-[10px] text-slate-500 font-medium">Bangladesh</p>
               </div>
               <div className="space-y-2">
                 <div className="text-sky-600"><Coffee size={18} /></div>
                 <p className="text-xs font-black text-slate-800">Fuel</p>
                 <p className="text-[10px] text-slate-500 font-medium">Coffee & Biryani</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
