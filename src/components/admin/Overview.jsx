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
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Welcome back, Mehedi!</h2>
          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">
            Your portfolio is currently performing well. You have {stats.messages} unread inquiries waiting for your response.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <TrendingUp size={200} />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
          >
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <card.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
            <h4 className="text-3xl font-black text-slate-900">{card.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900">System Status</h3>
               <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Live & Healthy
               </span>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm"><Clock size={18} /></div>
                    <p className="text-xs font-bold text-slate-700">Database Connection</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Stable</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm"><Layers size={18} /></div>
                    <p className="text-xs font-bold text-slate-700">API Latency</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">24ms</span>
               </div>
            </div>
         </div>

         <div className="bg-sky-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-between group cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2 tracking-tight">Need Help?</h3>
              <p className="text-sky-100 text-xs font-medium leading-relaxed">Check the documentation for advanced configuration.</p>
            </div>
            <div className="mt-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest relative z-10">
               View Guide <ArrowUpRight size={16} />
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform">
               <Settings size={180} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Overview;
