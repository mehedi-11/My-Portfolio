import { useState, useEffect } from 'react';
import { 
  Save, User, Lock, Loader2, CheckCircle, Mail, Phone, MapPin, 
  Facebook, Linkedin, Github, Instagram, Globe, FileText, 
  MessageSquare, Database, Download, UploadCloud, AlertCircle
} from 'lucide-react';
import { authAPI, settingsAPI, backupAPI } from '../../api';

const SettingsManager = () => {
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem('adminUser') || '',
    password: '',
    confirmPassword: ''
  });
  
  const [settingsData, setSettingsData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    statement: '',
    github: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    website: '',
    cvPath: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [success, setSuccess] = useState({ profile: false, settings: false, backup: false });
  const [error, setError] = useState('');
  const [backupError, setBackupError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await settingsAPI.getSettings();
        if (data) setSettingsData(data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    }
    fetchSettings();
  }, []);

  async function handleProfileSubmit(e) {
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
      console.error(err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSettingsSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsAPI.updateSettings(settingsData);
      setSuccess({ ...success, settings: true });
      setTimeout(() => setSuccess({ ...success, settings: false }), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  }

  const handleExportBackup = async () => {
    setBackupLoading(true);
    setBackupError('');
    try {
      const response = await backupAPI.exportBackup();
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mehedi_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setSuccess({ ...success, backup: true });
      setTimeout(() => setSuccess({ ...success, backup: false }), 3000);
    } catch (err) {
      console.error(err);
      setBackupError('Export failed. Please check server logs.');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        if (!backupData.projects || !backupData.skills || !backupData.blogs) {
          setBackupError('Invalid backup file structure.');
          return;
        }

        if (window.confirm('WARNING: Restoring will overwrite all existing Projects, Skills, Blogs, Experiences, and Educations. This action is irreversible. Do you want to proceed?')) {
          setBackupLoading(true);
          setBackupError('');
          await backupAPI.restoreBackup(backupData);
          
          setSuccess({ ...success, backup: true });
          setTimeout(() => {
            setSuccess({ ...success, backup: false });
            window.location.reload(); // Reload to fetch fresh restored data
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        setBackupError('Failed to parse or restore JSON backup.');
      } finally {
        setBackupLoading(false);
        e.target.value = ''; // clear input
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
      {/* Account Settings & Backup Center Column */}
      <div className="space-y-8 flex flex-col">
        {/* Account Credentials */}
        <section className="bg-white p-6 md:p-8 rounded border border-slate-100 flex flex-col">
          <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
              <Lock size={16} />
            </div> 
            Account Credentials
          </h3>
          {success.profile && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded text-[11px] font-bold flex items-center gap-2 border border-rose-100">
              <CheckCircle size={16} /> Login details updated!
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded text-[11px] font-bold border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">Admin Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  required 
                  value={profileData.username} 
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="password" 
                  value={profileData.password} 
                  onChange={(e) => setProfileData({...profileData, password: e.target.value})} 
                  placeholder="Leave blank to keep current" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
            
            <div className="space-y-1 pb-4">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="password" 
                  value={profileData.confirmPassword} 
                  onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Update Credentials</>}
            </button>
          </form>
        </section>

        {/* suggestion: Backup & Restore Center */}
        <section className="bg-white p-6 md:p-8 rounded border border-slate-100 flex flex-col">
          <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center">
              <Database size={16} />
            </div>
            Backup & Restore Center
          </h3>

          {success.backup && (
            <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold flex items-center gap-2 border border-emerald-100">
              <CheckCircle size={16} /> Backup operation successful!
            </div>
          )}
          {backupError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded text-[11px] font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {backupError}
            </div>
          )}

          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
            Export a full JSON archive containing all portfolio components (Projects, Blogs, Skills, Experiences, Educations) to migrate servers or back up your hard work.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Export */}
            <button
              onClick={handleExportBackup}
              disabled={backupLoading}
              className="py-4 border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-900 rounded font-black text-[10px] uppercase tracking-widest flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-60"
            >
              {backupLoading ? (
                <Loader2 className="animate-spin text-indigo-600" size={20} />
              ) : (
                <Download className="text-slate-600 group-hover:text-indigo-600 transition-colors" size={20} />
              )}
              Export Portfolio JSON
            </button>

            {/* Restore */}
            <label
              className="py-4 border-2 border-slate-100 hover:border-rose-600 hover:bg-rose-50/20 text-slate-900 rounded font-black text-[10px] uppercase tracking-widest flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              {backupLoading ? (
                <Loader2 className="animate-spin text-rose-600" size={20} />
              ) : (
                <UploadCloud className="text-slate-600 group-hover:text-rose-600 transition-colors" size={20} />
              )}
              Restore from Backup
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                disabled={backupLoading}
                className="hidden"
              />
            </label>
          </div>
        </section>
      </div>

      {/* Portfolio Info Settings */}
      <section className="bg-white p-6 md:p-8 rounded border border-slate-100">
        <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 text-white rounded flex items-center justify-center">
            <Globe size={16} />
          </div>
          Portfolio Information
        </h3>
        
        {success.settings && (
          <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded text-[11px] font-bold flex items-center gap-2 border border-rose-100">
            <CheckCircle size={16} /> Portfolio info saved!
          </div>
        )}
        
        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">Public Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="email" 
                  value={settingsData.email} 
                  onChange={(e) => setSettingsData({...settingsData, email: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="text" 
                  value={settingsData.phone} 
                  onChange={(e) => setSettingsData({...settingsData, phone: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">WhatsApp Number</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="text" 
                  value={settingsData.whatsapp} 
                  onChange={(e) => setSettingsData({...settingsData, whatsapp: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">Location Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
                <input 
                  type="text" 
                  value={settingsData.address} 
                  onChange={(e) => setSettingsData({...settingsData, address: e.target.value})} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500" 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-800 uppercase tracking-widest ml-1">About Narrative (Statement)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-800" size={16} />
              <textarea 
                rows={5} 
                value={settingsData.statement} 
                onChange={(e) => setSettingsData({...settingsData, statement: e.target.value})} 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none text-[13px] font-medium focus:bg-white focus:border-rose-500 resize-none" 
                placeholder="Write your professional statement here..." 
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-50">
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Social Media & Links</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="GitHub URL" 
                  value={settingsData.github || ''} 
                  onChange={(e) => setSettingsData({...settingsData, github: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="LinkedIn URL" 
                  value={settingsData.linkedin || ''} 
                  onChange={(e) => setSettingsData({...settingsData, linkedin: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="Facebook URL" 
                  value={settingsData.facebook || ''} 
                  onChange={(e) => setSettingsData({...settingsData, facebook: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="Instagram URL" 
                  value={settingsData.instagram || ''} 
                  onChange={(e) => setSettingsData({...settingsData, instagram: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="Website URL" 
                  value={settingsData.website || ''} 
                  onChange={(e) => setSettingsData({...settingsData, website: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                <input 
                  placeholder="CV PDF Path" 
                  value={settingsData.cvPath || ''} 
                  onChange={(e) => setSettingsData({...settingsData, cvPath: e.target.value})} 
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded text-[12px] outline-none focus:border-rose-500" 
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading} 
            className="w-full py-4 bg-rose-600 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-700 transition-all mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Information</>}
          </button>
        </form>
      </section>
    </div>
  );
};

export default SettingsManager;