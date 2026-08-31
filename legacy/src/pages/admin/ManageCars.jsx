import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';

const ManageCars = () => {
  const navigate = useNavigate();
  const { cars, addCar, updateCar, deleteCar, language } = useApp();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // car or null
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: 0,
    color: 'Black',
    seating: 5,
    engine: '2.0L',
    description: '',
    featured: false,
    images: ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&q=80']
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: '', brand: '', model: '', year: new Date().getFullYear(), price: 0,
      fuelType: 'Petrol', transmission: 'Automatic', mileage: 0, color: 'Black', seating: 5,
      engine: '2.0L', description: '', featured: false,
      images: ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&q=80']
    });
    setOpen(true);
  };

  const openEdit = (car) => {
    setEditing(car);
    setForm({ ...car });
    setOpen(true);
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Minimal validation
    if (!form.name || !form.brand || !form.model) return alert('Please fill required fields');
    if (editing) {
      updateCar(editing.id, {
        ...form,
        year: parseInt(form.year) || editing.year,
        price: Number(form.price) || editing.price,
        mileage: Number(form.mileage) || editing.mileage,
      });
    } else {
      addCar({
        ...form,
        year: parseInt(form.year) || new Date().getFullYear(),
        price: Number(form.price) || 0,
        mileage: Number(form.mileage) || 0,
      });
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCar(id);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
            <h1 className="text-4xl font-bold text-gray-900">{language === 'ar' ? 'إدارة السيارات' : 'Manage Cars'}</h1>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-800" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إضافة سيارة' : 'Add New Car'}
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{language === 'ar' ? 'السيارة' : 'Car'}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{language === 'ar' ? 'الماركة' : 'Brand'}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{language === 'ar' ? 'السنة' : 'Year'}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{language === 'ar' ? 'السعر' : 'Price'}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cars.map((car) => (
                  <motion.tr
                    key={car.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{car.name}</p>
                          <p className="text-sm text-gray-600">{car.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{car.brand}</td>
                    <td className="px-6 py-4 text-gray-900">{car.year}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(car.price)}</td>
                    <td className="px-6 py-4">
                      {car.featured ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {language === 'ar' ? 'مميز' : 'Featured'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                          {language === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(car)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(car.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? (language === 'ar' ? 'تعديل سيارة' : 'Edit Car') : (language === 'ar' ? 'إضافة سيارة' : 'Add New Car')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الاسم' : 'Name'}</label>
              <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g., Mercedes-Benz S-Class" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الماركة' : 'Brand'}</label>
              <Input value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} placeholder="e.g., Mercedes-Benz" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الموديل' : 'Model'}</label>
              <Input value={form.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="e.g., S 500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'السنة' : 'Year'}</label>
              <Input type="number" value={form.year} onChange={(e) => handleChange('year', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'السعر (دولار)' : 'Price (USD)'}</label>
              <Input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'عدد الأميال' : 'Mileage'}</label>
              <Input type="number" value={form.mileage} onChange={(e) => handleChange('mileage', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'نوع الوقود' : 'Fuel Type'}</label>
              <Input value={form.fuelType} onChange={(e) => handleChange('fuelType', e.target.value)} placeholder="Petrol/Electric/Hybrid" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'ناقل الحركة' : 'Transmission'}</label>
              <Input value={form.transmission} onChange={(e) => handleChange('transmission', e.target.value)} placeholder="Automatic/Manual" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'اللون' : 'Color'}</label>
              <Input value={form.color} onChange={(e) => handleChange('color', e.target.value)} placeholder="Black/White/..." />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'عدد المقاعد' : 'Seating'}</label>
              <Input type="number" value={form.seating} onChange={(e) => handleChange('seating', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'المحرّك' : 'Engine'}</label>
              <Input value={form.engine} onChange={(e) => handleChange('engine', e.target.value)} placeholder="e.g., 3.0L V6" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
              <Input value={form.images[0] || ''} onChange={(e) => handleChange('images', [e.target.value])} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الوصف' : 'Description'}</label>
              <textarea className="w-full border border-input rounded-md p-2 min-h-24 focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Checkbox id="featured" checked={!!form.featured} onCheckedChange={(v) => handleChange('featured', Boolean(v))} />
              <label htmlFor="featured" className="text-sm text-gray-700">{language === 'ar' ? 'مميز' : 'Featured'}</label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleSave}>{editing ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (language === 'ar' ? 'إضافة سيارة' : 'Add Car')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCars;

