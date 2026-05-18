import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Blogs = () => {
  const { blogs, loading } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  ) || [];

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      <div className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="container-custom">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-sky-600 transition-all font-bold text-xs uppercase tracking-widest mb-8 group w-max">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            All <span className="text-sky-600">Blogs.</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Thoughts, insights, and tutorials about web development and technology.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="relative w-full md:max-w-md mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-sky-500 transition-all text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <motion.div 
                key={blog._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-sky-200 transition-all hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full shadow-sm group"
              >
                <Link to={`/blog/${blog.slug}`} className="block relative h-56 rounded-3xl overflow-hidden bg-slate-100 mb-6">
                  <img 
                    src={`${API_URL}/uploads/blogs/${blog.image}`} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>

                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors tracking-tight line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                  {blog.shortDescription}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {blog.tags && blog.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1 rounded border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-32">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No blogs found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
