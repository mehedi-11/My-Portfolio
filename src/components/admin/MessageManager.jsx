import { useState, useEffect } from 'react';
import { messageAPI, notifyAPI } from '../../api';
import { Trash2, Loader2, MessageSquare, Mail, Calendar, CheckCircle } from 'lucide-react';

const MessageManager = ({ fetchNotifications }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await messageAPI.getContacts();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await notifyAPI.markRead('messages');
      if (fetchNotifications) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await messageAPI.deleteContact(id);
        fetchMessages();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading && messages.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Contact Inquiries</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{messages.length} Messages total</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest">
           <CheckCircle size={14} /> All Read
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-900">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Mail size={10} /> {msg.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{msg.subject}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{msg.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(msg._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"><Trash2 size={16} /></button>
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

export default MessageManager;
