import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, finalPrice, couponCode } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0D1B2A]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#E6C200] mb-4">No car selected</h2>
          <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-[#0D1B2A] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111723] rounded-2xl p-12 shadow-2xl text-center max-w-2xl mx-4 border border-[#E6C200]/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#E6C200]/20 rounded-full mb-6 glow-gold"
          >
            <CheckCircle className="w-12 h-12 text-[#E6C200]" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-[#E6C200] mb-4">
            Thank You for Your Interest!
          </h1>
          
          <p className="text-lg text-[#D9E1E8] mb-8">
            We've received your inquiry for the <span className="font-semibold text-[#FFD700]">{car.name}</span>.
            Our team will contact you shortly to discuss the next steps.
          </p>

          <div className="bg-[#0D1B2A] rounded-xl p-6 mb-8 border border-[#E6C200]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8B9EB3]">Vehicle:</span>
              <span className="font-semibold text-[#D9E1E8]">{car.name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8B9EB3]">Price:</span>
              <span className="font-semibold text-[#D9E1E8]">{formatPrice(finalPrice || car.price)}</span>
            </div>
            {couponCode && (
              <div className="flex items-center justify-between">
                <span className="text-[#8B9EB3]">Coupon Applied:</span>
                <span className="font-semibold text-[#00E0FF]">{couponCode}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate('/cars')}
              variant="outline"
              className="w-full transition-all duration-500 ease-in-out"
            >
              Browse More Cars
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0D1B2A]">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#E6C200] mb-8"
          >
            Complete Your Purchase
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111723] rounded-2xl p-8 shadow-lg border border-[#E6C200]/20"
              >
                <h2 className="text-2xl font-bold text-[#E6C200] mb-6">Contact Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        First Name *
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="John"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        Last Name *
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        Phone *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (234) 567-890"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                      Address *
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Main Street"
                      className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        City *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="جدة"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        ZIP Code *
                      </label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="23431"
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-[#E6C200]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6C200] bg-[#0D1B2A] text-[#D9E1E8] placeholder:text-[#8B9EB3] focus:border-[#E6C200]"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] text-lg py-6 glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95"
                  >
                    Submit Inquiry
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111723] rounded-2xl p-6 shadow-lg sticky top-24 border border-[#E6C200]/20"
              >
                <h2 className="text-xl font-bold text-[#E6C200] mb-6">Order Summary</h2>

                <div className="mb-6">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full rounded-xl mb-4 border border-[#E6C200]/20"
                  />
                  <h3 className="font-bold text-[#E6C200] text-lg mb-1">{car.name}</h3>
                  <p className="text-[#D9E1E8]">{car.model}</p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-[#E6C200]/20">
                  <div className="flex justify-between">
                    <span className="text-[#8B9EB3]">Year</span>
                    <span className="font-semibold text-[#D9E1E8]">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B9EB3]">Mileage</span>
                    <span className="font-semibold text-[#D9E1E8]">{car.mileage.toLocaleString()} mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B9EB3]">Fuel Type</span>
                    <span className="font-semibold text-[#D9E1E8]">{car.fuelType}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-[#8B9EB3]">Base Price</span>
                    <span className="font-semibold text-[#D9E1E8]">{formatPrice(car.price)}</span>
                  </div>
                  
                  {couponCode && finalPrice < car.price && (
                    <>
                      <div className="flex justify-between text-[#00E0FF]">
                        <span>Discount ({couponCode})</span>
                        <span className="font-semibold">
                          -{formatPrice(car.price - finalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold pt-3 border-t border-[#E6C200]/20">
                        <span className="text-[#E6C200]">Total</span>
                        <span className="gradient-text">
                          {formatPrice(finalPrice)}
                        </span>
                      </div>
                    </>
                  )}

                  {!couponCode && (
                    <div className="flex justify-between text-2xl font-bold pt-3 border-t border-[#E6C200]/20">
                      <span className="text-[#E6C200]">Total</span>
                      <span className="gradient-text">
                        {formatPrice(car.price)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-[#E6C200]/10 rounded-lg border border-[#E6C200]/30">
                  <p className="text-sm text-[#D9E1E8]">
                    This is a purchase inquiry. Our team will contact you to finalize the transaction and arrange payment.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

