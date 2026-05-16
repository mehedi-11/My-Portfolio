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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                    <a href={`mailto:${msg.email}`} className="text-sm font-bold text-sky-600 hover:underline">{msg.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded flex items-center justify-center text-slate-400"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Received</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-50 md:pl-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject: {msg.subject}</p>
                <div className="bg-slate-50 p-6 rounded">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageManager;
