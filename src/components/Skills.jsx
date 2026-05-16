import { motion } from 'framer-motion';
import { Terminal, Wrench, Globe, Smartphone, Cpu, ShieldCheck, Database } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Skills = () => {
  const { skills, loading } = usePortfolio();
  
  // Mapping categories to their icons and styles
  const categoryConfigs = {
    frontend: { icon: Globe, color: "from-sky-500 to-sky-600", bg: "bg-sky-50" },
    backend: { icon: Terminal, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50" },
    database: { icon: Database, color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
    tools: { icon: Wrench, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" }
  };

  // Convert the skills object/array from context into a displayable list
  // Note: PortfolioContext now provides skills as a categorized object
  const skillList = Object.keys(skills || {}).map(cat => {
    const config = categoryConfigs[cat.toLowerCase()] || { icon: Globe, color: "from-slate-500 to-slate-600", bg: "bg-slate-50" };
    
    // We need to find the full category object from the backend response if possible
    // Actually, let's assume we might need to update PortfolioContext to keep the full objects
    return {
      category: cat,
      ...config,
      // The context currently only stores the items array in the 'skills' object
      // We might need to adjust this if we want to show dynamic titles/descriptions
    };
  });

  return (
    <section id="skills" className="section-padding bg-[#fcfcfd]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Header Content */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-3 block">What I Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
              Technical <br />
              <span className="text-sky-600">Skills.</span>
            </h2>
            <p className="text-base text-slate-500 leading-relaxed mb-8">
              I specialize in building high-quality web applications using modern technologies.
            </p>
            
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 group">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                   <ShieldCheck size={20} />
                 </div>
                 <p className="font-bold text-sm text-slate-800">Security First Mindset</p>
               </div>
               <div className="flex items-center gap-3 group">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                   <Smartphone size={20} />
                 </div>
                 <p className="font-bold text-sm text-slate-800">Mobile Responsive Design</p>
               </div>
               <div className="flex items-center gap-3 group">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                   <Cpu size={20} />
                 </div>
                 <p className="font-bold text-sm text-slate-800">Performance Optimization</p>
               </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* We need to fetch the raw categories array from context to see titles/descriptions */}
                {(skills.raw || []).map((category, index) => {
                  const config = categoryConfigs[category.category.toLowerCase()] || { icon: Globe, color: "from-slate-500 to-slate-600", bg: "bg-slate-50" };
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 ${config.bg} rounded-bl-[80px] -z-0 transition-all duration-500 group-hover:w-full group-hover:h-full group-hover:rounded-none`} />
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                          <config.icon size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{category.title}</h3>
                        <p className="text-slate-500 text-xs mb-6 leading-relaxed">{category.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {category.items.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative shadow-2xl group"
        >
           <div className="absolute top-0 right-0 w-80 h-80 bg-sky-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-sky-600/40 transition-all duration-700" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
             <div className="max-w-xl">
               <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">Ready to launch your <br /><span className="text-sky-500">next big thing?</span></h3>
               <p className="text-slate-400 text-lg font-medium">I'm currently accepting new projects and collaborations. Let's build something extraordinary together.</p>
             </div>
             <a href="#contact" className="px-8 py-4 bg-white text-slate-900 rounded-[1.2rem] font-black text-base shadow-xl hover:shadow-white/20 transition-all">Start A Conversation</a>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
