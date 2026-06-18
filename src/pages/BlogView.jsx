import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { blogAPI } from '../api';
import 'react-quill-new/dist/quill.snow.css'; // For basic styling of quill output

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
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      <Helmet>
        <title>{blog.title} | Mehedi Hasan</title>
        <meta name="description" content={blog.shortDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.shortDescription} />
      </Helmet>
      {/* Header Section */}
      <div className="bg-slate-50 dark:bg-slate-900 pt-32 pb-20 border-b border-slate-100 dark:border-slate-800">
        <div className="container-custom max-w-4xl">
          <Link to="/blogs" className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all font-bold text-xs uppercase tracking-widest mb-8 group w-max">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
          </Link>

          <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {blog.tags && blog.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 px-3 py-1.5 rounded">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* Content Section */}
      <div className="container-custom max-w-3xl">
        <div className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 pb-12 border-b border-slate-100 dark:border-slate-800">
          {blog.shortDescription}
        </div>

        {/* Render Rich Text */}
        <div 
          className="text-slate-700 dark:text-slate-300 ql-editor px-0"
          dangerouslySetInnerHTML={{ __html: blog.details }} 
        />
      </div>
    </div>
  );
};

export default BlogView;
