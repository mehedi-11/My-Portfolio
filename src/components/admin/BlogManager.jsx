import { useState, useEffect } from 'react';
import AdminLoader from './AdminLoader';
import { blogAPI } from '../../api';
import { Plus, Pencil, Trash2, Save, Loader2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    title: '', slug: '', shortDescription: '', details: '', tags: '', image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => { fetchBlogs(); }, []);

  async function fetchBlogs() {
    try {
      const { data } = await blogAPI.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('slug', formData.slug);
    submitData.append('shortDescription', formData.shortDescription);
    submitData.append('details', formData.details);

    const tagsArray = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(s => s.trim()).filter(s => s)
      : formData.tags;
    submitData.append('tags', JSON.stringify(tagsArray));

    if (formData.image) {
      submitData.append('image', formData.image);
    } else if (!editingId) {
      setLoading(false);
      setMessage({ text: 'Cover image is required for new blog', type: 'error' });
      return;
    }

    try {
      if (editingId) {
        await blogAPI.updateBlog(editingId, submitData);
        setMessage({ text: 'Blog updated successfully!', type: 'success' });
      } else {
        await blogAPI.addBlog(submitData);
        setMessage({ text: 'Blog added successfully!', type: 'success' });
      }
      fetchBlogs();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || 'Failed to save blog.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  }

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      details: blog.details,
      tags: blog.tags ? blog.tags.join(', ') : '',
      image: null
    });
    setPreviewImage(`${API_URL}/uploads/blogs/${blog.image}`);
    setEditingId(blog._id);
    setShowModal(true);
  };

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogAPI.deleteBlog(id);
        fetchBlogs();
        setMessage({ text: 'Blog deleted.', type: 'success' });
      } catch (err) {
        console.error(err);
        setMessage({ text: 'Delete failed.', type: 'error' });
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  }

  const resetForm = () => {
    setFormData({ title: '', slug: '', shortDescription: '', details: '', tags: '', image: null });
    setPreviewImage(null);
    setEditingId(null);
  };

  if (loading && blogs.length === 0) return <AdminLoader label="Loading blogs" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-black text-slate-900">Manage Blogs</h3>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">Showing {blogs.length} articles</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-slate-900 text-white px-4 py-2.5 rounded font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all"
        >
          <Plus size={16} /> Add Blog
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded text-[11px] font-bold border ${
          message.type === 'success' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Cover</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Blog Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                      {blog.image
                        ? <img src={`${API_URL}/uploads/blogs/${blog.image}`} alt={blog.title} className="w-full h-full object-cover" />
                        : <ImageIcon size={20} className="text-slate-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-slate-900 block">{blog.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-tight line-clamp-1">{blog.shortDescription}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(blog)} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-3xl bg-white rounded border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] m-4"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText size={17} /> {editingId ? 'Edit Blog' : 'Add Blog'}
                </h4>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Blog Title</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const newSlug = editingId
                          ? formData.slug
                          : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setFormData({ ...formData, title: e.target.value, slug: newSlug });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 transition-all text-[13px] font-medium"
                      placeholder="Enter title..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">URL Slug</label>
                    <input
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 transition-all text-[13px] font-medium"
                      placeholder="url-slug"
                    />
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 transition-all text-[13px] font-medium h-20 resize-none"
                    placeholder="Summary of the blog..."
                  />
                </div>

                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Cover Image (any format, auto-converted)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded text-[13px] file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer"
                    />
                    {previewImage && (
                      <div className="w-14 h-14 rounded border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                  <input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-rose-500 transition-all text-[13px] font-medium"
                    placeholder="React, Frontend, Web Dev"
                  />
                </div>

                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Full Content (Rich Text)</label>
                  <div className="border border-slate-100 rounded overflow-hidden" style={{ minHeight: '280px' }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.details}
                      onChange={(val) => setFormData({ ...formData, details: val })}
                      style={{ height: '240px' }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-16">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-slate-900 text-white rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> {editingId ? 'Update Blog' : 'Publish Blog'}</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;
