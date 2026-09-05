import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge, Star } from 'lucide-react';
import { formatPrice, formatNumber } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';

const CarCard = ({ car, index }) => {
  const navigate = useNavigate();
  const { t, language } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative bg-[#1E1E1E]/98 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl glow-gold transition-all duration-300 group border border-[#D4AF37]/20 card-hover"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#F5E6A3]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/8 group-hover:via-[#F5E6A3]/4 group-hover:to-[#D4AF37]/8 transition-all duration-500 pointer-events-none z-10" />
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-[#0D1B2A] px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg glow-gold">
            <Star className="w-3 h-3 fill-current" />
            <span>{t('featured')}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Brand */}
        <p className="text-sm font-medium text-[#D4AF37] mb-1">{car.brand}</p>
        
        {/* Name */}
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-2 group-hover:text-[#F5E6A3] transition-colors">
          {car.name}
        </h3>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{car.year}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Fuel className="w-4 h-4" />
            <span className="text-sm">{car.fuelType}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">{t('miles')(formatNumber(car.mileage))}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6C200]/20">
          <div>
            <p className="text-sm text-[#8B9EB3]">{t('startingAt')}</p>
            <p className="text-2xl font-bold gradient-text">
              {formatPrice(car.price)}
            </p>
          </div>
          
          <Link to={`/cars/${car.id}`}>
            <Button className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] font-bold shadow-lg glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95">
              {t('viewDetails')}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;

