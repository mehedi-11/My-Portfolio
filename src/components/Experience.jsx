import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, Building2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Experience = () => {
  const { experience, loading } = usePortfolio();

  return (
    <section id="experience" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-3 block">Experience</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
            Work <span className="text-sky-600">History.</span>
          </h2>
        </div>

        {loading && experience.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {experience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-bl-[40px] -z-0 transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-sky-50/30" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Briefcase size={24} />
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-sky-600 transition-colors tracking-tight">
                    {item.designation}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-6">
                    <Building2 size={14} className="text-sky-600" />
                    {item.company}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-wider">
                      <Calendar size={14} className="text-sky-600" />
                      {item.duration}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
                      <MapPin size={14} /> {item.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
