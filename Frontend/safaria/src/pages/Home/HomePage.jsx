/**
 * ============================================================
 * SAFARIA Platform - Home Page
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { MapPin, Palette, Home as HomeIcon, Tent, Users, Star, Globe, Heart, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '../../components/PageContainer';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageHelper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './HomePage.css';

const HomePage = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  // Rotating hero texts - translated
  const heroTexts = [
    t(language, 'home.heroText1'),
    t(language, 'home.heroText2'),
    t(language, 'home.heroText3'),
    t(language, 'home.heroText4')
  ];

  // Rotate hero text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured places from database
  useEffect(() => {
    const fetchFeaturedPlaces = async () => {
      try {
        const [artisans, sejours, caravanes] = await Promise.all([
          api.artisans.getAll(),
          api.sejours.getAll(),
          api.caravanes.getAll()
        ]);

        // Combine all places and take first 6
        const allPlaces = [
          ...(artisans.data || []).slice(0, 2).map(item => ({ ...item, type: 'artisan' })),
          ...(sejours.data || []).slice(0, 2).map(item => ({ ...item, type: 'sejour' })),
          ...(caravanes.data || []).slice(0, 2).map(item => ({ ...item, type: 'caravane' }))
        ];

        setFeaturedPlaces(allPlaces.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured places:', error);
      }
    };

    fetchFeaturedPlaces();
  }, []);

  // Real Morocco tourism images
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920',
      title: 'Chefchaouen Blue City'
    },
    {
      url: 'https://images.unsplash.com/photo-1511974212900-d7b4d1f8e9d5?w=1920',
      title: 'Sahara Desert'
    },
    {
      url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1920',
      title: 'Marrakech Medina'
    },
    {
      url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1920',
      title: 'Traditional Crafts'
    },
    {
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920',
      title: 'Atlas Mountains'
    }
  ];

  // Statistics - translated
  const stats = [
    { icon: Users, value: '5000+', label: t(language, 'home.stats.visitors') },
    { icon: Star, value: '4.9/5', label: t(language, 'home.stats.rating') },
    { icon: Globe, value: '50+', label: t(language, 'home.stats.destinations') },
    { icon: Award, value: '100+', label: t(language, 'home.stats.artisans') }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sophie Martin',
      country: 'France',
      image: 'https://i.pravatar.cc/150?img=1',
      text: 'Une expérience inoubliable ! Les artisans sont incroyablement talentueux et accueillants.',
      rating: 5
    },
    {
      name: 'John Smith',
      country: 'USA',
      image: 'https://i.pravatar.cc/150?img=12',
      text: 'The desert caravan was magical. Best trip of my life!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      country: 'Spain',
      image: 'https://i.pravatar.cc/150?img=5',
      text: 'Alojamiento auténtico y cultura fascinante. ¡Volveré pronto!',
      rating: 5
    }
  ];

  return (
    <div className="home-page relative">
      {/* Moroccan Map Background - Fixed after hero */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            transparent 90vh, 
            rgba(255, 255, 255, 0.85) 90vh, 
            rgba(255, 255, 255, 0.85) 100%)`,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/Carte du Maroc  avec regi-vector.ma.svg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            opacity: '0.1',
            filter: 'blur(0.5px)',
          }}
        />
      </div>

      {/* Hero Section with Carousel */}
      <section className="relative h-[90vh] w-full overflow-hidden z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-morocco-red',
          }}
          loop={true}
          className="h-full w-full"
        >
          {heroImages.map((image, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-full w-full">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 text-center">
            {/* Animated Hero Title */}
            <div className="h-28 md:h-36 mb-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={heroTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl"
                >
                  {heroTexts[heroTextIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/95 mb-10 drop-shadow-lg"
            >
              {t(language, 'home.heroSubtitle') || 'Artisanat traditionnel, séjours culturels et caravanes dans le désert'}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/map" 
                className="inline-flex items-center gap-2 bg-morocco-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <MapPin className="w-5 h-5" />
                {t(language, 'home.exploreMap') || 'Explorer la Carte'}
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-chefchaouen-600 font-bold py-4 px-8 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Tent className="w-5 h-5" />
                {t(language, 'home.startAdventure') || 'Commencer l\'Aventure'}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <PageContainer>
        <section className="py-20 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
          >
            {t(language, 'home.ourExperiences') || 'Nos Expériences'}
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/artisanat')}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-morocco-red to-red-600 p-4 rounded-full">
                  <Palette className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {t(language, 'home.localCrafts') || 'Artisanat Local'}
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {t(language, 'home.localCraftsDesc') || 'Rencontrez des artisans passionnés et découvrez l\'artisanat marocain authentique.'}
              </p>
              <div className="block text-center text-morocco-red hover:text-red-700 font-semibold transition-colors">
                {t(language, 'home.discover') || 'Découvrir'} →
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate('/sejours')}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-chefchaouen-500 to-chefchaouen-600 p-4 rounded-full">
                  <HomeIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {t(language, 'home.culturalStays') || 'Séjours Culturels'}
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {t(language, 'home.culturalStaysDesc') || 'Vivez une immersion totale dans la culture marocaine avec nos hébergements traditionnels.'}
              </p>
              <div className="block text-center text-chefchaouen-600 hover:text-chefchaouen-700 font-semibold transition-colors">
                {t(language, 'home.explore') || 'Explorer'} →
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/caravanes')}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-desert-500 to-sand-600 p-4 rounded-full">
                  <Tent className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {t(language, 'home.desertCaravans') || 'Caravanes Désert'}
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {t(language, 'home.desertCaravansDesc') || 'Partez à l\'aventure dans le désert du Sahara pour une expérience inoubliable.'}
              </p>
              <div className="block text-center text-desert-600 hover:text-desert-700 font-semibold transition-colors">
                {t(language, 'home.book') || 'Réserver'} →
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-desert-50 to-sand-50 rounded-3xl my-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-morocco-red to-desert-600 p-4 rounded-full">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Morocco Map Section */}
        <section className="py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              {t(language, 'home.mapSection.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(language, 'home.mapSection.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 overflow-hidden"
          >
            <img 
              src="/cartt.jpeg" 
              alt="Morocco Map"
              className="w-full h-96 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <Link 
                to="/map"
                className="inline-flex items-center gap-2 bg-morocco-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MapPin className="w-5 h-5" />
                {t(language, 'home.mapSection.viewMap')}
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800"
          >
            {t(language, 'home.testimonials.title')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.country}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-morocco-gold fill-morocco-gold" />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Places Section */}
        <section className="py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t(language, 'home.featuredPlaces.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t(language, 'home.featuredPlaces.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPlaces.map((place, idx) => (
              <motion.div
                key={`${place.type}-${place.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  to={`/${place.type}/${place.id}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img 
                      src={getImageUrl(place.images?.[0])}
                      alt={place.name_fr || place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-chefchaouen-600">
                      {place.type === 'artisan' && <Palette className="w-4 h-4 inline mr-1" />}
                      {place.type === 'sejour' && <HomeIcon className="w-4 h-4 inline mr-1" />}
                      {place.type === 'caravane' && <Tent className="w-4 h-4 inline mr-1" />}
                      {place.type === 'artisan' ? t(language, 'home.featuredPlaces.artisan') : place.type === 'sejour' ? t(language, 'home.featuredPlaces.sejour') : t(language, 'home.featuredPlaces.caravane')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-chefchaouen-600 transition-colors">
                      {place[`name_${language}`] || place.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {place[`description_${language}`] || place.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-morocco-red">
                        {place.price} DH
                      </span>
                      <span className="text-chefchaouen-600 group-hover:translate-x-2 transition-transform">
                        {t(language, 'home.featuredPlaces.viewDetails')} →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link 
              to="/experiences"
              className="inline-flex items-center gap-2 bg-chefchaouen-600 hover:bg-chefchaouen-700 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t(language, 'home.featuredPlaces.seeMore')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-r from-chefchaouen-600 via-chefchaouen-500 to-oasis-500 rounded-3xl text-center text-white shadow-2xl my-20 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white/90" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t(language, 'home.finalCta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-10 text-white/90 max-w-2xl mx-auto"
          >
            {t(language, 'home.finalCta.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/map" 
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-chefchaouen-600 font-bold py-4 px-10 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              {t(language, 'home.finalCta.explore')}
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 bg-morocco-red hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              {t(language, 'home.finalCta.register')}
            </Link>
          </motion.div>
        </motion.section>
      </PageContainer>
    </div>
  );
};

export default HomePage;


