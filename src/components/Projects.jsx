import { motion } from 'framer-motion';
import { ExternalLink, Github, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const Projects = () => {
  const { projects, loading } = usePortfolio();

  return (
    <section id="projects" className="section-padding bg-[#fcfcfd]">
      <div className="container-custom">
        <div className="mb-16">
          <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">Portfolio</span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            My <br />
            <span className="text-sky-600">Projects.</span>
          </h2>
          <p className="text-base text-slate-500 font-medium max-w-xl leading-relaxed">
            Here are some of the projects I have worked on recently.
          </p>
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => {
              const hasGithub = project.github && project.github !== "#";
              const hasLive = project.live && project.live !== "#";

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:border-sky-200 transition-all hover:shadow-xl hover:shadow-sky-500/5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Info Part */}
                    <div className="flex-grow max-w-2xl">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Actions Part */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                      {!hasGithub && hasLive && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-slate-200"
                        >
                          Live View <ExternalLink size={14} />
                        </a>
                      )}

                      {hasGithub && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-slate-200"
                        >
                          Source View <Github size={14} />
                        </a>
                      )}

                      <Link 
                        to={`/project/${project.slug}`}
                        className="px-5 py-2.5 bg-white text-slate-900 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-sky-600 transition-all shadow-sm"
                      >
                        Read Document <BookOpen size={14} className="text-sky-600" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
