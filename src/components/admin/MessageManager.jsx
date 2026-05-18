import { useState, useEffect } from 'react';
import AdminLoader from './AdminLoader';
import { messageAPI, notifyAPI } from '../../api';
import { Trash2, Mail, Calendar, CheckCircle, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageManager = ({ fetchNotifications }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
    markAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMessages() {
    try {
      const { data } = await messageAPI.getContacts();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead() {
    try {
      await notifyAPI.markRead('messages');
      if (fetchNotifications) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messageAPI.deleteContact(id);
        fetchMessages();
        if (selectedMessage && selectedMessage._id === id) {
          setShowModal(false);
          setSelectedMessage(null);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      }
    }
  }

  const handleOpenModal = (msg) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  if (loading && messages.length === 0) return <AdminLoader label="Loading messages" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Contact Inquiries</h3>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">
            {messages.length} Messages total
          </p>
        </div>
        <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest">
          <CheckCircle size={14} /> All Read
        </div>
      </div>

      <div className="bg-white rounded border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Sender</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-900">{msg.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail size={10} /> {msg.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">
                        {msg.subject}
                      </span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{msg.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(msg)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-all"
                        title="Delete Message"
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

      {/* View Message Modal */}
      <AnimatePresence>
        {showModal && selectedMessage && (
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
                <h4 className="text-base font-black text-slate-900">Message Details</h4>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sender Name</span>
                    <span className="text-[13px] font-bold text-slate-900">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-[13px] font-bold text-rose-600 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subject</span>
                    <span className="text-[13px] font-bold text-slate-900">{selectedMessage.subject || 'No Subject'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Received Date</span>
                    <span className="text-[13px] font-bold text-slate-900">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Message Content</span>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`}
                    className="flex-1 py-3.5 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all text-center"
                  >
                    Reply via Email
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage._id)}
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

export default MessageManager;