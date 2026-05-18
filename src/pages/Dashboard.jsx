import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Briefcase, GraduationCap, Layers, MessageSquare,
  UserPlus, LogOut, Settings, ChevronRight, Bell, X, ShieldCheck,
  Code, Mail, UserCheck, AlertCircle, FileText
} from 'lucide-react';
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
import BlogManager from '../components/admin/BlogManager';
import { notifyAPI } from '../api';
import { List } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState({ total: 0, messages: 0, proposals: 0, security: 0 });
  const [markingRead, setMarkingRead] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notifyAPI.getCounts();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    setMarkingRead(true);
    try {
      await Promise.all([
        notifyAPI.markRead('messages'),
        notifyAPI.markRead('proposals'),
        notifyAPI.markRead('security'),
      ]);
      await fetchNotifications();
      setIsNotifyOpen(false);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    } finally {
      setMarkingRead(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
  };

  const tabs = [
    { id: 'overview',   label: 'Dashboard',   icon: LayoutDashboard, component: Overview },
    { id: 'projects',   label: 'Projects',    icon: Layers,          component: ProjectManager },
    { id: 'blogs',      label: 'Blogs',       icon: FileText,        component: BlogManager },
    { id: 'education',  label: 'Education',   icon: GraduationCap,   component: EducationManager },
    { id: 'experience', label: 'Experience',  icon: Briefcase,       component: ExperienceManager },
    { id: 'skills',     label: 'Skills',      icon: Code,            component: SkillManager },
    { id: 'messages',   label: 'Contact Msg', icon: MessageSquare,   component: MessageManager,   badge: notifications.messages },
    { id: 'proposals',  label: 'Hire Msg',    icon: UserPlus,        component: ProposalManager,  badge: notifications.proposals },
    { id: 'activity',   label: 'Activity Log',icon: List,            component: ActivityLog },
    { id: 'settings',   label: 'Settings',    icon: Settings,        component: SettingsManager },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Overview;

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-100 z-[101] flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 flex flex-col h-full">

          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xs">M</div>
              <span className="text-base font-black text-slate-900 tracking-tighter">Admin<span className="text-rose-600">Panel.</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900">
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="space-y-0.5 flex-1 overflow-y-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[18px] h-[18px] px-1 bg-rose-600 text-[9px] text-white flex items-center justify-center rounded-full">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
                {activeTab === tab.id && <ChevronRight size={13} className="ml-auto opacity-40" />}
              </button>
            ))}
          </nav>

          {/* Sign out */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 flex flex-col max-h-screen">

        {/* Topbar */}
        <header className="h-[60px] bg-white border-b border-slate-100 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 rounded"
            >
              <LayoutDashboard size={16} />
            </button>
            <h2 className="text-sm font-black text-slate-900 tracking-tight capitalize">{activeTab}</h2>
            {activeTab === 'overview' && (
              <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
            )}
          </div>

          {/* Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifyOpen(v => !v)}
              className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isNotifyOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:text-rose-600'
              }`}
            >
              <Bell size={17} />
              {notifications.total > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotifyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifyOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    {/* Notify header */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Notifications</span>
                      {notifications.total > 0 && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{notifications.total} new</span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.total === 0 ? (
                        <div className="py-10 flex flex-col items-center gap-2 text-center">
                          <ShieldCheck size={28} className="text-slate-300" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">All clear</p>
                        </div>
                      ) : (
                        <>
                          {notifications.messages > 0 && (
                            <button
                              onClick={() => { setActiveTab('messages'); setIsNotifyOpen(false); }}
                              className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-all text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                                <Mail size={15} />
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-slate-900">Contact Messages</p>
                                <p className="text-[11px] text-slate-500">{notifications.messages} unread {notifications.messages === 1 ? 'message' : 'messages'}</p>
                              </div>
                            </button>
                          )}
                          {notifications.proposals > 0 && (
                            <button
                              onClick={() => { setActiveTab('proposals'); setIsNotifyOpen(false); }}
                              className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-all text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                                <UserCheck size={15} />
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-slate-900">Job Proposals</p>
                                <p className="text-[11px] text-slate-500">{notifications.proposals} unread {notifications.proposals === 1 ? 'proposal' : 'proposals'}</p>
                              </div>
                            </button>
                          )}
                          {notifications.security > 0 && (
                            <button
                              onClick={() => { setActiveTab('activity'); setIsNotifyOpen(false); }}
                              className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-red-50 transition-all text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                                <AlertCircle size={15} />
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-red-600">Security Alert</p>
                                <p className="text-[11px] text-slate-500">{notifications.security} failed login {notifications.security === 1 ? 'attempt' : 'attempts'}</p>
                              </div>
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer action */}
                    {notifications.total > 0 && (
                      <div className="px-5 py-3 border-t border-slate-100">
                        <button
                          onClick={handleMarkAllRead}
                          disabled={markingRead}
                          className="w-full py-2 text-[10px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-50 rounded transition-all disabled:opacity-50"
                        >
                          {markingRead ? 'Marking...' : 'Mark all as read'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
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