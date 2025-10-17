import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Palette,
  Users,
  ArrowLeft,
  MessageCircle,
  Mail,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice, formatNumber } from '../utils/formatters';
import CarCard from '../components/CarCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, applyCoupon, t, language, trackCarView } = useApp();
  
  const car = cars.find((c) => c.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [finalPrice, setFinalPrice] = useState(car?.price || 0);

  // Track a view on mount when car exists
  useEffect(() => {
    if (car?.id) trackCarView(car.id)
  }, [car?.id])

  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0D1B2A]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#E6C200] mb-4">Car not found</h2>
          <Link to="/cars">
            <Button>Back to Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedCars = cars
    .filter((c) => c.brand === car.brand && c.id !== car.id)
    .slice(0, 3);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponResult({ success: false, message: 'Please enter a coupon code' });
      return;
    }

  const result = applyCoupon(couponCode, car.price, car);
    setCouponResult(result);
    
    if (result.success) {
      setFinalPrice(result.finalPrice);
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { car, finalPrice, couponCode: couponResult?.success ? couponCode : null } });
  };

  const specs = [
    { icon: Calendar, label: t('year'), value: car.year },
    { icon: Fuel, label: t('fuelType'), value: car.fuelType },
    { icon: Gauge, label: t('mileage'), value: t('miles')(formatNumber(car.mileage)) },
    { icon: Settings, label: t('transmission'), value: car.transmission },
    { icon: Palette, label: t('color'), value: car.color },
    { icon: Users, label: t('seating'), value: t('seatsCount')(car.seating) }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#0D1B2A]">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111723] rounded-2xl overflow-hidden shadow-xl mb-4 border border-[#E6C200]/20"
            >
              <img
                src={car.images[selectedImage]}
                alt={car.name}
                className="w-full aspect-[16/10] object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-xl overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-4 ring-[#E6C200] scale-105 glow-gold'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.name} ${index + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Brand and Name */}
              <p className="text-[#FFD700] font-semibold mb-2">{car.brand}</p>
              <h1 className="text-4xl font-bold text-[#E6C200] mb-4">{car.name}</h1>
              <p className="text-lg text-[#D9E1E8] mb-6">{car.model}</p>

              {/* Price */}
              <div className="bg-gradient-to-br from-[#E6C200]/10 to-[#FFD700]/10 rounded-2xl p-6 mb-6 border border-[#E6C200]/30">
                <p className="text-sm text-[#D9E1E8] mb-1">{t('startingPrice')}</p>
                {couponResult?.success ? (
                  <div>
                    <p className="text-2xl text-[#8B9EB3] line-through mb-1">
                      {formatPrice(car.price)}
                    </p>
                    <p className="text-4xl font-bold gradient-text">
                      {formatPrice(finalPrice)}
                    </p>
                    <p className="text-sm text-[#00E0FF] mt-2">
                      {language === 'ar' ? t('youSaved')(formatPrice(couponResult.discountAmount)) : t('youSaved')(formatPrice(couponResult.discountAmount))}
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl font-bold gradient-text">
                    {formatPrice(car.price)}
                  </p>
                )}
              </div>

              {/* Coupon Section */}
              <div className="bg-[#111723] rounded-2xl p-6 shadow-lg mb-6 border border-[#E6C200]/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-5 h-5 text-[#E6C200]" />
                  <h3 className="font-semibold text-[#E6C200]">{t('haveCoupon')}</h3>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder={t('enterCoupon')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline">
                    {t('apply')}
                  </Button>
                </div>
                {couponResult && (
                  <p className={`mt-2 text-sm ${couponResult.success ? 'text-[#00E0FF]' : 'text-red-500'}`}>
                    {couponResult.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] text-lg py-6 glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 transition-transform duration-500 ease-in-out group-hover:scale-110" />
                  {t('buyNow')}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/1234567890?text=I'm interested in ${car.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('whatsapp')}
                    </Button>
                  </a>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      {t('email')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-[#111723] rounded-2xl p-6 shadow-lg mb-6 border border-[#E6C200]/20">
                <h3 className="text-xl font-bold text-[#E6C200] mb-4">{t('specifications')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-[#E6C200]/20 to-[#FFD700]/20 p-2 rounded-lg border border-[#E6C200]/30">
                        <spec.icon className="w-5 h-5 text-[#E6C200]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9EB3]">{spec.label}</p>
                        <p className="font-semibold text-[#D9E1E8]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#E6C200]/20">
                  <p className="text-sm text-[#8B9EB3] mb-1">{t('engine')}</p>
                  <p className="font-semibold text-[#D9E1E8]">{car.engine}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#111723] rounded-2xl p-6 shadow-lg border border-[#E6C200]/20">
                <h3 className="text-xl font-bold text-[#E6C200] mb-4">{t('description')}</h3>
                <p className="text-[#D9E1E8] leading-relaxed">{car.description}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-[#E6C200] mb-8">{t('similarVehicles')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar, index) => (
                <CarCard key={relatedCar.id} car={relatedCar} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;

