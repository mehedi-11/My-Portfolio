import { MessageCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const WhatsAppChat = () => {
  const { personalInfo } = usePortfolio();

  if (!personalInfo?.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${personalInfo.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300"
      title="Chat with me on WhatsApp"
    >
      <MessageCircle size={28} />
      {/* Ping animation */}
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
};

export default WhatsAppChat;
