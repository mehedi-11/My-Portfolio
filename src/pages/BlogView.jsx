import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { blogAPI } from '../api';
import 'react-quill/dist/quill.snow.css'; // For basic styling of quill output

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BlogView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data } = await blogAPI.getBlog(slug);
        setBlog(data);
      } catch (err) {
        console.error(err);
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <div className="bg-slate-50 pt-32 pb-20 border-b border-slate-100">
        <div className="container-custom max-w-4xl">
          <Link to="/blogs" className="flex items-center gap-2 text-slate-400 hover:text-sky-600 transition-all font-bold text-xs uppercase tracking-widest mb-8 group w-max">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
          </Link>

          <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {blog.tags && blog.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1.5 rounded">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container-custom max-w-5xl -mt-10 mb-16 relative z-10">
        <div className="w-full aspect-[2/1] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white">
          <img 
            src={`${API_URL}/uploads/blogs/${blog.image}`} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom max-w-3xl">
        <div className="text-lg text-slate-500 font-medium leading-relaxed mb-12 pb-12 border-b border-slate-100">
          {blog.shortDescription}
        </div>

        {/* Render Rich Text */}
        <div 
          className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-a:text-sky-600 hover:prose-a:text-sky-700 ql-editor px-0"
          dangerouslySetInnerHTML={{ __html: blog.details }} 
        />
      </div>
    </div>
  );
};

export default BlogView;
