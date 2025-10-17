import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Tag, Eye, TrendingUp, Users, DollarSign, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { cars, coupons, setIsAdmin, getTotalViews, getViewsByBrand, language, activities } = useApp();

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('/');
  };

  // Calculate stats
  const totalCars = cars.length;
  const activeCoupons = coupons.filter(c => c.active).length;
  const totalValue = cars.reduce((sum, car) => sum + car.price, 0);
  const avgPrice = totalCars ? (totalValue / totalCars) : 0;
  const totalViews = getTotalViews();

  // Mock analytics data
  const viewsData = getViewsByBrand();

  const salesTrendData = [
    { month: 'Jan', sales: 12 },
    { month: 'Feb', sales: 15 },
    { month: 'Mar', sales: 18 },
    { month: 'Apr', sales: 22 },
    { month: 'May', sales: 25 },
    { month: 'Jun', sales: 28 }
  ];

  const stats = [
    {
      icon: Car,
  label: language === 'ar' ? 'إجمالي السيارات' : 'Total Cars',
      value: totalCars,
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Tag,
  label: language === 'ar' ? 'كوبونات نشطة' : 'Active Coupons',
      value: activeCoupons,
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Eye,
  label: language === 'ar' ? 'إجمالي الزيارات' : 'Total Views',
  value: totalViews.toLocaleString(),
      color: 'from-green-600 to-green-800',
      bgColor: 'bg-green-50'
    },
    {
      icon: DollarSign,
  label: language === 'ar' ? 'متوسط السعر' : 'Avg. Price',
      value: formatPrice(avgPrice),
      color: 'from-purple-600 to-purple-800',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}</h1>
              <p className="text-blue-100">{language === 'ar' ? 'إدارة المخزون والتحليلات' : 'Manage your dealership inventory and analytics'}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-12"
        >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/admin/cars')}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 h-auto py-4"
            >
              <Car className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'إدارة السيارات' : 'Manage Cars'}
            </Button>
            <Button
              onClick={() => navigate('/admin/coupons')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 h-auto py-4"
            >
              <Tag className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'إدارة الكوبونات' : 'Manage Coupons'}
            </Button>
            <Button
              onClick={() => navigate('/admin/analytics')}
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 h-auto py-4"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'عرض التحليلات' : 'View Analytics'}
            </Button>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Car Views Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'مشاهدات السيارات حسب الماركة' : 'Car Views by Brand'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'اتجاه المبيعات' : 'Sales Trend'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg mt-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'آخر النشاطات' : 'Recent Activity'}</h3>
          <div className="space-y-4">
            {(activities && activities.length ? activities : []).slice(0,8).map((a) => {
              const diff = Date.now() - a.timestamp
              const minutes = Math.floor(diff / 60000)
              const hours = Math.floor(minutes / 60)
              const days = Math.floor(hours / 24)
              const timeAgo = days > 0
                ? (language === 'ar' ? `${days} يوم` : `${days} day${days>1?'s':''} ago`)
                : hours > 0
                  ? (language === 'ar' ? `${hours} ساعة` : `${hours} hour${hours>1?'s':''} ago`)
                  : (language === 'ar' ? `${minutes} دقيقة` : `${minutes} min ago`)

              const actionMap = {
                car_add: language === 'ar' ? 'تمت إضافة سيارة جديدة' : 'New car added',
                car_update: language === 'ar' ? 'تم تحديث سيارة' : 'Car updated',
                car_delete: language === 'ar' ? 'تم حذف سيارة' : 'Car deleted',
                coupon_add: language === 'ar' ? 'تم إضافة كوبون' : 'Coupon added',
                coupon_update: language === 'ar' ? 'تم تحديث كوبون' : 'Coupon updated',
                coupon_activate: language === 'ar' ? 'تم تفعيل كوبون' : 'Coupon activated',
                coupon_delete: language === 'ar' ? 'تم حذف كوبون' : 'Coupon deleted',
              }
              return (
                <div key={a.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{actionMap[a.type] || a.type}</p>
                    <p className="text-sm text-gray-600">{a.item}</p>
                  </div>
                  <p className="text-sm text-gray-500">{timeAgo}</p>
                </div>
              )
            })}
            {(!activities || activities.length === 0) && (
              <p className="text-sm text-gray-500">{language === 'ar' ? 'لا يوجد نشاط بعد' : 'No activity yet'}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

