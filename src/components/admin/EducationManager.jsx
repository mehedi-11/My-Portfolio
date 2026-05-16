import { useState, useEffect } from 'react';
import { portfolioAPI } from '../../api';
import { Plus, Pencil, Trash2, Save, Loader2, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    degree: '',
    school: '',
    period: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await portfolioAPI.getEducation();
      setEducation(data);
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
        await portfolioAPI.updateEducation(editingId, formData);
        setMessage({ text: 'Education updated!', type: 'success' });
      } else {
        await portfolioAPI.addEducation(formData);
        setMessage({ text: 'Education added!', type: 'success' });
      }
      fetchEducation();
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
    setFormData({
      degree: item.degree,
      school: item.school,
      period: item.period,
      description: item.description,
      order: item.order || 0
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      try {
        await portfolioAPI.deleteEducation(id);
        fetchEducation();
        setMessage({ text: 'Deleted.', type: 'success' });
      } catch (err) {
        setMessage({ text: 'Delete failed.', type: 'error' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ degree: '', school: '', period: '', description: '', order: 0 });
    setEditingId(null);
  };

  if (loading && education.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Academic History</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{education.length} Entries found</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-slate-900 text-white px-4 py-2.5 rounded font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg"
        >
          <Plus size={16} /> Add Education
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Degree & School</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {education.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center text-slate-400"><GraduationCap size={18} /></div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900">{item.degree}</span>
                        <span className="text-[11px] text-sky-600 font-bold">{item.school}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{item.period}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 text-sky-600 hover:bg-sky-50 rounded transition-all"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"><Trash2 size={16} /></button>
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
              className="relative w-full max-w-xl bg-white rounded shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h4 className="text-lg font-black text-slate-900">{editingId ? 'Edit Education' : 'Add Education'}</h4>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Degree</label>
                    <input 
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="e.g. B.Sc. in Computer Science"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">School / University</label>
                    <input 
                      required
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="University Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Period</label>
                    <input 
                      required
                      value={formData.period}
                      onChange={(e) => setFormData({...formData, period: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium"
                      placeholder="e.g. 2018 - 2022"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-sky-500 transition-all text-[13px] font-medium h-24"
                      placeholder="Key achievements..."
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
      </AnimatePresence>
    </div>
  );
};

export default EducationManager;
