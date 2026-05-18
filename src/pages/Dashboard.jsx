import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, GraduationCap, Layers, MessageSquare, UserPlus, LogOut, Settings, ChevronRight, Bell, X, ShieldCheck, Code, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectManager from '../components/admin/ProjectManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import EducationManager from '../components/admin/EducationManager';
import MessageManager from '../components/admin/MessageManager';
import ProposalManager from '../components/admin/ProposalManager';
import SettingsManager from '../components/admin/SettingsManager';
import SkillManager from '../components/admin/SkillManager';
import ActivityLog from '../components/admin/ActivityLog';
import Overview from '../components/admin/Overview';
import { notifyAPI } from '../api';
import { ClipboardList } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminName] = useState(localStorage.getItem('adminUser') || 'Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState({ total: 0, messages: 0, proposals: 0, security: 0 });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const { data } = await notifyAPI.getCounts();
      setNotifications(data);
    } catch (err) { console.error(err, "Failed to fetch notifications");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, component: Overview },
    { id: 'education', label: 'Education', icon: GraduationCap, component: EducationManager },
    { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceManager },
    { id: 'projects', label: 'Projects', icon: Layers, component: ProjectManager },
    { id: 'skills', label: 'Skills', icon: Code, component: SkillManager },
    { id: 'messages', label: 'Contact Msg', icon: MessageSquare, component: MessageManager, badge: notifications.messages },
    { id: 'proposals', label: 'Hire Msg', icon: UserPlus, component: ProposalManager, badge: notifications.proposals },
    { id: 'activity', label: 'Activity Log', icon: ClipboardList, component: ActivityLog },
    { id: 'settings', label: 'Settings', icon: Settings, component: SettingsManager },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Overview;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-[101] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="text-lg font-black text-slate-900 tracking-tighter">Admin<span className="text-sky-600">Panel.</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
               <X size={20} />
            </button>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[13px] font-bold transition-all relative ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-sky-600 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-[13px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col max-h-screen">
        {/* Header */}
        <header className="py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 md:px-8 flex items-center justify-between min-h-[80px]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded">
               <LayoutDashboard size={18} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tighter capitalize">{activeTab}</h2>
              {activeTab === 'overview' && (
                 <span className="text-[9px] font-black bg-emerald-50 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Live System</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className={`w-10 h-10 rounded flex items-center justify-center transition-all ${isNotifyOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-sky-600'}`}
              >
                <Bell size={20} />
                {notifications.total > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>
              
              <AnimatePresence>
                {isNotifyOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifyOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Notification Center</h4>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">{notifications.total} New</span>
                      </div>

                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.total === 0 ? (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                               <ShieldCheck size={24} className="text-slate-300" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">System is clear</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {notifications.messages > 0 && (
                              <button onClick={() => { setActiveTab('messages'); setIsNotifyOpen(false); }} className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 transition-all text-left group">
                                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                  <Mail size={18} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-slate-900">New Contact Messages</p>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">You have {notifications.messages} unread inquiries.</p>
                                </div>
                              </button>
                            )}
                            {notifications.proposals > 0 && (
                              <button onClick={() => { setActiveTab('proposals'); setIsNotifyOpen(false); }} className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 transition-all text-left group">
                                <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                  <UserCheck size={18} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-slate-900">New Job Proposals</p>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{notifications.proposals} potential clients reached out.</p>
                                </div>
                              </button>
                            )}
                            {notifications.security > 0 && (
                              <div className="w-full p-4 flex items-start gap-4 bg-red-50/30 hover:bg-red-50 transition-all text-left group">
                                <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <AlertCircle size={18} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-red-600">Security Alerts</p>
                                  <p className="text-[11px] text-red-500/80 font-medium mt-0.5">{notifications.security} failed login attempts detected.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {notifications.total > 0 && (
                         <div className="p-3 bg-slate-50 border-t border-slate-100">
                            <button className="w-full py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-sky-600 transition-all">
                               Mark all as seen
                            </button>
                         </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
               <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-black text-slate-900 leading-none">{adminName}</p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Super Admin</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-black text-sm shadow-sm border border-sky-200">
                 {adminName[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent fetchNotifications={fetchNotifications} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
