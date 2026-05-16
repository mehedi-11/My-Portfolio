import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  MessageSquare, 
  UserPlus, 
  LogOut,
  Settings,
  ChevronRight,
  Bell
} from 'lucide-react';
import ProjectManager from '../components/admin/ProjectManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import EducationManager from '../components/admin/EducationManager';
import MessageManager from '../components/admin/MessageManager';
import ProposalManager from '../components/admin/ProposalManager';
import ProfileManager from '../components/admin/ProfileManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setAdminName(localStorage.getItem('adminUser') || 'Admin');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Layers, component: ProjectManager },
    { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceManager },
    { id: 'education', label: 'Education', icon: GraduationCap, component: EducationManager },
    { id: 'messages', label: 'Inquiries', icon: MessageSquare, component: MessageManager },
    { id: 'proposals', label: 'Proposals', icon: UserPlus, component: ProposalManager },
    { id: 'profile', label: 'Settings', icon: Settings, component: ProfileManager },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProjectManager;

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
        fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-100 z-[101] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">M</div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">Admin<span className="text-sky-600">Panel.</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
               <X size={24} />
            </button>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="pt-10 border-t border-slate-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col max-h-screen">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl">
               <LayoutDashboard size={20} />
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter capitalize">{activeTab}</h2>
              <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Portfolio Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-600 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-sky-600 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{adminName}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Super Admin</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-black text-lg">
                 {adminName[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
