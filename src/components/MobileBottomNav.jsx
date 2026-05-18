import { useState, useEffect } from 'react';
import { Home, User, FolderGit2, Cpu, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home',     label: 'Home',     icon: Home,       href: '#' },
    { id: 'about',    label: 'About',    icon: User,       href: '#about' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, href: '#projects' },
    { id: 'skills',   label: 'Skills',   icon: Cpu,        href: '#skills' },
    { id: 'contact',  label: 'Contact',  icon: Mail,       href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      let current = 'home';

      // Check if we are near top
      if (window.scrollY < 200) {
        setActiveSection('home');
        return;
      }

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is in the top half of the screen
          if (rect.top <= window.innerHeight / 2) {
            current = sectionId === 'experience' ? 'about' : sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href, id) => {
    e.preventDefault();
    setActiveSection(id);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-4 right-4 z-[99] lg:hidden">
      <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-between items-center max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item.href, item.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative rounded-xl transition-all"
            >
              {/* Highlight background capsule */}
              {isActive && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-sky-500/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon & Glow */}
              <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-sky-400' : 'text-slate-400 hover:text-white'}`}>
                <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
                {isActive && (
                  <span className="absolute -inset-1 bg-sky-400/20 blur-sm rounded-full -z-10" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[9px] font-black uppercase tracking-wider mt-1 relative z-10 transition-colors duration-300 ${
                isActive ? 'text-sky-400 font-extrabold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
