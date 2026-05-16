import { useState, useEffect } from 'react';
import { messageAPI, notifyAPI } from '../../api';
import { Trash2, Loader2, UserPlus, Building2, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const ProposalManager = ({ fetchNotifications }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
    markAsRead();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data } = await messageAPI.getProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await notifyAPI.markRead('proposals');
      if (fetchNotifications) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await messageAPI.deleteProposal(id);
        fetchProposals();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading && proposals.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Job Proposals</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{proposals.length} Proposals found</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest">
           <CheckCircle size={14} /> Synced
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget/Salary</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {proposals.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-900">{item.company}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.responsibilities}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{item.salary}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProposalManager;
