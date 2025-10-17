import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';

const ManageCoupons = () => {
  const navigate = useNavigate();
  const { coupons, cars, addCoupon, updateCoupon, deleteCoupon, t, language } = useApp();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // coupon | null
  const [form, setForm] = useState({
    code: '',
    discount: 10,
    description: '',
    expiryDate: new Date().toISOString().slice(0,10),
    active: true,
    scope: { type: 'all', values: [] }
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', discount: 10, description: '', expiryDate: new Date().toISOString().slice(0,10), active: true, scope: { type: 'all', values: [] } });
    setOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({ ...coupon, expiryDate: coupon.expiryDate?.slice(0,10), scope: coupon.scope || { type: 'all', values: [] } });
    setOpen(true);
  };

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.code) return alert('Please enter code');
    const payload = { ...form, discount: Number(form.discount) || 0 };
    if (editing) updateCoupon(editing.id, payload); else addCoupon(payload);
    setOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
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
            <h1 className="text-4xl font-bold text-gray-900">{language === 'ar' ? 'إدارة الكوبونات' : 'Manage Coupons'}</h1>
          </div>
          <Button className="bg-gradient-to-r from-yellow-500 to-yellow-700" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إضافة كوبون' : 'Add New Coupon'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-2 rounded-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {coupon.discount}% OFF
                  </div>
                </div>
                {coupon.active ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    {language === 'ar' ? 'غير نشط' : 'Inactive'}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{coupon.description}</h3>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'كود الكوبون' : 'Coupon Code'}</p>
                <p className="font-mono font-bold text-blue-600">{coupon.code}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {language === 'ar' ? 'ينتهي في: ' : 'Expires: '} {formatDate(coupon.expiryDate)}
              </p>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(coupon)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(coupon.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Coupon Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? (language === 'ar' ? 'تعديل كوبون' : 'Edit Coupon') : (language === 'ar' ? 'إضافة كوبون' : 'Add Coupon')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الكود' : 'Code'}</label>
                <Input value={form.code} onChange={(e) => handleChange('code', e.target.value.toUpperCase())} placeholder="LUXURY2025" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الخصم (%)' : 'Discount (%)'}</label>
                <Input type="number" value={form.discount} onChange={(e) => handleChange('discount', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'الوصف' : 'Description'}</label>
                <Input value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder={language === 'ar' ? 'وصف موجز للعرض' : 'Short description of the offer'} />
              </div>
              {/* Scope Type */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'نطاق الكوبون' : 'Coupon Scope'}</label>
                <Select value={form.scope?.type || 'all'} onValueChange={(v) => handleChange('scope', { type: v, values: [] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'ar' ? 'الكل' : 'All vehicles'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All vehicles'}</SelectItem>
                    <SelectItem value="fuel">{language === 'ar' ? 'حسب نوع الوقود' : 'By fuel type'}</SelectItem>
                    <SelectItem value="brand">{language === 'ar' ? 'حسب الماركة' : 'By brand'}</SelectItem>
                    <SelectItem value="cars">{language === 'ar' ? 'سيارات محددة' : 'Specific cars'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Scope Values */}
              {form.scope?.type === 'fuel' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'اختر نوع الوقود' : 'Select fuel types'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[...new Set(cars.map(c => c.fuelType))].map(ft => (
                      <label key={ft} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.scope.values?.includes(ft)} onCheckedChange={(v) => {
                          const values = new Set(form.scope.values || [])
                          v ? values.add(ft) : values.delete(ft)
                          handleChange('scope', { ...form.scope, values: Array.from(values) })
                        }} />
                        {ft}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {form.scope?.type === 'brand' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'اختر الماركات' : 'Select brands'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[...new Set(cars.map(c => c.brand))].map(brand => (
                      <label key={brand} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.scope.values?.includes(brand)} onCheckedChange={(v) => {
                          const values = new Set(form.scope.values || [])
                          v ? values.add(brand) : values.delete(brand)
                          handleChange('scope', { ...form.scope, values: Array.from(values) })
                        }} />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {form.scope?.type === 'cars' && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'اختر سيارات' : 'Select specific cars'}</label>
                  <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {cars.map(c => (
                      <label key={c.id} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.scope.values?.includes(c.id)} onCheckedChange={(v) => {
                          const values = new Set(form.scope.values || [])
                          v ? values.add(c.id) : values.delete(c.id)
                          handleChange('scope', { ...form.scope, values: Array.from(values) })
                        }} />
                        <span className="truncate">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                <Input type="date" value={form.expiryDate} onChange={(e) => handleChange('expiryDate', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="active" checked={!!form.active} onCheckedChange={(v) => handleChange('active', Boolean(v))} />
                <label htmlFor="active" className="text-sm text-gray-700">{language === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>{language === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
              <Button onClick={handleSave}>{editing ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (language === 'ar' ? 'إضافة' : 'Add')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageCoupons;

