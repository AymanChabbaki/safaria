/**
 * ============================================================
 * SAFARIA Platform - Universal Details Page
 * ============================================================
 * Comprehensive details page with 360° viewer, gallery, and booking
 * ============================================================
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Viewer } from '@photo-sphere-viewer/core';
import { 
  MapPin, Phone, Mail, Star, Calendar, Users, Camera, 
  Heart, Share2, ChevronLeft, ArrowRight, Clock, CheckCircle, 
  Palette, Home as HomeIcon, Tent, X, Shield, Award, Sparkles 
} from 'lucide-react';
import useAppStore from "../../store/useAppStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";
import { getCity } from "../../utils/cityExtractor";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import '@photo-sphere-viewer/core/index.css';

const UniversalDetailsPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAppStore();
  
  const [item, setItem] = useState(null);
  const [images360, setImages360] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show360, setShow360] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const viewer360Ref = useRef(null);
  const viewerContainerRef = useRef(null);

  // Determine type from route if not provided
  const itemType = type || location.pathname.split('/')[1]; // artisanat, sejour, caravane

  // Load favorite status from localStorage on mount
  useEffect(() => {
    if (id && itemType) {
      const favorites = JSON.parse(localStorage.getItem('safaria_favorites') || '[]');
      const isFav = favorites.some(fav => fav.id === id && fav.type === itemType);
      setIsFavorite(isFav);
    }
  }, [id, itemType]);

  // Debug logging
  useEffect(() => {
    console.log('360° State:', { 
      show360, 
      has360Images: images360.length > 0,
      images360Count: images360.length,
      containerExists: !!viewerContainerRef.current,
      viewerExists: !!viewer360Ref.current 
    });
  }, [show360, images360]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        
        // Fetch item based on type with language
        switch(itemType) {
          case 'artisan':
          case 'artisanat':
            response = await api.artisans.getById(id, language);
            break;
          case 'sejour':
            response = await api.sejours.getById(id, language);
            break;
          case 'caravane':
            response = await api.caravanes.getById(id, language);
            break;
          default:
            throw new Error('Invalid type');
        }
        
        // Backend returns { success, message, data }, extract the data field
        const itemData = response.data?.data || response.data;
        setItem(itemData);
        
        // Parse 360° images from the images360 column in the main table
        if (itemData?.images360) {
          try {
            const parsed360 = typeof itemData.images360 === 'string' 
              ? JSON.parse(itemData.images360) 
              : itemData.images360;
            
            if (Array.isArray(parsed360) && parsed360.length > 0) {
              // Convert array of URLs to the format expected by the viewer
              const formatted360 = parsed360.map(url => ({ imageUrl: url }));
              setImages360(formatted360);
              console.log('360° images loaded from database:', formatted360);
            }
          } catch (err) {
            console.error('Error parsing 360° images:', err);
          }
        }
        
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, itemType, language]); // Refetch when language changes

  // Initialize 360° viewer when shown
  useEffect(() => {
    if (show360 && images360.length > 0) {
      console.log('360° mode activated, container ref:', viewerContainerRef.current);
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (!viewerContainerRef.current) {
          console.error('Container ref not available');
          return;
        }

        // Destroy existing viewer if any
        if (viewer360Ref.current) {
          console.log('Destroying existing viewer');
          viewer360Ref.current.destroy();
          viewer360Ref.current = null;
        }

        const imageUrl = getImageUrl(images360[0].imageUrl);
        console.log('Initializing 360° viewer with:', {
          imageUrl,
          container: viewerContainerRef.current,
          itemName: item?.name
        });
        
        try {
          viewer360Ref.current = new Viewer({
            container: viewerContainerRef.current,
            panorama: imageUrl,
            caption: item?.name || 'Vue 360°',
            loadingTxt: 'Chargement de la vue 360°...',
            navbar: [
              'zoom',
              'move',
              'download',
              'caption',
              'fullscreen',
            ],
            defaultZoomLvl: 50,
            mousewheel: true,
            mousewheelCtrlKey: false,
            touchmoveTwoFingers: false,
          });
          console.log('✅ 360° viewer initialized successfully!');
        } catch (error) {
          console.error('❌ Error initializing 360° viewer:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Cleanup when hiding 360 view
    if (!show360 && viewer360Ref.current) {
      console.log('Cleaning up 360° viewer');
      viewer360Ref.current.destroy();
      viewer360Ref.current = null;
    }
  }, [show360, images360, item]);

  const handleReserve = () => {
    if (!item) return;
    navigate('/reservation', { 
      state: { 
        itemType, 
        itemId: item.id, 
        itemName: item.name || item.title,
        itemPrice: item.price_per_night || item.price_per_person || item.price
      } 
    });
  };

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Get existing favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('safaria_favorites') || '[]');
    
    if (newFavoriteState) {
      // Add to favorites
      const favoriteItem = {
        id: id,
        type: itemType,
        name: item?.name || item?.title,
        description: item?.description,
        location: item?.location,
        price: item?.price,
        main_image: item?.main_image,
        images: item?.images,
        addedAt: new Date().toISOString()
      };
      favorites.push(favoriteItem);
    } else {
      // Remove from favorites
      const index = favorites.findIndex(fav => fav.id === id && fav.type === itemType);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }
    
    // Save back to localStorage
    localStorage.setItem('safaria_favorites', JSON.stringify(favorites));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.name || item?.title || 'SAFARIA',
          text: item?.description || 'Découvrez cette expérience sur SAFARIA',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-chefchaouen-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50">
        <p className="text-2xl text-gray-600 mb-4">{t(language, 'details.notFound')}</p>
        <button 
          onClick={() => navigate('/map')}
          className="px-6 py-3 bg-chefchaouen-500 text-white rounded-lg hover:bg-chefchaouen-600"
        >
          {t(language, 'common.back')}
        </button>
      </div>
    );
  }

  // Get icon based on type
  const TypeIcon = itemType === 'artisan' || itemType === 'artisanat' ? Palette : 
                   itemType === 'sejour' ? HomeIcon : Tent;

  // Get images array - fallback to main_image if images array is empty
  const images = item.images && item.images.length > 0 
    ? item.images.map(img => getImageUrl(img))
    : item.main_image 
      ? [getImageUrl(item.main_image)]
      : ['/logoSAFARIA.png'];

  const mainImage = images[0];
  
  // Check if item has 360 images
  const has360Images = item.has360 || images360.length > 0;

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Back Button */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-chefchaouen-600 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t(language, 'common.back')}
          </button>
        </div>
      </div>

      {/* 360° Virtual Tour Section - Full Width when Active */}
      <AnimatePresence>
        {show360 && images360.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Close Button */}
            <button
              onClick={() => setShow360(false)}
              className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 360° Title Bar */}
            <div className="absolute top-6 left-6 z-50 bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5" />
                <span className="font-semibold">{t(language, 'details.virtual360')}</span>
                <span className="text-sm opacity-75">- {item.name}</span>
              </div>
            </div>

            {/* Debug Info */}
            <div className="absolute bottom-6 left-6 z-50 bg-black/70 text-white p-4 rounded-lg text-xs">
              <div>Container Ref: {viewerContainerRef.current ? '✓' : '✗'}</div>
              <div>Viewer Ref: {viewer360Ref.current ? '✓' : '✗'}</div>
              <div>Image: {images360[0]?.imageUrl}</div>
            </div>

            {/* 360° Viewer Container */}
            <div 
              ref={viewerContainerRef}
              className="w-full h-full bg-gray-900"
              style={{ position: 'relative' }}
            >
              {!viewer360Ref.current && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>{t(language, 'details.loading360')}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Image Gallery */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Gallery Swiper */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ height: '500px' }}
              >
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  navigation
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  className="h-full w-full"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img 
                        src={image}
                        alt={`${item.name || item.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/logoSAFARIA.png'; }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* 360° Launch Button - Only show if has360Images */}
                {has360Images && (
                  <button
                    onClick={() => setShow360(true)}
                    className="absolute bottom-4 right-4 z-20 bg-chefchaouen-500 hover:bg-chefchaouen-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="font-semibold">{t(language, 'details.view360')}</span>
                  </button>
                )}
                
                {/* Favorite & Share */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg"
                    title={isFavorite ? t(language, 'details.removeFromFavorites') : t(language, 'details.addToFavorites')}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-morocco-red text-morocco-red' : 'text-gray-600'}`} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg"
                    title={t(language, 'details.shareExperience')}
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Thumbnail Gallery - Only show if multiple images */}
              {images.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  watchSlidesProgress
                  className="rounded-xl overflow-hidden"
                  style={{ height: '100px' }}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index} className="cursor-pointer">
                      <img 
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg hover:opacity-75 transition"
                        onError={(e) => { e.target.src = '/logoSAFARIA.png'; }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Details Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Type Badge & Quality Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`p-2 rounded-lg ${
                  itemType === 'artisan' || itemType === 'artisanat' ? 'bg-red-100' :
                  itemType === 'sejour' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  <TypeIcon className={`w-5 h-5 ${
                    itemType === 'artisan' || itemType === 'artisanat' ? 'text-red-600' :
                    itemType === 'sejour' ? 'text-blue-600' : 'text-yellow-600'
                  }`} />
                </div>
                <span className="text-sm font-semibold text-gray-600 uppercase">
                  {itemType === 'artisan' || itemType === 'artisanat' ? 'Artisanat' :
                   itemType === 'sejour' ? 'Séjour' : 'Caravane'}
                </span>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  <Shield className="w-3 h-3" />
                  {t(language, 'details.verified')}
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  <Award className="w-3 h-3" />
                  {t(language, 'details.bestSeller')}
                </motion.div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900">
                {item.name || item.title}
              </h1>

              {/* Rating & Location */}
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-0.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="font-bold text-gray-900 ml-2">4.9</span>
                  <span className="text-gray-500">({Math.floor(Math.random() * 100) + 50} {t(language, 'details.reviews')})</span>
                </motion.div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4 text-morocco-red" />
                  <span className="font-medium">{getCity(item)}, Morocco</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-lg">
                {item.description}
              </p>

              {/* Highlights Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-chefchaouen-50 to-blue-50 p-6 rounded-2xl border border-chefchaouen-100"
              >
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                  <Sparkles className="w-5 h-5 text-chefchaouen-600" />
                  {t(language, 'details.highlights')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm"
                  >
                    <div className="bg-chefchaouen-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-chefchaouen-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t(language, 'details.freeCancellation')}</div>
                      <div className="text-xs text-gray-500">24h avant</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm"
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t(language, 'details.localGuide')}</div>
                      <div className="text-xs text-gray-500">Expérience authentique</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm"
                  >
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t(language, 'details.instantBooking')}</div>
                      <div className="text-xs text-gray-500">Confirmation rapide</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Features */}
              {item.features && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t(language, 'details.whatsIncluded')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.features.split(',').map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <div className="bg-green-100 p-1 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{feature.trim()}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="sticky top-24 bg-gradient-to-br from-chefchaouen-50 via-white to-desert-50 p-8 rounded-2xl border-2 border-chefchaouen-200 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-chefchaouen-600 to-desert-600 bg-clip-text text-transparent">
                        {item.price_per_night || item.price_per_person || item.price || 0}
                      </span>
                      <span className="text-2xl font-bold text-gray-600">DH</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {item.price_per_night ? t(language, 'details.perNight') : item.price_per_person ? t(language, 'details.perPerson') : ''}
                    </span>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>

                {/* Reserve Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReserve}
                  className="w-full bg-gradient-to-r from-chefchaouen-500 via-chefchaouen-600 to-desert-500 text-white font-bold py-5 px-6 rounded-xl hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Calendar className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-lg">{t(language, 'details.bookNow')}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  {t(language, 'details.instantBooking')} • {t(language, 'details.freeCancellation')}
                </p>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default UniversalDetailsPage;


