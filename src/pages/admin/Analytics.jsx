import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Eye, ShoppingCart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();

  // Mock data
  const brandData = [
    { name: 'Mercedes-Benz', value: 25 },
    { name: 'BMW', value: 20 },
    { name: 'Audi', value: 15 },
    { name: 'Tesla', value: 18 },
    { name: 'Porsche', value: 12 },
    { name: 'Others', value: 10 }
  ];

  const monthlyData = [
    { month: 'Jan', views: 1200, inquiries: 45, sales: 12 },
    { month: 'Feb', views: 1500, inquiries: 52, sales: 15 },
    { month: 'Mar', views: 1800, inquiries: 68, sales: 18 },
    { month: 'Apr', views: 2200, inquiries: 75, sales: 22 },
    { month: 'May', views: 2500, inquiries: 88, sales: 25 },
    { month: 'Jun', views: 2800, inquiries: 95, sales: 28 }
  ];

  const couponUsageData = [
    { name: 'LUXURY2024', usage: 45 },
    { name: 'HYBRID15', usage: 32 },
    { name: 'ELECTRIC20', usage: 28 },
    { name: 'VIP25', usage: 15 }
  ];

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  const stats = [
    { icon: Eye, label: 'Total Views', value: '12.5K', change: '+15%', color: 'from-blue-600 to-blue-800' },
    { icon: Users, label: 'Unique Visitors', value: '8.2K', change: '+12%', color: 'from-green-600 to-green-800' },
    { icon: ShoppingCart, label: 'Inquiries', value: '423', change: '+8%', color: 'from-purple-600 to-purple-800' },
    { icon: TrendingUp, label: 'Conversion Rate', value: '3.4%', change: '+0.5%', color: 'from-yellow-500 to-yellow-700' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Brand Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sales by Brand</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Coupon Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Coupon Usage Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={couponUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

