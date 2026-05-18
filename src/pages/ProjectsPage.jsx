import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code2, Github, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const ProjectsPage = () => {
  const { projects, loading } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique technologies for categories (simplified for now)
  const categories = useMemo(() => {
    const cats = ['All', 'Frontend', 'Backend', 'Fullstack'];
    return cats;
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || 
                             (activeCategory === 'Frontend' && project.technologies.some(t => ['React', 'HTML', 'Tailwind', 'CSS'].includes(t))) ||
                             (activeCategory === 'Backend' && project.technologies.some(t => ['Node', 'PHP', 'Express', 'MySQL'].includes(t))) ||
                             (activeCategory === 'Fullstack' && project.technologies.length > 3);

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="container-custom">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-sky-600 transition-all font-bold text-xs uppercase tracking-widest mb-8 group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            All <span className="text-sky-600">Projects.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Explore my complete collection of projects, ranging from simple tools to complex full-stack ecosystems.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search projects by name or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-sky-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-sky-600 hover:text-sky-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project, index) => (
                <motion.div 
                  key={project._id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-sky-200 transition-all hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full shadow-sm"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                        <Code2 size={24} />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end max-w-[150px]">
                        {(project.technologies || []).slice(0, 2).map((tech, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-8 border-t border-slate-50 mt-auto">
                    {project.github && project.github !== "#" && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                        <Github size={18} />
                      </a>
                    )}
                    <Link 
                      to={`/project/${project.slug}`}
                      className="flex-grow px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-600 transition-all"
                    >
                      Case Study <BookOpen size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-32">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search size={40} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No projects found</h3>
             <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
