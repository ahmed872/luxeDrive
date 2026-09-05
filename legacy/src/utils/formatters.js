const getLocale = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang') || 'en-US'
  }
  return 'en-US'
}

export const formatPrice = (price) => {
  const locale = getLocale()
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatNumber = (num) => {
  const locale = getLocale()
  return new Intl.NumberFormat(locale).format(num);
};

export const formatDate = (dateString) => {
  const locale = getLocale()
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isExpired = (dateString) => {
  return new Date(dateString) < new Date();
};

