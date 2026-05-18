import { useState, useEffect } from 'react';
import AdminLoader from './AdminLoader';
import { messageAPI, notifyAPI } from '../../api';
import { Trash2, Calendar, CheckCircle, Eye, X, Briefcase, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProposalManager = ({ fetchNotifications }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProposals();
    markAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProposals() {
    try {
      const { data } = await messageAPI.getProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead() {
    try {
      await notifyAPI.markRead('proposals');
      if (fetchNotifications) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      try {
        await messageAPI.deleteProposal(id);
        fetchProposals();
        if (selectedProposal && selectedProposal._id === id) {
          setShowModal(false);
          setSelectedProposal(null);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      }
    }
  }

  const handleOpenModal = (item) => {
    setSelectedProposal(item);
    setShowModal(true);
  };

  if (loading && proposals.length === 0) return <AdminLoader label="Loading proposals" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Job Proposals</h3>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">
            {proposals.length} Proposals found
          </p>
        </div>
        <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest">
          <CheckCircle size={14} /> Synced
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Budget/Salary</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
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
                    <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
                      {item.salary}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"
                        title="Delete Proposal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Proposal Modal */}
      <AnimatePresence>
        {showModal && selectedProposal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] m-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0 bg-white">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Briefcase size={16} className="text-rose-600" /> Proposal Details
                </h4>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-900 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Company Name</span>
                    <span className="text-[13px] font-bold text-slate-900">{selectedProposal.company}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                      <DollarSign size={10} className="text-rose-600" /> Budget / Offer
                    </span>
                    <span className="text-[13px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded inline-block">
                      {selectedProposal.salary}
                    </span>
                  </div>
                </div>

                <div className="border-b border-slate-50 pb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date Received</span>
                  <span className="text-[13px] font-bold text-slate-900">
                    {new Date(selectedProposal.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Role & Responsibilities
                  </span>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedProposal.responsibilities}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all text-center"
                  >
                    Close Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedProposal._id)}
                    className="px-6 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-black text-[11px] uppercase tracking-widest transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalManager;