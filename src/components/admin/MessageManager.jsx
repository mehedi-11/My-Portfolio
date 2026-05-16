import { useState, useEffect } from 'react';
import { Trash2, Mail, User, Calendar, Loader2, MessageSquare } from 'lucide-react';
import { messageAPI } from '../../api';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      await messageAPI.deleteContact(id);
      fetchMessages();
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sky-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900">Incoming Inquiries</h3>
        <span className="px-4 py-1.5 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full">{messages.length} Total</span>
      </div>

      <div className="grid gap-6">
        {messages.length === 0 && (
          <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center text-slate-300 mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No messages found</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
            <button 
              onClick={() => handleDelete(msg._id)}
              className="absolute top-8 right-8 w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded flex items-center justify-center text-slate-400"><User size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                    <h4 className="text-sm font-black text-slate-900">{msg.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                  <div>
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
