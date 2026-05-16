import { useState, useEffect } from 'react';
import { portfolioAPI } from '../../api';
import { Plus, Pencil, Trash2, Save, Loader2, X, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    technologies: [],
    image: '',
    live: '',
    github: '',
    order: 0
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await portfolioAPI.updateProject(editingId, formData);
        setMessage({ text: 'Project updated successfully!', type: 'success' });
      } else {
        await portfolioAPI.addProject(formData);
        setMessage({ text: 'Project added successfully!', type: 'success' });
      }
      fetchProjects();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setMessage({ text: 'Failed to save project.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await portfolioAPI.deleteProject(id);
        fetchProjects();
        setMessage({ text: 'Project deleted.', type: 'success' });
      } catch (err) {
        setMessage({ text: 'Delete failed.', type: 'error' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', description: '', technologies: [], image: '', live: '', github: '', order: 0 });
    setEditingId(null);
  };

  if (loading && projects.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Manage Projects</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Showing {projects.length} entries</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-slate-900 text-white px-4 py-2.5 rounded font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-slate-100"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded text-[11px] font-bold border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Technologies</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <img src={project.image} alt="" className="w-12 h-12 rounded object-cover border border-slate-100 bg-white" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-900">{project.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-tight">/{project.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && <span className="text-[9px] font-black text-slate-300">+{project.technologies.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(project)} className="p-2 text-sky-600 hover:bg-sky-50 rounded transition-all"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(project._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h4 className="text-lg font-black text-slate-900">{editingId ? 'Edit Project' : 'Add Project'}</h4>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slug</label>
                    <input 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="url-slug"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium h-24"
                      placeholder="Summarize the project..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technologies (comma separated)</label>
                    <input 
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                      onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="React, Tailwind..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                    <input 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Live URL</label>
                    <input 
                      value={formData.live}
                      onChange={(e) => setFormData({...formData, live: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GitHub URL</label>
                    <input 
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-600 transition-all shadow-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {editingId ? 'Update' : 'Save'}</>}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
              value={formData.live}
              onChange={(e) => setFormData({...formData, live: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
            <input 
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technologies (Comma separated)</label>
            <input 
              value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
              onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded focus:bg-white focus:border-sky-500 outline-none transition-all text-sm font-medium"
              placeholder="React, Node, MongoDB"
            />
          </div>

          <div className="flex gap-4 md:col-span-2">
             <button 
               type="submit"
               disabled={loading}
               className="px-10 py-5 bg-slate-900 text-white rounded font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-sky-600 transition-all shadow-xl shadow-slate-100"
             >
               {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> {editingId ? 'Update' : 'Create'} Project</>}
             </button>
             {editingId && (
               <button 
                 type="button"
                 onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', description: '', longDescription: '', technologies: [], github: '', live: '', image: '', architecture: [], technicalHighlights: [], features: [] }); }}
                 className="px-10 py-5 bg-slate-100 text-slate-400 rounded font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-red-50 hover:text-red-500 transition-all"
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
                  <div className="w-14 h-14 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all overflow-hidden">
                    {project.image ? <img src={project.image} alt="" className="w-full h-full object-cover" /> : <Layers size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(project)} className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(project._id)} className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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
