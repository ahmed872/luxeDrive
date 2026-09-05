import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, isAdmin, t } = useApp();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { nameKey: 'nav.home', path: '/' },
    { nameKey: 'nav.cars', path: '/cars' },
    { nameKey: 'nav.coupons', path: '/coupons' },
    { nameKey: 'nav.about', path: '/about' },
    { nameKey: 'nav.contact', path: '/contact' },
  ];

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ar' : 'en');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] backdrop-blur-md shadow-lg shadow-[#E6C200]/10' : 'bg-gradient-to-r from-[#0D1B2A]/95 to-[#1B263B]/95 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" aria-label="LuxeDrive Home">
            <div className="bg-gradient-to-br from-[#E6C200] to-[#FFD700] p-2 rounded-lg group-hover:scale-110 transition-transform glow-gold">
              <Car className="w-6 h-6 text-[#0D1B2A]" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              LuxeDrive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                role="menuitem"
                className={`relative text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#E6C200]'
                    : 'text-[#D9E1E8] hover:text-[#E6C200]'
                }`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {t(link.nameKey)}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E6C200] to-[#FFD700]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-[#D9E1E8] hover:text-[#E6C200]"
              aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'EN' : 'AR'}</span>
            </Button>

            {/* Admin button hidden - access via /admin/login URL directly */}

            <Link to="/contact">
              <Button className="bg-[#E6C200] hover:bg-[#00E0FF] text-[#0D1B2A] font-semibold transition-all duration-300 glow-gold hover:glow-cyan">
                {t('cta.contact')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
            role="menu"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className={`block py-2 px-4 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {t(link.nameKey)}
                </Link>
              ))}

              <div className="pt-3 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                  }}
                  aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'العربية' : 'English'}
                </Button>

                {/* Admin button hidden - access via /admin/login URL directly */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

