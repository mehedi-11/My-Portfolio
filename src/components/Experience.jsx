import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronRight, Briefcase, Layout, Cpu, Globe, Smartphone, BookOpen, Code2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const iconMap = {
  Briefcase, Layout, Cpu, Globe, Smartphone, BookOpen, Code2
};

const Experience = () => {
  const { experience, loading } = usePortfolio();

  if (loading && experience.length === 0) return null;
  return (
    <section id="experience" className="section-padding bg-slate-50 relative">
      <div className="container-custom">
        <div className="max-w-3xl mb-16">
          <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-3 block">Career Path</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
            Professional <span className="text-sky-600">Timeline.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
            >
              {/* Icon/Logo area */}
              <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all flex-shrink-0">
                {(() => {
                  const Icon = iconMap[item.icon] || Briefcase;
                  return <Icon size={28} />;
                })()}
              </div>

              {/* Main Content */}
              <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">{item.designation}</h3>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm">{item.company}</p>
                </div>

                <div className="flex flex-col md:items-end gap-1">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs">
                    <Calendar size={14} className="text-sky-600" />
                    {item.duration}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>
              </div>

              {/* Action/Indicator */}
              <div className="hidden md:block">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all">
                   <ChevronRight size={20} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
