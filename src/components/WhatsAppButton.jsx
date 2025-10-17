import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const WhatsAppButton = () => {
  const { language } = useApp();
  const phoneNumber = '1234567890'; // Replace with actual WhatsApp number
  const message = language === 'ar' 
    ? 'مرحباً! أنا مهتم بسياراتكم الفاخرة.'
    : 'Hello! I am interested in your luxury vehicles.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tooltipText = language === 'ar' ? 'تواصل معنا على واتساب' : 'Chat with us on WhatsApp';

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] p-4 rounded-full shadow-2xl glow-gold flex items-center justify-center group transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      aria-label={tooltipText}
      title={tooltipText}
    >
      <MessageCircle className="w-6 h-6 transition-transform duration-500 ease-in-out group-hover:scale-110" />
      <motion.span
        className="absolute right-full mr-3 bg-[#1B263B] border border-[#E6C200]/30 text-[#D9E1E8] px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none glow-gold"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        {tooltipText}
      </motion.span>
    </motion.button>
  );
};

export default WhatsAppButton;

