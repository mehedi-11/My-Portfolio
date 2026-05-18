import { useState } from 'react';
import { Save, User, Lock, Loader2, CheckCircle } from 'lucide-react';
import { authAPI } from '../../api';

const ProfileManager = () => {
  const [formData, setFormData] = useState({ username: localStorage.getItem('adminUser') || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updateData = { username: formData.username };
      if (formData.password) updateData.password = formData.password;
      
      await authAPI.updateProfile(updateData);
      localStorage.setItem('adminUser', formData.username);
      setSuccess(true);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <section className="bg-white p-6 md:p-8 rounded border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
          Account Settings
        </h3>

        {success && (
          <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold flex items-center gap-3 border border-emerald-100">
            <CheckCircle size={16} /> Credentials updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded text-[11px] font-bold flex items-center gap-3 border border-red-100">
             {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                required
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-[13px] font-medium focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Security Update</p>
            
            <div className="grid gap-4">
               <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Leave blank to keep current"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-[13px] font-medium focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Repeat new password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none transition-all text-[13px] font-medium focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-600 transition-all shadow-lg mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfileManager;
