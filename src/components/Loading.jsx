import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const Loading = () => {
  const isArabic = typeof document !== 'undefined' && document.documentElement.getAttribute('lang') === 'ar';

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1B2A]" role="status" aria-live="polite" aria-label={isArabic ? 'جاري التحميل' : 'Loading'}>
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block bg-gradient-to-br from-[#E6C200] to-[#FFD700] p-6 rounded-2xl mb-4 shadow-2xl glow-gold"
        >
          <Car className="w-12 h-12 text-[#0D1B2A]" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#E6C200] font-medium text-lg"
        >
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;

