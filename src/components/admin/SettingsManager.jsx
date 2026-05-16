import { useState, useEffect } from 'react';
import { Save, User, Lock, Loader2, CheckCircle, Mail, Phone, MapPin, Facebook, Linkedin, Github, Twitter, Instagram, Globe } from 'lucide-react';
import { authAPI, settingsAPI } from '../../api';

const SettingsManager = () => {
  const [profileData, setProfileData] = useState({ username: localStorage.getItem('adminUser') || '', password: '', confirmPassword: '' });
  const [settingsData, setSettingsData] = useState({
    email: '', phone: '', whatsapp: '', address: '',
    socials: { facebook: '', linkedin: '', github: '', twitter: '', instagram: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ profile: false, settings: false });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.getSettings();
      if (data) setSettingsData(data);
    } catch (err) {
      console.error("Failed to fetch settings");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const updateData = { username: profileData.username };
      if (profileData.password) updateData.password = profileData.password;
      await authAPI.updateProfile(updateData);
      localStorage.setItem('adminUser', profileData.username);
      setSuccess({ ...success, profile: true });
      setTimeout(() => setSuccess({ ...success, profile: false }), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.updateSettings(settingsData);
      setSuccess({ ...success, settings: true });
      setTimeout(() => setSuccess({ ...success, settings: false }), 3000);
    } catch (err) {
      setError('Failed to update contact info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
      {/* Account Settings */}
      <section className="bg-white p-6 md:p-8 rounded border border-slate-100 shadow-sm flex flex-col h-full">
        <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center"><Lock size={16} /></div>
          Account Credentials
        </h3>

        {success.profile && <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold flex items-center gap-2 border border-emerald-100"><CheckCircle size={16} /> Login details updated!</div>}
        
        <form onSubmit={handleProfileSubmit} className="space-y-4 flex-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                required value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password" value={profileData.password}
                onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                placeholder="Leave blank to keep current"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>
          <div className="space-y-1 pb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password" value={profileData.confirmPassword}
                onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>
          <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-600 transition-all shadow-lg mt-auto">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Update Credentials</>}
          </button>
        </form>
      </section>

      {/* Contact & Social Settings */}
      <section className="bg-white p-6 md:p-8 rounded border border-slate-100 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 text-white rounded flex items-center justify-center"><Globe size={16} /></div>
          Portfolio Information
        </h3>

        {success.settings && <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold flex items-center gap-2 border border-emerald-100"><CheckCircle size={16} /> Contact info saved!</div>}

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Public Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" value={settingsData.email}
                  onChange={(e) => setSettingsData({...settingsData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" value={settingsData.phone}
                  onChange={(e) => setSettingsData({...settingsData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Office / Home Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" value={settingsData.address}
                onChange={(e) => setSettingsData({...settingsData, address: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Social Media Links</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input placeholder="Facebook URL" value={settingsData.socials.facebook} onChange={(e) => setSettingsData({...settingsData, socials: {...settingsData.socials, facebook: e.target.value}})} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-sky-500" />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input placeholder="LinkedIn URL" value={settingsData.socials.linkedin} onChange={(e) => setSettingsData({...settingsData, socials: {...settingsData.socials, linkedin: e.target.value}})} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-sky-500" />
              </div>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input placeholder="GitHub URL" value={settingsData.socials.github} onChange={(e) => setSettingsData({...settingsData, socials: {...settingsData.socials, github: e.target.value}})} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-sky-500" />
              </div>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input placeholder="Instagram URL" value={settingsData.socials.instagram} onChange={(e) => setSettingsData({...settingsData, socials: {...settingsData.socials, instagram: e.target.value}})} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-sky-500" />
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full py-4 bg-sky-600 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sky-700 transition-all shadow-lg mt-4">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Information</>}
          </button>
        </form>
      </section>
    </div>
  );
};

export default SettingsManager;
