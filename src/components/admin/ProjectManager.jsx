import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Github, Loader2, Save, X } from 'lucide-react';
import { portfolioAPI } from '../../api';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', longDescription: '',
    technologies: [], github: '', live: '', image: '', architecture: [], technicalHighlights: [], features: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await portfolioAPI.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await portfolioAPI.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await portfolioAPI.updateProject(editingId, formData);
      } else {
        await portfolioAPI.addProject(formData);
      }
      setEditingId(null);
      setFormData({
        title: '', slug: '', description: '', longDescription: '',
        technologies: [], github: '', live: '', image: '', architecture: [], technicalHighlights: [], features: []
      });
      fetchProjects();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-12">
      {/* Form Section */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          {editingId ? <><Pencil size={24} className="text-sky-600" /> Edit Project</> : <><Plus size={24} className="text-sky-600" /> Add New Project</>}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
            <input 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="e.g. AI Content Ecosystem"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slug (URL)</label>
            <input 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="e.g. ai-content-ecosystem"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium h-24 resize-none"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Long Description (Detailed Case Study)</label>
            <textarea 
              required
              value={formData.longDescription}
              onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium h-40 resize-none"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">GitHub Link</label>
            <input 
              value={formData.github}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Live Link</label>
            <input 
              value={formData.live}
              onChange={(e) => setFormData({...formData, live: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
            <input 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technologies (Comma separated)</label>
            <input 
              value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
              onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="React, Node, MongoDB"
            />
          </div>

          <div className="flex gap-4 md:col-span-2">
             <button 
               type="submit"
               disabled={loading}
               className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-sky-600 transition-all shadow-xl shadow-slate-100"
             >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> {editingId ? 'Update' : 'Create'} Project</>}
             </button>
             {editingId && (
               <button 
                 type="button"
                 onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', description: '', longDescription: '', technologies: [], github: '', live: '', image: '', architecture: [], technicalHighlights: [], features: [] }); }}
                 className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-red-50 hover:text-red-500 transition-all"
               >
                 <X size={18} /> Cancel
               </button>
             )}
          </div>
        </form>
      </section>

      {/* List Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          Existing Projects <span className="text-xs px-3 py-1 bg-slate-100 text-slate-400 rounded-full">{projects.length}</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all overflow-hidden">
                    {project.image ? <img src={project.image} alt="" className="w-full h-full object-cover" /> : <Layers size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(project)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(project._id)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
               </div>
               <h4 className="text-lg font-black text-slate-900 mb-2">{project.title}</h4>
               <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{project.description}</p>
               <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors"><Github size={18} /></a>}
                  {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors"><ExternalLink size={18} /></a>}
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectManager;
