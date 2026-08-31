import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useApp } from '../context/AppContext';

const Contact = () => {
  const { t, language } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'ar' ? 'زر معرضنا' : 'Visit Our Showroom',
      details: language === 'ar' 
        ? ['شارع الأمير محمد بن عبدالعزيز', 'حي الروضة', 'جدة 23431، المملكة العربية السعودية']
        : ['Prince Mohammed Bin Abdulaziz Street', 'Al Rawdah District', 'Jeddah 23431, Saudi Arabia']
    },
    {
      icon: Phone,
      title: language === 'ar' ? 'اتصل بنا' : 'Call Us',
      details: ['+1 (234) 567-890', '+1 (234) 567-891'],
      link: 'tel:+1234567890'
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'راسلنا' : 'Email Us',
      details: ['info@luxedrive.com', 'sales@luxedrive.com'],
      link: 'mailto:info@luxedrive.com'
    },
    {
      icon: Clock,
      title: language === 'ar' ? 'ساعات العمل' : 'Business Hours',
      details: language === 'ar'
        ? ['الاثنين - الجمعة: 9:00 ص - 8:00 م', 'السبت - الأحد: 10:00 ص - 6:00 م']
        : ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM']
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#0D1B2A]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white py-20 border-b border-[#E6C200]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6 gradient-text">{t('getInTouch')}</h1>
            <p className="text-xl text-[#D9E1E8] leading-relaxed">
              {language === 'ar'
                ? 'عندك أسئلة عن سياراتنا أو خدماتنا؟ نحن هنا لمساعدتك. تواصل مع فريقنا وسنرد عليك في أقرب وقت.'
                : "Have questions about our vehicles or services? We're here to help. Reach out to our team and we'll get back to you as soon as possible."}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-[#E6C200] mb-4">{language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</h2>
              <p className="text-[#D9E1E8] leading-relaxed">
                {language === 'ar'
                  ? 'قم بزيارة معرضنا المتطور أو تواصل معنا عبر قناتك المفضلة. فريقنا جاهز لخدمتك.'
                  : 'Visit our state-of-the-art showroom or connect with us through your preferred channel. Our team is ready to assist you.'}
              </p>
            </motion.div>

            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#111723] rounded-2xl p-6 shadow-lg border border-[#E6C200]/20 hover:shadow-2xl card-hover"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-[#E6C200] to-[#FFD700] p-3 rounded-xl glow-gold">
                      <info.icon className="w-6 h-6 text-[#0D1B2A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#E6C200] mb-2">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-[#D9E1E8]">
                          {info.link && i === 0 ? (
                            <a
                              href={info.link}
                              className="hover:text-[#FFD700] transition-colors"
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#E6C200] to-[#FFD700] rounded-2xl p-8 text-[#0D1B2A] shadow-lg glow-gold"
            >
              <h3 className="text-2xl font-bold mb-4">{language === 'ar' ? 'تفضّل الدردشة الفورية؟' : 'Prefer Instant Chat?'}</h3>
              <p className="text-[#1B263B] mb-6">
                {language === 'ar' ? 'تواصل معنا عبر واتساب لمساعدة فورية' : 'Connect with us on WhatsApp for immediate assistance'}
              </p>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#0D1B2A] text-[#E6C200] hover:bg-[#1B263B] w-full border border-[#E6C200]">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'الدردشة على واتساب' : 'Chat on WhatsApp'}
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111723] rounded-2xl p-8 shadow-lg border border-[#E6C200]/20"
            >
              <h2 className="text-3xl font-bold text-[#E6C200] mb-6">{language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6C200]/20 rounded-full mb-4">
                    <Send className="w-8 h-8 text-[#E6C200]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{language === 'ar' ? 'تم إرسال الرسالة!' : 'Message Sent!'}</h3>
                  <p className="text-[#D9E1E8]">
                    {language === 'ar' ? 'شكراً لتواصلك معنا. سنعاود الاتصال بك قريباً.' : "Thank you for contacting us. We'll get back to you shortly."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={language === 'ar' ? 'محمد أحمد' : 'John Doe'}
                      className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={language === 'ar' ? 'mohamed@example.com' : 'john@example.com'}
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#D9E1E8] mb-2">
                        {language === 'ar' ? 'الهاتف' : 'Phone'}
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'ar' ? '+1 (234) 567-890' : '+1 (234) 567-890'}
                        className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D9E1E8] mb-2">{language === 'ar' ? 'الموضوع *' : 'Subject *'}</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={language === 'ar' ? 'كيف نقدر نساعدك؟' : 'How can we help you?'}
                      className="bg-[#0D1B2A] border-[#E6C200]/30 text-[#D9E1E8] placeholder:text-[#8B9EB3]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#D9E1E8] mb-2">{language === 'ar' ? 'الرسالة *' : 'Message *'}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-[#E6C200]/30 bg-[#0D1B2A] text-[#D9E1E8] placeholder:text-[#8B9EB3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6C200] focus:border-[#E6C200]"
                      placeholder={language === 'ar' ? 'أخبرنا المزيد عن استفسارك...' : 'Tell us more about your inquiry...'}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] hover:from-[#F5E6A3] hover:to-[#D4AF37] text-[#0D1B2A] text-lg py-6 font-semibold glow-gold transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95"
                  >
                    <Send className="w-5 h-5 mr-2 transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
                    {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">{language === 'ar' ? 'زر معرضنا' : 'Visit Our Showroom'}</h2>
          <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/20 p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237499.07953311584!2d39.03804932523799!3d21.485810609524404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0xe059579737b118db!2sJeddah%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1729180000000!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LuxeDrive Location - Jeddah"
              className="rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

