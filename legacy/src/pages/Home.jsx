import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CarCard from '../components/CarCard';
import { Button } from '../components/ui/button';

const Home = () => {
  const { cars, testimonials, coupons, t } = useApp();
  const featuredCars = cars.filter(car => car.featured).slice(0, 3);
  const activeCoupons = coupons.filter(c => c.active).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1920&q=80"
            alt="Luxury Car"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/95 via-[#1B263B]/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {t('hero.title1')}
                <span className="block gradient-text">
                  {t('hero.title2')}
                </span>
              </h1>
              <p className="text-xl text-[#D9E1E8] mb-8 leading-relaxed">
                {t('hero.sub')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/cars">
                  <Button size="lg" className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] font-bold text-lg px-8 shadow-2xl glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:scale-110 active:scale-95">
                    {t('viewCars')}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 font-semibold">
                    {t('cta.contact')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#E6C200]/80 rounded-full flex items-start justify-center p-2 shadow-lg glow-gold">
            <div className="w-1 h-3 bg-gradient-to-b from-[#E6C200] to-[#FFD700] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Special Offers Section */}
      {activeCoupons.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-[#0D1B2A] via-[#111723] to-[#0D1B2A]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">{t('home.specialOffersTitle')}</h2>
              <p className="text-blue-100 text-lg">{t('home.specialOffersSub')}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {activeCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#2C2C2C] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-[#F5E6A3] text-[#0D1B2A] px-4 py-2 rounded-lg font-bold text-2xl glow-gold">
                      {coupon.discount}% OFF
                    </div>
                    <Award className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{coupon.description}</h3>
                  <p className="text-[#8B9EB3] mb-4">{t('useCode')}: <span className="font-mono font-bold text-[#D4AF37]">{coupon.code}</span></p>
                  <Link to="/coupons">
                    <Button variant="outline" className="w-full">{t('viewAllOffers')}</Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Cars Section */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('featuredVehiclesTitle')}</h2>
            <p className="text-[#D9E1E8] text-lg">{t('featuredVehiclesSub')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/cars">
              <Button size="lg" className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] font-bold shadow-lg glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95">
                {t('viewAllCars')}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#111723] border-y border-[#E6C200]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('whyChooseTitle')}</h2>
            <p className="text-[#F5F5F5] text-lg">{t('whyChooseSub')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: t('feature.premiumTitle'),
                description: t('feature.premiumDesc')
              },
              {
                icon: Shield,
                title: t('feature.trustedTitle'),
                description: t('feature.trustedDesc')
              },
              {
                icon: Award,
                title: t('feature.awardTitle'),
                description: t('feature.awardDesc')
              },
              {
                icon: TrendingUp,
                title: t('feature.valueTitle'),
                description: t('feature.valueDesc')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E6C200] to-[#FFD700] rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg glow-gold">
                  <feature.icon className="w-8 h-8 text-[#0D1B2A]" />
                </div>
                <h3 className="text-xl font-bold text-[#E6C200] mb-2">{feature.title}</h3>
                <p className="text-[#8B9EB3]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">{t('testimonialsTitle')}</h2>
            <p className="text-[#F5F5F5] text-lg">{t('testimonialsSub')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2C2C2C] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-lg card-hover"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-[#D4AF37]/30"
                  />
                  <div>
                    <h4 className="font-bold text-[#D4AF37]">{testimonial.name}</h4>
                    <p className="text-sm text-[#8B9EB3]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-[#D9E1E8] text-sm leading-relaxed">{testimonial.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white border-y border-[#E6C200]/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">{t('ctaReadyTitle')}</h2>
            <p className="text-[#D9E1E8] text-lg mb-8 max-w-2xl mx-auto">
              {t('ctaReadySub')}
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] font-bold text-lg px-8 shadow-lg glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95">
                {t('getInTouch')}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

