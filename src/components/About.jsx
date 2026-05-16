import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Coffee } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const About = () => {
  const { education, personalInfo, loading } = usePortfolio();

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
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
          </motion.div>

          {/* Fun Facts Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-10"
          >
             <div className="space-y-2">
               <div className="text-sky-600"><MapPin size={24} /></div>
               <p className="text-sm font-black text-slate-800">Based In</p>
               <p className="text-xs text-slate-500 font-medium">{personalInfo?.address || 'Bangladesh'}</p>
             </div>
             <div className="space-y-2">
               <div className="text-sky-600"><Coffee size={24} /></div>
               <p className="text-sm font-black text-slate-800">Fuel</p>
               <p className="text-xs text-slate-500 font-medium">Coffee & Biryani</p>
             </div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 mb-1">10+</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Clients</span>
             </div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 mb-1">99%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfaction</span>
             </div>
          </motion.div>
        </div>

        {/* Education Grid - 3 per row */}
        <div className="pt-16 border-t border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-sky-600" size={24} /> Education
          </h3>
          
          {loading && education.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {education.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-sky-200 transition-all hover:shadow-xl hover:shadow-sky-100/50 group"
                >
                  <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-3 block">{item.duration}</span>
                  <h4 className="text-lg font-black text-slate-800 mb-1 group-hover:text-sky-600 transition-colors leading-tight">{item.degree}</h4>
                  <p className="text-slate-500 text-xs font-bold mb-4">{item.institution}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.location}</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-900 text-[10px] font-black rounded">{item.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
