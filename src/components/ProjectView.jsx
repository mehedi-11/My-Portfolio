import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Mail,
  FileText,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects, personalInfo, loading } = usePortfolio();
  
  // Find project by slug instead of index
  const project = projects.find(p => p.slug === slug);

  // Dynamic SEO & Scroll Management
  useEffect(() => {
    if (project) {
      // Update Page Title
      document.title = `${project.title} | MD Mehedi Hasan Portfolio`;
      
      // Update Meta Description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', project.description);
      }
      
      // Update OG Title for Social Sharing
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${project.title} - Technical Case Study`);
      }
    }
    
    window.scrollTo(0, 0);
  }, [project]);

  if (loading && projects.length === 0) return null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tighter">Project Not Found</h1>
          <Link to="/" className="text-sky-600 font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-inter">
      {/* Professional Minimal Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 sticky top-0 z-[100]">
        <div className="container-custom flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          
          <div className="flex items-center gap-2">
             {project.github !== "#" && (
               <a href={project.github} target="_blank" rel="noreferrer" className="w-9 h-9 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                 <Github size={18} />
               </a>
             )}
             {project.live !== "#" && (
               <a href={project.live} target="_blank" rel="noreferrer" className="px-5 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center gap-2">
                 Live View <ExternalLink size={12} />
               </a>
             )}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container-custom max-w-4xl pt-12 md:pt-20"
      >
        {/* Document Header Info */}
        <header className="mb-16 pb-12 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-md">Project Case Study</span>
            <span className="text-slate-300 text-xs font-medium flex items-center gap-1">
               <Clock size={12} /> May 2026
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
            {project.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Developer</p>
               <p className="text-sm font-bold text-slate-900">{personalInfo.name}</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                 <CheckCircle2 size={14} /> Deployed
               </p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Technology</p>
               <p className="text-sm font-bold text-slate-900">{project.technologies[0]}</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
               <p className="text-sm font-bold text-slate-900">Full-Stack Development</p>
             </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="space-y-20">
          
          {/* Section 1: Overview */}
          <section>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <FileText size={18} className="text-sky-600" /> 01. Overview & Objectives
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                {project.description}
              </p>
              <p className="text-base text-slate-500 leading-relaxed">
                {project.longDescription}
              </p>
            </div>
          </section>

          {/* Section 2: Technical Architecture */}
          <section className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <Layers size={18} className="text-sky-600" /> 02. Technical Architecture
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 {project.architecture.map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="mt-1"><Cpu size={16} className="text-sky-600" /></div>
                     <p className="text-sm text-slate-600 font-medium leading-relaxed">{item}</p>
                   </div>
                 ))}
               </div>
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm self-start">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Development Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[10px] font-bold uppercase rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </section>

          {/* Section 3: Implementation Highlights */}
          <section>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <Terminal size={18} className="text-sky-600" /> 03. Core Implementation
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
               {project.technicalHighlights.map((highlight, i) => (
                 <div key={i} className="p-6 border-l-4 border-sky-100 bg-white hover:bg-slate-50 transition-colors">
                    <p className="text-slate-800 text-sm font-bold leading-relaxed">{highlight}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* Section 4: Security & Assurance */}
          <section className="pt-12 border-t border-slate-100 flex items-start gap-8">
             <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 flex-shrink-0">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Quality & Security Assurance</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  This project adheres to professional development standards, featuring secure authentication layers and optimized database indexing to ensure reliability and user data protection.
                </p>
             </div>
          </section>
        </main>

        {/* Formal Footer */}
        <footer className="mt-32 pt-12 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">© 2026</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Technical Documentation</span>
           </div>
           <a href={`mailto:${personalInfo.email}`} className="text-xs font-black text-sky-600 hover:underline uppercase tracking-widest flex items-center gap-2">
              Inquire <Mail size={14} />
           </a>
        </footer>
      </motion.div>
    </div>
  );
};

export default ProjectView;
