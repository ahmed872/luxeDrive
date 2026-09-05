import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Award, Users, TrendingUp, Shield, Target, Heart } from 'lucide-react';

const About = () => {
  const { t, language } = useApp();

  const timeline = [
    { year: '1995', event: 'LuxeDrive founded with a vision to redefine luxury automotive retail' },
    { year: '2005', event: 'Expanded to become the region\'s premier luxury car dealership' },
    { year: '2015', event: 'Awarded "Dealership of the Year" for exceptional customer service' },
    { year: '2020', event: 'Launched digital showroom and online purchasing platform' },
    { year: '2024', event: 'Celebrating 29 years of automotive excellence and innovation' }
  ];

  const team = [
    {
      name: 'James Morrison',
      role: 'Founder & CEO',
      image: 'https://i.pravatar.cc/300?img=12',
      bio: 'With over 30 years in the luxury automotive industry, James leads our vision of excellence.'
    },
    {
      name: 'Sarah Chen',
      role: 'Sales Director',
      image: 'https://i.pravatar.cc/300?img=45',
      bio: 'Sarah brings 15 years of experience in luxury sales and customer relationship management.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Operations Manager',
      image: 'https://i.pravatar.cc/300?img=33',
      bio: 'Michael ensures every vehicle meets our exacting standards of quality and performance.'
    },
    {
      name: 'Emily Watson',
      role: 'Customer Experience Lead',
      image: 'https://i.pravatar.cc/300?img=47',
      bio: 'Emily is dedicated to creating memorable experiences for every client who walks through our doors.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: language === 'ar' ? 'رسالتنا' : 'Our Mission',
      description: language === 'ar'
        ? 'تقديم تجربة سيارات فاخرة لا مثيل لها عبر خدمة استثنائية، وتشكيلة مميزة، والتزام ثابت برضا العملاء.'
        : 'To provide an unparalleled luxury automotive experience through exceptional service, premium selection, and unwavering commitment to customer satisfaction.'
    },
    {
      icon: Heart,
      title: language === 'ar' ? 'رؤيتنا' : 'Our Vision',
      description: language === 'ar'
        ? 'أن نكون الوكيل الأكثر ثقة واحتراماً، ونضع معيار التميز في تجارة السيارات الفاخرة.'
        : 'To be the most trusted and respected luxury car dealership, setting the standard for excellence in the automotive retail industry.'
    }
  ];

  const awards = language === 'ar'
    ? [
      'وكالة السيارات الفاخرة لعام 2023',
      'جائزة التميّز في خدمة العملاء',
      'أفضل بائع سيارات فاخرة',
      'جائزة الابتكار في الصناعة',
      'التميّز في أداء المبيعات',
      'ريادة الاستدامة البيئية'
    ]
    : [
      'Luxury Dealership of the Year 2023',
      'Customer Service Excellence Award',
      'Best Premium Auto Retailer',
      'Industry Innovation Award',
      'Top Sales Performance Recognition',
      'Environmental Sustainability Leader'
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
            <h1 className="text-5xl font-bold mb-6 gradient-text">{language === 'ar' ? 'عن LuxeDrive' : 'About LuxeDrive'}</h1>
            <p className="text-xl text-[#D9E1E8] leading-relaxed">
              {language === 'ar'
                ? 'لما يقارب ثلاثة عقود، ونحن نربط العملاء المميزين بأفخم السيارات في العالم. التزامنا بالتميّز جعلنا اسماً موثوقاً في تجارة السيارات الفاخرة.'
                : "For nearly three decades, we've been connecting discerning clients with the world's finest automobiles. Our commitment to excellence has made us a trusted name in luxury automotive retail."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111723] rounded-2xl p-8 border border-[#E6C200]/20 card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E6C200] to-[#FFD700] rounded-2xl mb-4 glow-gold">
                  <value.icon className="w-8 h-8 text-[#0D1B2A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#E6C200] mb-4">{value.title}</h3>
                <p className="text-[#D9E1E8] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#1B263B]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#E6C200] mb-4">{language === 'ar' ? 'رحلتنا' : 'Our Journey'}</h2>
            <p className="text-[#D9E1E8] text-lg">{language === 'ar' ? 'محطات صنعت إرثنا' : 'Milestones that shaped our legacy'}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-32">
                  <div className="bg-gradient-to-r from-[#E6C200] to-[#FFD700] text-[#0D1B2A] px-4 py-2 rounded-lg font-bold text-center glow-gold">
                    {item.year}
                  </div>
                </div>
                <div className="flex-grow ml-8 bg-[#111723] rounded-xl p-6 shadow-lg border border-[#E6C200]/20">
                  <p className="text-[#D9E1E8]">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#E6C200] mb-4">{language === 'ar' ? 'فريقنا' : 'Meet Our Team'}</h2>
            <p className="text-[#D9E1E8] text-lg">{language === 'ar' ? 'محترفون شغوفون يسعون لرضاك' : 'Passionate professionals dedicated to your satisfaction'}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111723] rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow border border-[#E6C200]/20 card-hover"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#E6C200] mb-1">{member.name}</h3>
                  <p className="text-[#FFD700] font-medium mb-3">{member.role}</p>
                  <p className="text-[#D9E1E8] text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards and Certifications */}
      <section className="py-20 bg-gradient-to-br from-[#1B263B] to-[#0D1B2A] text-white border-t border-[#E6C200]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#E6C200]">{language === 'ar' ? 'جوائز وتقديرات' : 'Awards & Recognition'}</h2>
            <p className="text-[#D9E1E8] text-lg">{language === 'ar' ? 'تكريمٌ لالتزامنا بالتميّز' : 'Honored for our commitment to excellence'}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111723] backdrop-blur-sm rounded-xl p-6 flex items-center space-x-4 border border-[#E6C200]/20 card-hover"
              >
                <Award className="w-8 h-8 text-[#E6C200] flex-shrink-0" />
                <p className="text-[#D9E1E8] font-medium">{award}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, value: '10,000+', label: language === 'ar' ? 'عملاء سعداء' : 'Happy Clients' },
              { icon: Award, value: '29', label: language === 'ar' ? 'سنوات من التميّز' : 'Years of Excellence' },
              { icon: TrendingUp, value: '5,000+', label: language === 'ar' ? 'سيارات مباعة' : 'Vehicles Sold' },
              { icon: Shield, value: '100%', label: language === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E6C200] to-[#FFD700] rounded-2xl mb-4 glow-gold">
                  <stat.icon className="w-8 h-8 text-[#0D1B2A]" />
                </div>
                <p className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-[#D9E1E8]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

