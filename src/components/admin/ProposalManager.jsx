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
              </div>

              <div className="flex-1 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-50 md:pl-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Responsibilities</p>
                <div className="bg-slate-50 p-6 rounded">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{proposal.responsibilities}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalManager;
