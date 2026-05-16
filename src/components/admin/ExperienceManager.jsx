import { useState, useEffect } from 'react';
import { portfolioAPI } from '../../api';
import { Plus, Pencil, Trash2, Save, Loader2, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceManager = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data } = await portfolioAPI.getExperience();
      setExperience(data);
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
        await portfolioAPI.updateExperience(editingId, formData);
        setMessage({ text: 'Experience updated!', type: 'success' });
      } else {
        await portfolioAPI.addExperience(formData);
        setMessage({ text: 'Experience added!', type: 'success' });
      }
      fetchExperience();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setMessage({ text: 'Failed to save.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      try {
        await portfolioAPI.deleteExperience(id);
        fetchExperience();
        setMessage({ text: 'Deleted.', type: 'success' });
      } catch (err) {
        setMessage({ text: 'Delete failed.', type: 'error' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ role: '', company: '', period: '', description: '', order: 0 });
    setEditingId(null);
  };

  if (loading && experience.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company</label>
            <input 
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-sm font-medium"
              placeholder="e.g. Unilink Global"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Period</label>
            <input 
              required
              value={formData.period}
              onChange={(e) => setFormData({...formData, period: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-sm font-medium"
              placeholder="e.g. 2022 - Present"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-sm font-medium"
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex gap-4 md:col-span-2 mt-4">
             <button type="submit" className="px-10 py-5 bg-slate-900 text-white rounded font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
               <Save size={18} /> {editingId ? 'Update' : 'Add'}
             </button>
             {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({ role: '', company: '', period: '', type: 'On-site', icon: 'Briefcase' }); }} className="px-10 py-5 bg-slate-100 text-slate-400 rounded font-black text-xs uppercase tracking-[0.2em]">Cancel</button>
             )}
          </div>
        </form>
      </section>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded border border-slate-100 flex items-center justify-between group">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <Briefcase size={20} />
                </div>
                <div>
                   <h4 className="font-black text-slate-900">{item.role}</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.company} • {item.period}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="w-9 h-9 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-600 transition-all"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(item._id)} className="w-9 h-9 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
