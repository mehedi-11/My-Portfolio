// Shared unique loader for admin panel
const AdminLoader = ({ label = 'Loading data' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="block w-1.5 rounded-full bg-slate-900 animate-bounce"
          style={{
            height: `${12 + i * 4}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
      {[3, 2, 1, 0].map((i) => (
        <span
          key={`r${i}`}
          className="block w-1.5 rounded-full bg-rose-500 animate-bounce"
          style={{
            height: `${12 + i * 4}px`,
            animationDelay: `${(5 + (3 - i)) * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}…</p>
  </div>
);

export default AdminLoader;
