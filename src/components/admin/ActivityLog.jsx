import { useState, useEffect } from 'react';
import { settingsAPI } from '../../api';
import { Clock, Shield, Database, LogIn, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await settingsAPI.getActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to delete ALL activity logs? This cannot be undone.')) {
      setClearing(true);
      try {
        await settingsAPI.clearActivityLogs();
        setLogs([]);
      } catch (err) {
        console.error('Failed to clear logs:', err);
      } finally {
        setClearing(false);
      }
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Auth': return <LogIn className="text-sky-500" size={16} />;
      case 'Security': return <Shield className="text-red-500" size={16} />;
      case 'CRUD': return <Database className="text-emerald-500" size={16} />;
      default: return <Clock className="text-slate-400" size={16} />;
    }
  };

  if (loading && logs.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">System Activity Log</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time tracking of admin actions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={logs.length === 0 || clearing}
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Clear All
          </button>
          <button 
            onClick={fetchLogs}
            className="p-2 text-slate-400 hover:text-sky-600 transition-all bg-white border border-slate-100 rounded shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-20 text-center">
              <Clock className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-sm font-bold text-slate-400">No activity logs found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log, i) => (
                  <motion.tr 
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center">
                          {getIcon(log.category)}
                        </div>
                        <span className="text-[12px] font-bold text-slate-900">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] text-slate-500 font-medium">{log.details}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{log.ip}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-slate-900">{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
