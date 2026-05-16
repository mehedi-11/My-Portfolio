import { usePortfolio } from '../context/PortfolioContext';

const Footer = () => {
  const { personalInfo } = usePortfolio();
  return (
    <footer className="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 text-[10vw] font-black text-white/5 select-none -z-0 leading-none pointer-events-none uppercase">
        Hasan.
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center gap-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-2xl shadow-sky-600/20">
            M
          </div>
          <h2 className="text-3xl font-black tracking-tighter">Mehedi Hasan</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{personalInfo.title}</p>
        </div>

        <div className="w-full h-[1px] bg-white/10" />

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            © {new Date().getFullYear()} Mehedi Hasan. All rights reserved.
          </p>
          
          <div className="flex items-center gap-10">
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">Cookies</a>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">Crafted with</span>
            <span className="text-sky-500">◆</span>
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">By Mehedi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
