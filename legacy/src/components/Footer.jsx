import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useApp();

  return (
    <footer className="bg-[#0A0F1C] text-[#D9E1E8] border-t border-[#E6C200]/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-[#E6C200] to-[#FFD700] p-2 rounded-lg glow-gold">
                <Car className="w-6 h-6 text-[#0D1B2A]" />
              </div>
              <span className="text-2xl font-bold gradient-text">LuxeDrive</span>
            </div>
            <p className="text-[#8B9EB3] text-sm leading-relaxed">
              {language === 'ar'
                ? 'وجهتك الأولى للسيارات الفاخرة والرياضية. نقدم مجموعة استثنائية من أفخم السيارات في العالم.'
                : 'Your premier destination for luxury and performance vehicles. We offer an exceptional selection of the world\'s finest automobiles.'}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1B263B] border border-[#E6C200]/30 hover:bg-[#E6C200] hover:text-[#0D1B2A] hover:border-[#E6C200] flex items-center justify-center transition-all glow-gold"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1B263B] border border-[#E6C200]/30 hover:bg-[#E6C200] hover:text-[#0D1B2A] hover:border-[#E6C200] flex items-center justify-center transition-all glow-gold"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1B263B] border border-[#E6C200]/30 hover:bg-gradient-to-br hover:from-[#E6C200] hover:to-[#FFD700] hover:text-[#0D1B2A] hover:border-[#E6C200] flex items-center justify-center transition-all glow-gold"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1B263B] border border-[#E6C200]/30 hover:bg-[#E6C200] hover:text-[#0D1B2A] hover:border-[#E6C200] flex items-center justify-center transition-all glow-gold"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[#E6C200] mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/cars"
                  className="text-[#D9E1E8] hover:text-[#E6C200] hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {language === 'ar' ? 'السيارات' : 'Vehicles'}
                </Link>
              </li>
              <li>
                <Link
                  to="/coupons"
                  className="text-[#D9E1E8] hover:text-[#E6C200] hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {language === 'ar' ? 'العروض والكوبونات' : 'Deals & Coupons'}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#D9E1E8] hover:text-[#E6C200] hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {language === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#D9E1E8] hover:text-[#E6C200] hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {language === 'ar' ? 'اتصل بنا' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-[#E6C200] mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-3 text-[#D9E1E8]">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#E6C200] mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  {language === 'ar'
                    ? '123 شارع الأمير محمد، الرياض، المملكة العربية السعودية'
                    : '123 Prince Mohammed St, Riyadh, Saudi Arabia'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#E6C200] flex-shrink-0" />
                <span className="text-sm" dir="ltr">
                  +966 50 123 4567
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#E6C200] flex-shrink-0" />
                <span className="text-sm">info@luxedrive.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#E6C200] flex-shrink-0" />
                <span className="text-sm">
                  {language === 'ar' ? 'السبت - الخميس: 9 ص - 10 م' : 'Sat - Thu: 9 AM - 10 PM'}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-[#E6C200] mb-4">
              {language === 'ar' ? 'النشرة الإخبارية' : 'Newsletter'}
            </h3>
            <p className="text-[#8B9EB3] text-sm mb-4">
              {language === 'ar'
                ? 'اشترك للحصول على آخر العروض والتحديثات'
                : 'Subscribe to get the latest deals and updates'}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="w-full px-4 py-2 rounded-lg bg-[#1B263B] border border-[#E6C200]/30 text-[#D9E1E8] placeholder-[#8B9EB3] focus:outline-none focus:border-[#E6C200] focus:ring-2 focus:ring-[#E6C200]/30 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] font-semibold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-500 ease-in-out glow-gold hover:scale-105 active:scale-95"
              >
                {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E6C200]/20 text-center">
          <p className="text-[#8B9EB3] text-sm">
            © {new Date().getFullYear()} LuxeDrive.{' '}
            {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

