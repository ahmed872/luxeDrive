import { createContext, useContext, useState, useEffect } from 'react';
import carsData from '../data/cars.json';
import couponsData from '../data/coupons.json';
import testimonialsData from '../data/testimonials.json';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cars, setCars] = useState(carsData);
  const [coupons, setCoupons] = useState(couponsData);
  const [testimonials] = useState(testimonialsData);
  // Initialize language from localStorage if present
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app:lang') || 'en'
    }
    return 'en'
  });
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple analytics: per-car view counts persisted locally
  const [views, setViews] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('app:views')
        return raw ? JSON.parse(raw) : {}
      } catch {
        return {}
      }
    }
    return {}
  });

  // Persistent recent activity log (admin actions)
  const [activities, setActivities] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('app:activities')
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    }
    return []
  })

  // Filter and search functionality
  const [filters, setFilters] = useState({
    brand: '',
    year: '',
    priceRange: [0, 500000],
    fuelType: '',
    searchQuery: ''
  });

  const [sortBy, setSortBy] = useState('featured');

  // Lightweight i18n dictionary for common labels
  const messages = {
    en: {
      'nav.home': 'Home',
      'nav.cars': 'Cars',
      'nav.coupons': 'Coupons',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'cta.contact': 'Contact Us',
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'adminLogin': 'Admin Login',
  // Home - Hero
  'hero.title1': 'Drive Your',
  'hero.title2': 'Dream Luxury',
  'hero.sub': "Discover an exceptional collection of the world's finest automobiles. Experience luxury, performance, and elegance like never before.",
  'viewCars': 'View Cars',
  'viewAllCars': 'View All Cars',
  // Home - Special offers snippet
  'home.specialOffersTitle': 'Special Offers',
  'home.specialOffersSub': 'Limited time deals on luxury vehicles',
  'useCode': 'Use code',
  'viewAllOffers': 'View All Offers',
  // Home - Featured
  'featuredVehiclesTitle': 'Featured Vehicles',
  'featuredVehiclesSub': 'Handpicked selection of our finest automobiles',
  // Home - Why Choose
  'whyChooseTitle': 'Why Choose LuxeDrive',
  'whyChooseSub': 'Excellence in every aspect of our service',
  'feature.premiumTitle': 'Premium Selection',
  'feature.premiumDesc': "Curated collection of the world's most prestigious automotive brands",
  'feature.trustedTitle': 'Trusted Service',
  'feature.trustedDesc': 'Decades of experience delivering exceptional customer satisfaction',
  'feature.awardTitle': 'Award Winning',
  'feature.awardDesc': 'Recognized for excellence in luxury automotive retail',
  'feature.valueTitle': 'Best Value',
  'feature.valueDesc': 'Competitive pricing with flexible financing options available',
  // Home - Testimonials
  'testimonialsTitle': 'What Our Clients Say',
  'testimonialsSub': 'Trusted by discerning automotive enthusiasts',
  // Home - CTA
  'ctaReadyTitle': 'Ready to Find Your Dream Car?',
  'ctaReadySub': 'Our team of experts is ready to help you discover the perfect luxury vehicle that matches your style and preferences.',
  'getInTouch': 'Get in Touch',
  // Coupons
  'specialOffersTitle': 'Special Offers & Coupons',
  'specialOffersSub': 'Take advantage of our exclusive discounts and save on your dream luxury vehicle. Limited time offers available!',
  'activeOffers': 'Active Offers',
  'couponCode': 'Coupon Code',
  'copy': 'Copy',
  'copied': 'Copied!',
  'expired': 'Expired',
  'expiredOn': 'Expired on',
  'validUntil': 'Valid until',
  'noActiveCoupons': 'No active coupons at the moment. Check back soon!',
  'howToUse': 'How to Use Coupons',
  'copyCode': 'Copy Code',
  'copyCodeDesc': 'Click the copy button to save the coupon code',
  'selectVehicle': 'Select Vehicle',
  'selectVehicleDesc': 'Browse our collection and choose your dream car',
  'applyAndSave': 'Apply & Save',
  'applyAndSaveDesc': 'Enter the code at checkout to get your discount',
  'pastOffers': 'Past Offers',
  'theseOffersExpired': 'These offers have expired',
  // Cars page
  'cars.title': 'Browse Our Collection',
  'cars.heroSub': (n) => `Discover ${n} exceptional luxury ${n === 1 ? 'vehicle' : 'vehicles'}`,
  'brand': 'Brand',
  'searchCarsPlaceholder': 'Search cars...'
  ,
  'sortBy': 'Sort by',
  'sort.featured': 'Featured',
  'sort.priceLow': 'Price: Low to High',
  'sort.priceHigh': 'Price: High to Low',
  'sort.yearNew': 'Year: Newest',
  'sort.yearOld': 'Year: Oldest',
  'cars.showingXofY': (x, y) => `Showing ${x} of ${y} vehicles`,
  'previous': 'Previous',
  'next': 'Next',
  'noVehiclesMatch': 'No vehicles found matching your criteria',
  'clearAllFilters': 'Clear All Filters',
  // Shared labels
  'featured': 'Featured',
      // Generic
      'search': 'Search',
      'filters': 'Filters',
      'clearAll': 'Clear All',
      'allBrands': 'All Brands',
      'allYears': 'All Years',
      'allTypes': 'All Types',
      // CarCard
      'startingAt': 'Starting at',
      'viewDetails': 'View Details',
      // CarDetails
      'buyNow': 'Buy Now',
      'whatsapp': 'WhatsApp',
      'email': 'Email',
      'specifications': 'Specifications',
      'year': 'Year',
      'fuelType': 'Fuel Type',
      'mileage': 'Mileage',
      'transmission': 'Transmission',
      'seating': 'Seating',
      'color': 'Color',
      'engine': 'Engine',
      'description': 'Description',
      'seatsCount': (n) => `seats ${n}`,
      'miles': (n) => `mi ${n}`,
      'haveCoupon': 'Have a Coupon?',
      'enterCoupon': 'Enter coupon code',
      'apply': 'Apply',
      'startingPrice': 'Starting Price',
      'youSaved': (amt) => `You saved ${amt}!`,
      'similarVehicles': 'Similar Vehicles',
      'carNotFound': 'Car not found',
      'back': 'Back',
    },
    ar: {
      'nav.home': 'الرئيسية',
      'nav.cars': 'السيارات',
      'nav.coupons': 'الكوبونات',
      'nav.about': 'من نحن',
      'nav.contact': 'تواصل',
      'cta.contact': 'اتصل بنا',
      'admin': 'الإدارة',
      'dashboard': 'لوحة التحكم',
      'adminLogin': 'تسجيل دخول المشرف',
  // Home - Hero
  'hero.title1': 'قد سيارتك',
  'hero.title2': 'الفاخرة',
  'hero.sub': 'اكتشف مجموعة استثنائية من أفخم السيارات في العالم. تجربة فخامة وأداء وأناقة كما لم يحدث من قبل.',
  'viewCars': 'عرض السيارات',
  'viewAllCars': 'عرض كل السيارات',
  // Home - Special offers snippet
  'home.specialOffersTitle': 'عروض خاصة',
  'home.specialOffersSub': 'عروض لفترة محدودة على السيارات الفاخرة',
  'useCode': 'استخدم الكود',
  'viewAllOffers': 'عرض كل العروض',
  // Home - Featured
  'featuredVehiclesTitle': 'سيارات مميزة',
  'featuredVehiclesSub': 'اختيارات منتقاة من أفضل سياراتنا',
  // Home - Why Choose
  'whyChooseTitle': 'لماذا تختار LuxeDrive',
  'whyChooseSub': 'التميّز في كل جوانب خدمتنا',
  'feature.premiumTitle': 'اختيارات فاخرة',
  'feature.premiumDesc': 'مجموعة منتقاة من أشهر علامات السيارات الفاخرة في العالم',
  'feature.trustedTitle': 'خدمة موثوقة',
  'feature.trustedDesc': 'خبرات طويلة في تقديم رضا استثنائي للعملاء',
  'feature.awardTitle': 'حاصلة على جوائز',
  'feature.awardDesc': 'تميّز مُعترف به في مجال بيع السيارات الفاخرة',
  'feature.valueTitle': 'أفضل قيمة',
  'feature.valueDesc': 'أسعار تنافسية مع خيارات تمويل مرنة',
  // Home - Testimonials
  'testimonialsTitle': 'ماذا يقول عملاؤنا',
  'testimonialsSub': 'موثوق بنا من عشّاق السيارات المميزين',
  // Home - CTA
  'ctaReadyTitle': 'جاهز تلاقي سيارتك الحلم؟',
  'ctaReadySub': 'فريق خبرائنا جاهز يساعدك تكتشف السيارة الفاخرة الأنسب لذوقك واحتياجك.',
  'getInTouch': 'تواصل معنا',
  // Coupons
  'specialOffersTitle': 'عروض خاصة وكوبونات',
  'specialOffersSub': 'استفد من خصوماتنا الحصرية ووفّر على سيارة أحلامك. عروض لفترة محدودة!',
  'activeOffers': 'عروض متاحة',
  'couponCode': 'كود الكوبون',
  'copy': 'نسخ',
  'copied': 'تم النسخ! ',
  'expired': 'منتهي',
  'expiredOn': 'انتهى في',
  'validUntil': 'ساري حتى',
  'noActiveCoupons': 'لا توجد كوبونات نشطة حالياً. ترقّب قريباً!',
  'howToUse': 'طريقة استخدام الكوبونات',
  'copyCode': 'انسخ الكود',
  'copyCodeDesc': 'اضغط زر النسخ لحفظ كود الكوبون',
  'selectVehicle': 'اختر سيارة',
  'selectVehicleDesc': 'تصفّح مجموعتنا واختر سيارتك المفضلة',
  'applyAndSave': 'طبّق ووفّر',
  'applyAndSaveDesc': 'أدخل الكود عند الدفع للحصول على الخصم',
  'pastOffers': 'عروض سابقة',
  'theseOffersExpired': 'هذه العروض انتهت',
  // Cars page
  'cars.title': 'تصفّح مجموعتنا',
  'cars.heroSub': (n) => `اكتشف ${n} من السيارات الفاخرة المميزة`,
  'brand': 'الماركة',
  'searchCarsPlaceholder': 'ابحث عن السيارات...',
  'sortBy': 'ترتيب حسب',
  'sort.featured': 'مميز',
  'sort.priceLow': 'السعر: من الأقل للأعلى',
  'sort.priceHigh': 'السعر: من الأعلى للأقل',
  'sort.yearNew': 'السنة: الأحدث',
  'sort.yearOld': 'السنة: الأقدم',
  'cars.showingXofY': (x, y) => `عرض ${x} من ${y} من السيارات`,
  'previous': 'السابق',
  'next': 'التالي',
  'noVehiclesMatch': 'لا توجد سيارات مطابقة لبحثك',
  'clearAllFilters': 'مسح كل المرشّحات',
  // Shared labels
  'featured': 'مميز',
      // Generic
      'search': 'بحث',
      'filters': 'المرشّحات',
      'clearAll': 'مسح الكل',
      'allBrands': 'كل الماركات',
      'allYears': 'كل السنوات',
      'allTypes': 'كل الأنواع',
      // CarCard
      'startingAt': 'ابتداءً من',
      'viewDetails': 'عرض التفاصيل',
      // CarDetails
      'buyNow': 'اشتري الآن',
      'whatsapp': 'واتساب',
      'email': 'إيميل',
      'specifications': 'المواصفات',
      'year': 'السنة',
      'fuelType': 'نوع الوقود',
      'mileage': 'عدد الأميال',
      'transmission': 'ناقل الحركة',
      'seating': 'عدد المقاعد',
      'color': 'اللون',
      'engine': 'المحرّك',
      'description': 'الوصف',
      'seatsCount': (n) => `مقاعد ${n}`,
      'miles': (n) => `${n} ميل`,
      'haveCoupon': 'هل لديك كوبون؟',
      'enterCoupon': 'أدخل كود الكوبون',
      'apply': 'تطبيق',
      'startingPrice': 'السعر الابتدائي',
      'youSaved': (amt) => `وفّرت ${amt}!`,
      'similarVehicles': 'سيارات مشابهة',
      'carNotFound': 'السيارة غير موجودة',
      'back': 'رجوع',
    },
  }

  const t = (key) => (messages[language] && messages[language][key]) || key

  // Reflect language in <html> attributes and persist it
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language === 'ar' ? 'ar' : 'en')
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('app:lang', language)
    }
  }, [language])

  // Persist views when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('app:views', JSON.stringify(views)) } catch {}
    }
  }, [views])

  // Persist activities when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('app:activities', JSON.stringify(activities)) } catch {}
    }
  }, [activities])

  // Track a car detail view
  const trackCarView = (carId) => {
    if (!carId) return
    setViews(prev => ({ ...prev, [carId]: (prev[carId] || 0) + 1 }))
  }

  // Sum of all views
  const getTotalViews = () => {
    return Object.values(views).reduce((sum, n) => sum + (Number(n) || 0), 0)
  }

  // Aggregate views by brand for charts
  const getViewsByBrand = () => {
    const byBrand = {}
    for (const [idStr, count] of Object.entries(views)) {
      const id = parseInt(idStr)
      const car = cars.find(c => c.id === id)
      if (!car) continue
      byBrand[car.brand] = (byBrand[car.brand] || 0) + (Number(count) || 0)
    }
    // Convert to array for charts
    return Object.entries(byBrand).map(([name, views]) => ({ name, views }))
  }

  // Get filtered and sorted cars
  const getFilteredCars = () => {
    let filtered = [...cars];

    // Apply filters
    if (filters.brand) {
      filtered = filtered.filter(car => car.brand === filters.brand);
    }
    if (filters.year) {
      filtered = filtered.filter(car => car.year === parseInt(filters.year));
    }
    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(car => 
      car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  };

  // Get unique brands
  const getBrands = () => {
    return [...new Set(cars.map(car => car.brand))].sort();
  };

  // Get unique years
  const getYears = () => {
    return [...new Set(cars.map(car => car.year))].sort((a, b) => b - a);
  };

  // Get unique fuel types
  const getFuelTypes = () => {
    return [...new Set(cars.map(car => car.fuelType))].sort();
  };

  // Helper: check if coupon applies to a given car
  const couponAppliesToCar = (coupon, car) => {
    const scope = coupon.scope || { type: 'all', values: [] }
    if (!scope || scope.type === 'all') return true
    if (!car) return false
    switch (scope.type) {
      case 'fuel':
        return (scope.values || []).includes(car.fuelType)
      case 'brand':
        return (scope.values || []).includes(car.brand)
      case 'cars':
        return (scope.values || []).includes(car.id)
      default:
        return true
    }
  }

  // Apply coupon with per-vehicle scoping
  const applyCoupon = (couponCode, price, car) => {
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && 
      c.active &&
      new Date(c.expiryDate) > new Date()
    );
    
    if (coupon) {
      // Enforce scope
      if (!couponAppliesToCar(coupon, car)) {
        return {
          success: false,
          message: language === 'ar' ? 'هذا الكوبون غير صالح لهذه السيارة' : "This coupon isn't valid for this vehicle"
        }
      }
      const discount = (price * coupon.discount) / 100;
      return {
        success: true,
        discount: coupon.discount,
        discountAmount: discount,
        finalPrice: price - discount,
        message: language === 'ar'
          ? `تم تطبيق الكوبون! وفّرت $${discount.toLocaleString('en-US')}`
          : `Coupon applied! You saved $${discount.toLocaleString('en-US')}`
      };
    }
    
    return {
      success: false,
      message: language === 'ar' ? 'الكوبون غير صالح أو منتهي' : 'Invalid or expired coupon code'
    };
  };

  // Activity helpers
  const addActivity = (type, item) => {
    const entry = { id: Date.now() + Math.random(), type, item, timestamp: Date.now() }
    setActivities(prev => [entry, ...prev].slice(0, 100)) // keep last 100
  }

  // Admin functions
  const addCar = (car) => {
    const newCar = { ...car, id: cars.length + 1 };
    setCars([...cars, newCar]);
    addActivity('car_add', newCar.name)
  };

  const updateCar = (id, updatedCar) => {
    setCars(cars.map(car => car.id === id ? { ...car, ...updatedCar } : car));
    const name = cars.find(c => c.id === id)?.name || `#${id}`
    addActivity('car_update', name)
  };

  const deleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
    const name = cars.find(c => c.id === id)?.name || `#${id}`
    addActivity('car_delete', name)
  };

  const addCoupon = (coupon) => {
    const newCoupon = { ...coupon, id: coupons.length + 1 };
    setCoupons([...coupons, newCoupon]);
    addActivity('coupon_add', newCoupon.code)
    if (newCoupon.active) addActivity('coupon_activate', newCoupon.code)
  };

  const updateCoupon = (id, updatedCoupon) => {
    const prev = coupons.find(c => c.id === id)
    const next = { ...prev, ...updatedCoupon }
    setCoupons(coupons.map(coupon => coupon.id === id ? next : coupon));
    addActivity('coupon_update', next.code)
    if (!prev?.active && next.active) addActivity('coupon_activate', next.code)
  };

  const deleteCoupon = (id) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
    const code = coupons.find(c => c.id === id)?.code || `#${id}`
    addActivity('coupon_delete', code)
  };

  const value = {
    cars,
    coupons,
    testimonials,
    language,
    setLanguage,
    t,
    cart,
    setCart,
    isAdmin,
    setIsAdmin,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    getFilteredCars,
    getBrands,
    getYears,
    getFuelTypes,
    applyCoupon,
  // analytics
  views,
  trackCarView,
  getTotalViews,
  getViewsByBrand,
  // activities
  activities,
    addCar,
    updateCar,
    deleteCar,
    addCoupon,
    updateCoupon,
    deleteCoupon
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

