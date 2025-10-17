import { motion } from 'framer-motion';
import { Tag, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, isExpired } from '../utils/formatters';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const Coupons = () => {
  const { coupons, t, language } = useApp();
  const [copiedCode, setCopiedCode] = useState(null);

  const activeCoupons = coupons.filter(c => c.active && !isExpired(c.expiryDate));
  const expiredCoupons = coupons.filter(c => !c.active || isExpired(c.expiryDate));

  const copyToClipboard = async (code) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // Fallback for older browsers
        const ta = document.createElement('textarea')
        ta.value = code
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  };

  const CouponCard = ({ coupon, expired = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl shadow-lg border ${
        expired
          ? 'bg-[#111723]/50 opacity-60 border-[#8B9EB3]'
          : 'bg-[#111723] border-[#E6C200]/30'
      }`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E6C200]/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-tr-full" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              expired
                ? 'bg-[#8B9EB3]'
                : 'bg-gradient-to-br from-[#E6C200] to-[#FFD700] shadow-lg glow-gold'
            }`}>
              <Tag className="w-6 h-6 text-[#0D1B2A]" />
            </div>
            <div>
              <div className={`text-3xl font-bold ${
                expired
                  ? 'text-[#8B9EB3]'
                  : 'gradient-text'
              }`}>
                {coupon.discount}% OFF
              </div>
            </div>
          </div>

          {expired && (
            <div className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border border-red-700/50">
              <AlertCircle className="w-3 h-3" />
              <span>{t('expired') || 'Expired'}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <h3 className={`text-lg font-bold mb-4 ${
          expired ? 'text-gray-500' : 'text-[#F5F5F5]'
        }`}>
          {coupon.description}
        </h3>

        {/* Coupon Code */}
        <div className="bg-[#0D1B2A] rounded-xl p-4 mb-4 border-2 border-dashed border-[#E6C200]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8B9EB3] mb-1">{t('couponCode') || 'Coupon Code'}</p>
              <p className="text-xl font-mono font-bold text-[#E6C200]">
                {coupon.code}
              </p>
            </div>
            {!expired && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(coupon.code)}
                className="flex items-center space-x-2"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('copied') || 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t('copy') || 'Copy'}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {expired ? (t('expiredOn') || 'Expired on') : (t('validUntil') || 'Valid until')} {formatDate(coupon.expiryDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 bg-[#0D1B2A]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white py-20 border-b border-[#E6C200]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6 gradient-text">{t('specialOffersTitle') || 'Special Offers & Coupons'}</h1>
            <p className="text-xl text-[#D9E1E8] leading-relaxed">
              {t('specialOffersSub') || 'Take advantage of our exclusive discounts and save on your dream luxury vehicle. Limited time offers available!'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Active Coupons */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('activeOffers') || 'Active Offers'}</h2>
            <p className="text-[#F5F5F5] text-lg">
              {language === 'ar' ? `${activeCoupons.length} عروض متاحة الآن` : `${activeCoupons.length} exclusive ${activeCoupons.length === 1 ? 'deal' : 'deals'} available now`}
            </p>
          </motion.div>

          {activeCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {activeCoupons.map((coupon) => (
                <CouponCard key={`${coupon.id}-${coupon.code}`} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#F5F5F5]">{t('noActiveCoupons') || 'No active coupons at the moment. Check back soon!'}</p>
            </div>
          )}
        </div>

        {/* How to Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111723] border border-[#E6C200]/20 rounded-2xl p-8 shadow-lg mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold gradient-text mb-6 text-center">{t('howToUse') || 'How to Use Coupons'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: t('copyCode') || 'Copy Code',
                description: t('copyCodeDesc') || 'Click the copy button to save the coupon code'
              },
              {
                step: '2',
                title: t('selectVehicle') || 'Select Vehicle',
                description: t('selectVehicleDesc') || 'Browse our collection and choose your dream car'
              },
              {
                step: '3',
                title: t('applyAndSave') || 'Apply & Save',
                description: t('applyAndSaveDesc') || 'Enter the code at checkout to get your discount'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#E6C200] to-[#FFD700] text-[#0D1B2A] rounded-full text-xl font-bold mb-4 shadow-lg glow-gold">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#E6C200] mb-2">{item.title}</h3>
                <p className="text-[#8B9EB3] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expired Coupons */}
        {expiredCoupons.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-500 mb-4">{t('pastOffers') || 'Past Offers'}</h2>
              <p className="text-gray-500">{t('theseOffersExpired') || 'These offers have expired'}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {expiredCoupons.map((coupon) => (
                <CouponCard key={`${coupon.id}-${coupon.code}`} coupon={coupon} expired />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;

