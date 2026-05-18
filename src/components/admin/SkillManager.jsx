import { useState, useEffect } from 'react';
import AdminLoader from './AdminLoader';
import { portfolioAPI } from '../../api';
import { Plus, Pencil, Trash2, Save, Loader2, X, Globe, Terminal, Database, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({ category: 'Frontend', title: '', description: '', items: '', order: 0 });

  const categoryIcons = { frontend: <Globe size={16} />, backend: <Terminal size={16} />, database: <Database size={16} />, tools: <Wrench size={16} /> };

  useEffect(() => { fetchSkills(); }, []);

  async function fetchSkills() {
    try { const { data } = await portfolioAPI.getSkills(); setSkills(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    const skillData = { ...formData, items: typeof formData.items === 'string' ? formData.items.split(',').map(s => s.trim()).filter(s => s !== '') : formData.items };
    try {
      if (editingId) { await portfolioAPI.updateSkill(editingId, skillData); setMessage({ text: 'Updated!', type: 'success' }); }
      else { await portfolioAPI.addSkill(skillData); setMessage({ text: 'Added!', type: 'success' }); }
      fetchSkills(); setShowModal(false); resetForm();
    } catch (err) { console.error(err); setMessage({ text: 'Failed.', type: 'error' }); }
    finally { setLoading(false); setTimeout(() => setMessage({ text: '', type: '' }), 3000); }
  }

  const handleEdit = (item) => { setFormData({ ...item, items: Array.isArray(item.items) ? item.items.join(', ') : item.items }); setEditingId(item._id); setShowModal(true); };

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return;
    try { await portfolioAPI.deleteSkill(id); fetchSkills(); setMessage({ text: 'Deleted.', type: 'success' }); }
    catch (err) { console.error(err); setMessage({ text: 'Failed.', type: 'error' }); }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }

  const resetForm = () => { setFormData({ category: 'Frontend', title: '', description: '', items: '', order: 0 }); setEditingId(null); };

  if (loading && skills.length === 0) return <AdminLoader label="Loading skills" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-slate-900">Skill Categories</h3>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">Manage skill boxes shown on visitor site</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-slate-900 text-white px-4 py-2.5 rounded font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded text-[11px] font-bold border ${message.type === 'success' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{message.text}</div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {skills.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded border border-slate-100 group hover:border-rose-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-rose-600">{categoryIcons[item.category.toLowerCase()] || <Globe size={18} />}</div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
            <h4 className="text-base font-black text-slate-900 mb-1">{item.title}</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{item.category}</p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.items.slice(0, 5).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-[9px] font-bold uppercase rounded border border-slate-100">{skill}</span>
              ))}
              {item.items.length > 5 && <span className="text-[9px] font-bold text-slate-500">+{item.items.length - 5} more</span>}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative w-full max-w-lg bg-white rounded border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] m-4">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h4 className="text-base font-black text-slate-900">{editingId ? 'Edit Category' : 'Add Category'}</h4>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 text-[13px] font-medium">
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Display Title</label>
                    <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 text-[13px] font-medium" placeholder="e.g. Frontend Architecture" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 text-[13px] font-medium resize-none" placeholder="Describe this skill group..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                  <textarea required rows={4} value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 text-[13px] font-medium resize-none" placeholder="React.js, Vue.js, Tailwind CSS..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-60">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {editingId ? 'Update' : 'Save'}</>}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillManager;