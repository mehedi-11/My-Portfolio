import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BlogPreview = () => {
  const { blogs } = usePortfolio();

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blogs" className="section-padding bg-slate-50 dark:bg-slate-900">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-[1px] bg-sky-600"></span>
              <span className="text-sky-600 font-bold tracking-[0.2em] uppercase text-[11px]">Insights & Articles</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Latest <span className="text-sky-600">Blogs.</span>
            </h2>
          </div>
          <Link 
            to="/blogs" 
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-600 transition-colors group"
          >
            View All Blogs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-950 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <Link to={`/blog/${blog.slug}`} className="block relative pt-6 px-6">
                <div className="flex gap-2">
                  {blog.tags && blog.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                  {blog.shortDescription}
                </p>
                <div className="mt-auto">
                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-widest hover:text-sky-700 transition-colors"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
