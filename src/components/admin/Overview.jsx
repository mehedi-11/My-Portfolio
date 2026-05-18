import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, MessageSquare, UserPlus, TrendingUp, Clock, ArrowUpRight,
  Plus, FileText, Zap, Calendar, ArrowRight, Activity, HardDrive
} from 'lucide-react';
import { portfolioAPI, messageAPI, blogAPI } from '../../api';

const Overview = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    messages: 0,
    proposals: 0,
    skills: 0,
    blogs: 0
  });
  
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Ticking Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projects, experience, messages, proposals, skills, blogs] = await Promise.all([
          portfolioAPI.getProjects(),
          portfolioAPI.getExperience(),
          messageAPI.getContacts(),
          messageAPI.getProposals(),
          portfolioAPI.getSkills(),
          blogAPI.getBlogs()
        ]);

        setStats({
          projects: projects.data.length,
          experience: experience.data.length,
          messages: messages.data.length,
          proposals: proposals.data.length,
          skills: skills.data.length,
          blogs: blogs.data.length
        });

        // Get top 2 latest messages & proposals
        const sortedMsgs = [...messages.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        const sortedProps = [...proposals.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);

        setRecentMessages(sortedMsgs);
        setRecentProposals(sortedProps);

      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Time-based custom greeting
  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return 'Good Morning, Mehedi! ☀️';
    if (hrs < 18) return 'Good Afternoon, Mehedi! 🌤️';
    return 'Good Evening, Mehedi! 🌙';
  };

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: Layers, tab: 'projects', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Technical Skills', value: stats.skills, icon: Zap, tab: 'skills', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Blog Articles', value: stats.blogs, icon: FileText, tab: 'blogs', color: 'text-slate-800', bg: 'bg-slate-50' },
    { title: 'New Inquiries', value: stats.messages, icon: MessageSquare, tab: 'messages', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Job Proposals', value: stats.proposals, icon: UserPlus, tab: 'proposals', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // System stats logic
  const totalAssets = stats.projects + stats.skills + stats.blogs;
  const projectPct = totalAssets ? Math.round((stats.projects / totalAssets) * 100) : 0;
  const skillPct = totalAssets ? Math.round((stats.skills / totalAssets) * 100) : 0;
  const blogPct = totalAssets ? Math.round((stats.blogs / totalAssets) * 100) : 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-40 bg-slate-50 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-slate-50 rounded-lg border border-slate-100" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-50 rounded-lg" />
          <div className="h-64 bg-slate-50 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── Top Header Panel ── */}
      <section className="relative overflow-hidden bg-slate-900 rounded-xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded">
            Live Portfolio Analytics
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-3 mb-2">
            {getGreeting()}
          </h2>
          <p className="text-slate-300 font-medium text-xs md:text-sm leading-relaxed">
            Your personal portfolio is humming along perfectly. You currently have <span className="text-rose-500 font-bold">{stats.messages} inquiries</span> and <span className="text-rose-500 font-bold">{stats.proposals} proposals</span> waiting in your queue.
          </p>
        </div>
        
        {/* Dynamic ticking time widget */}
        <div className="relative z-10 bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <Clock size={20} className="animate-spin-slow" />
          </div>
          <div>
            <p className="text-[14px] font-black text-white tracking-wider">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <Calendar size={10} /> {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <TrendingUp size={140} />
        </div>
      </section>

      {/* ── Main Quick Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setActiveTab && setActiveTab(card.tab)}
            className="bg-white p-5 rounded-lg border border-slate-100 group hover:border-rose-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className={`w-9 h-9 ${card.bg} ${card.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <card.icon size={18} />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.title}</p>
              <h4 className="text-2xl font-black text-slate-900">{card.value}</h4>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[9px] font-bold text-slate-400 group-hover:text-rose-600 transition-colors uppercase tracking-widest pt-2 border-t border-slate-50">
              Manage <ArrowRight size={10} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Live Inbox Feeds & System Health Center ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Live Inbox feeds */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Inquiries List */}
          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-rose-600" size={16} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Inquiries</h3>
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab('messages')}
                className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-wider"
              >
                View all
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded border border-dashed border-slate-150">
                <p className="text-xs text-slate-600 font-medium">No contact messages received yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMessages.map((msg) => (
                  <div key={msg._id} className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-slate-900">{msg.name}</span>
                        <span className="text-[9px] text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-medium">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 tracking-tight mb-0.5">{msg.subject}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{msg.message}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab && setActiveTab('messages')}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[10px] font-bold rounded border border-slate-100 uppercase tracking-wider shrink-0 transition-colors"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Proposals List */}
          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="text-amber-500" size={16} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Job Proposals</h3>
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab('proposals')}
                className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-wider"
              >
                View all
              </button>
            </div>

            {recentProposals.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded border border-dashed border-slate-150">
                <p className="text-xs text-slate-600 font-medium">No job offers or proposals yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentProposals.map((prop) => (
                  <div key={prop._id} className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-slate-900">{prop.company}</span>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-mono">
                          {prop.salary}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{prop.responsibilities}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab && setActiveTab('proposals')}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[10px] font-bold rounded border border-slate-100 uppercase tracking-wider shrink-0 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Quick Action + System stats / Distribution chart */}
        <div className="space-y-6">
          
          {/* Quick Actions Center */}
          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={15} className="text-rose-600" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab && setActiveTab('projects')}
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center transition-all group"
              >
                <Plus size={16} className="text-slate-600 group-hover:text-rose-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-wider">Add Project</span>
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('blogs')}
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center transition-all group"
              >
                <Plus size={16} className="text-slate-600 group-hover:text-rose-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-wider">Add Blog</span>
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('skills')}
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center transition-all group"
              >
                <Plus size={16} className="text-slate-600 group-hover:text-rose-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-wider">New Skill Box</span>
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center transition-all group"
              >
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-rose-600 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-wider">View Website</span>
              </a>
            </div>
          </div>

          {/* Interactive CSS Distribution Chart & Server status */}
          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HardDrive size={15} className="text-rose-600" /> Portfolio Distribution
            </h3>
            
            {/* Visual HTML Bar Charts */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-slate-700">Projects ({stats.projects})</span>
                  <span className="text-[11px] font-bold text-slate-600">{projectPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: `${projectPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-slate-700">Skill Categories ({stats.skills})</span>
                  <span className="text-[11px] font-bold text-slate-600">{skillPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: `${skillPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-slate-700">Blog Articles ({stats.blogs})</span>
                  <span className="text-[11px] font-bold text-slate-600">{blogPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: `${blogPct}%` }} />
                </div>
              </div>
            </div>

            {/* Performance status */}
            <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500">API Health Check</span>
                <span className="flex items-center gap-1 text-[9px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full">
                  <Zap size={10} /> Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500">Database Engine</span>
                <span className="text-[11px] font-black text-slate-900 uppercase">MongoDB</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Overview;