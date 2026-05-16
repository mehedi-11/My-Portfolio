import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Briefcase, MessageSquare, UserPlus, TrendingUp, Clock, ArrowUpRight, Settings } from 'lucide-react';
import { portfolioAPI, messageAPI } from '../../api';

const Overview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    messages: 0,
    proposals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, experience, messages, proposals] = await Promise.all([
          portfolioAPI.getProjects(),
          portfolioAPI.getExperience(),
          messageAPI.getContacts(),
          messageAPI.getProposals()
        ]);
        
        setStats({
          projects: projects.data.length,
          experience: experience.data.length,
          messages: messages.data.length,
          proposals: proposals.data.length
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Projects', value: stats.projects, icon: Layers, color: 'text-sky-600', bg: 'bg-sky-50' },
    { title: 'Work Experience', value: stats.experience, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'New Inquiries', value: stats.messages, icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Job Proposals', value: stats.proposals, icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-100" />)}
    </div>
  </div>;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-10 text-white">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Welcome back, Mehedi!</h2>
          <p className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed">
            Your portfolio is performing well. You have {stats.messages} inquiries waiting.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp size={120} />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <card.icon size={20} />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
            <h4 className="text-xl font-black text-slate-900">{card.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-sm font-black text-slate-900">System Status</h3>
               <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /> Live
               </span>
            </div>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sky-600 shadow-sm"><Clock size={14} /></div>
                    <p className="text-[11px] font-bold text-slate-700">Database Connection</p>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">Stable</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sky-600 shadow-sm"><Layers size={14} /></div>
                    <p className="text-[11px] font-bold text-slate-700">API Latency</p>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">24ms</span>
               </div>
            </div>
         </div>

         <div className="bg-sky-600 p-6 rounded-3xl text-white flex flex-col justify-between group cursor-pointer overflow-hidden relative min-h-[160px]">
            <div className="relative z-10">
              <h3 className="text-base font-black mb-1 tracking-tight">Need Help?</h3>
              <p className="text-sky-100 text-[11px] font-medium leading-tight">View documentation guide.</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest relative z-10">
               View Guide <ArrowUpRight size={12} />
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-110 transition-transform">
               <Settings size={100} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Overview;
