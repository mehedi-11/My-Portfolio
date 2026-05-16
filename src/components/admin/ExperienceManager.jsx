import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../../api';
import { Plus, Pencil as Edit2, Trash2, Save, X, Loader2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceManager = () => {
  const [data, setData] = useState([]);
  const initialForm = { designation: '', company: '', location: '', type: 'Onsite', duration: '', description: '', order: 0 };
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await portfolioAPI.getExperience();
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioAPI.updateExperience(editingId, formData);
      } else {
        await portfolioAPI.addExperience(formData);
      }
      fetchData();
      setShowModal(false);
      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      console.error(err);
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
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading && data.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900">Experience Management</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your professional journey</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData(initialForm); setShowModal(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded font-black text-[11px] uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation & Company</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Location</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-[13px]">{item.designation}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.company}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-0.5 rounded bg-sky-50 text-sky-600 text-[10px] font-black uppercase mb-1">{item.type}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium"><MapPin size={12} /> {item.location}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                    <Calendar size={14} className="text-slate-300" /> {item.duration}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded shadow-2xl overflow-hidden flex flex-col max-h-[85vh] m-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0 bg-white">
                <h4 className="text-base font-black text-slate-900">{editingId ? 'Edit Experience' : 'Add Experience'}</h4>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                    <input required value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500" placeholder="e.g. Senior Developer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                    <input required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500" placeholder="e.g. Google" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Job Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500">
                      <option value="Onsite">Onsite</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                    <input required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500" placeholder="e.g. 2021 - Present" />
                  </div>
                </div>
                <div className="space-y-1 mt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                  <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500" placeholder="e.g. Dhaka, Bangladesh" />
                </div>
                <div className="space-y-1 mt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500 resize-none" placeholder="Describe your roles..."></textarea>
                </div>
                <div className="space-y-1 mt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500" />
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-600 transition-all shadow-lg mt-8">
                  <Save size={16} /> {editingId ? 'Update Experience' : 'Save Experience'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceManager;
