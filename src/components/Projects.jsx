import { motion } from 'framer-motion';
import { ExternalLink, Github, BookOpen, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const Projects = () => {
  const { projects, loading } = usePortfolio();

  // Limit to 8 projects for the home page
  const displayProjects = projects.slice(0, 8);
  const hasMoreProjects = projects.length > 8;

  return (
    <section id="projects" className="section-padding bg-white relative">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px] mb-4 block">Portfolio</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              My <br />
              <span className="text-sky-600">Projects.</span>
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Here are some of the projects I have worked on recently.
            </p>
          </div>
          
          {hasMoreProjects && (
            <Link 
              to="/projects"
              className="group flex items-center gap-3 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:text-sky-600 transition-all"
            >
              View All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {displayProjects.map((project, index) => {
              const hasGithub = project.github && project.github !== "#";
              const hasLive = project.live && project.live !== "#";

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-[#f8fafc] p-8 md:p-10 rounded-[2.5rem] border border-slate-100 hover:border-sky-200 transition-all hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                        <Code2 size={24} />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                        {(project.technologies || []).slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-slate-200/60 mt-auto">
                    {hasGithub && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-white text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        title="Source Code"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {hasLive && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-white text-slate-900 border border-slate-200 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                        title="Live Preview"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <Link 
                      to={`/project/${project.slug}`}
                      className="flex-grow px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-slate-200"
                    >
                      Case Study <BookOpen size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {hasMoreProjects && (
          <div className="mt-20 text-center">
            <Link 
              to="/projects"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-100"
            >
              Explore Full Gallery <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
