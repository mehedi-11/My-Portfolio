import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ArrowUpRight, Briefcase, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import HireModal from './HireModal';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { personalInfo } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
  ];

  return (
    <>
      {/* Main Horizontal Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500",
        isScrolled ? "bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 py-2.5 shadow-sm" : "bg-transparent py-5"
      )}>
        <div className="container-custom flex justify-between items-center">
          {/* Logo (Left Side) */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center text-white font-black text-lg group-hover:bg-sky-600 transition-colors">
              M
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter hidden lg:block">
              Mehedi <span className="text-sky-600">Hasan.</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="px-4 py-2 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-sky-600 transition-all group-hover:w-1/2" />
              </a>
            ))}
            
            <button 
              onClick={toggleTheme}
              className="ml-2 p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center border border-slate-100 dark:border-slate-800"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button 
              onClick={() => setIsHireModalOpen(true)}
              className="ml-4 px-6 py-2.5 bg-slate-900 dark:bg-sky-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center gap-2"
            >
              Hire Me <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Mobile Actions (Right Side) */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-100 dark:border-slate-800"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={() => setIsHireModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-slate-900 dark:bg-sky-600 text-white rounded-xl shadow-lg"
              title="Hire Me"
            >
              <Briefcase size={20} />
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Navigation (Independent from Main Nav) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Side Nav Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            >
              <div className="p-8 flex flex-col h-full bg-white dark:bg-slate-950 relative z-10">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">MH.</span>
                  <button 
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link, index) => (
                    <a 
                      key={link.name} 
                      href={link.href} 
                      className="py-3.5 px-4 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all uppercase tracking-widest flex items-center justify-between group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{link.name}</span>
                      <span className="text-slate-100 dark:text-slate-800 group-hover:text-sky-100 transition-colors">0{index + 1}</span>
                    </a>
                  ))}
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsHireModalOpen(true);
                    }}
                    className="mt-4 py-3.5 px-4 text-[11px] font-black text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-xl transition-all uppercase tracking-widest text-left flex items-center justify-between group"
                  >
                    <span>Hire Me</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Connect</p>
                  <div className="flex gap-4 mb-8">
                    <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={18} /></a>
                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <a href={`mailto:${personalInfo.email}`} className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Mail size={18} /></a>
                  </div>
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">© 2026 Portfolio</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </>
  );
};

export default Navbar;
