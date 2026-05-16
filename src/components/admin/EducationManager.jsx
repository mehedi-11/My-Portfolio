import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, GraduationCap } from 'lucide-react';
import { portfolioAPI } from '../../api';

const EducationManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '', field: '', institution: '', period: '', icon: 'GraduationCap'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await portfolioAPI.getEducation();
      setItems(data);
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
      } else {
        await portfolioAPI.addEducation(formData);
      }
      setEditingId(null);
      setFormData({ degree: '', field: '', institution: '', period: '', icon: 'GraduationCap' });
      fetchItems();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await portfolioAPI.deleteEducation(id);
      fetchItems();
    }
  };

  if (loading && items.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          {editingId ? 'Edit Education' : 'Add New Education'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Degree</label>
            <input 
              required
              value={formData.degree}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
              placeholder="e.g. Bachelor Degree"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Field of Study</label>
            <input 
              required
              value={formData.field}
              onChange={(e) => setFormData({...formData, field: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institution</label>
            <input 
              required
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
              placeholder="e.g. Primeasia University"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Period</label>
            <input 
              required
              value={formData.period}
              onChange={(e) => setFormData({...formData, period: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium"
              placeholder="e.g. 2023 - Present"
            />
          </div>

          <div className="flex gap-4 md:col-span-2 mt-4">
             <button type="submit" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
               <Save size={18} /> {editingId ? 'Update' : 'Add'}
             </button>
             {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({ degree: '', field: '', institution: '', period: '', icon: 'GraduationCap' }); }} className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">Cancel</button>
             )}
          </div>
        </form>
      </section>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <GraduationCap size={20} />
                </div>
                <div>
                   <h4 className="font-black text-slate-900">{item.degree} in {item.field}</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.institution} • {item.period}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-600 transition-all"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(item._id)} className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManager;
