/**
 * ============================================================
 * SAFARIA Platform - Caravane Details Page
 * ============================================================
 * Premium desert caravan details with gallery and booking
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Viewer } from '@photo-sphere-viewer/core';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaClock, FaCalendarAlt, FaHiking, FaSpinner } from 'react-icons/fa';
import useAppStore from "../../store/useAppStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@photo-sphere-viewer/core/index.css';

const CaravaneDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [caravane, setCaravane] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show360, setShow360] = useState(false);

  useEffect(() => {
    const fetchCaravane = async () => {
      try {
        const response = await api.caravanes.getById(id);
        setCaravane(response.data);
      } catch (error) {
        console.error('Error fetching caravane:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaravane();
  }, [id]);

  const images360 = caravane?.images360 ? (typeof caravane.images360 === 'string' ? JSON.parse(caravane.images360) : caravane.images360) : [];

  useEffect(() => {
    if (show360 && images360[0]) {
      const viewer = new Viewer({
        container: document.querySelector('#viewer-360-caravane'),
        panorama: getImageUrl(images360[0]),
        navbar: ['zoom', 'fullscreen']
      });
      return () => viewer.destroy();
    }
  }, [show360, images360]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <FaSpinner className="text-6xl text-desert-500 animate-spin" />
      </div>
    );
  }

  if (!caravane) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <p className="text-xl text-gray-600">Caravane non trouvée</p>
      </div>
    );
  }

  const photos = caravane.images ? (typeof caravane.images === 'string' ? JSON.parse(caravane.images) : caravane.images) : [];
  const highlights = [
    { icon: FaSun, label: 'Coucher de soleil mémorable' },
    { icon: FaMoon, label: 'Nuit sous les étoiles' },
    { icon: FaUsers, label: 'Guide expérimenté' },
    { icon: FaClock, label: 'Transport inclus' }
  ];

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-desert-700 to-sand-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-4">{caravane.title}</h1>
            <p className="text-xl flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              {caravane.destination}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000 }}
                  className="h-96"
                >
                  {photos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={getImageUrl(photo)}
                        alt={`${caravane.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            )}

            {/* 360° Viewer Toggle */}
            {images360.length > 0 && (
              <button
                onClick={() => setShow360(!show360)}
                className="w-full py-3 bg-chefchaouen-500 hover:bg-chefchaouen-600 text-white font-semibold rounded-xl transition"
              >
                {show360 ? '📷 Voir Photos' : '🔄 Vue 360°'}
              </button>
            )}

            {show360 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 500 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div id="viewer-360-caravane" className="w-full h-full"></div>
              </motion.div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-desert-800 mb-4">
                {t(language, 'details.description')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {caravane.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-desert-800 mb-6">
                {t(language, 'details.highlights')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-sand-50 rounded-xl">
                    <highlight.icon className="text-2xl text-desert-600" />
                    <span className="text-gray-700 font-medium">{highlight.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {caravane.itinerary && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-desert-800 mb-4">
                  {t(language, 'details.itinerary')}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{caravane.itinerary}</p>
              </div>
            )}
          </div>

          {/* Right Column - Booking Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-4"
            >
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">
                  {t(language, 'details.pricePerDay')}
                </p>
                <p className="text-4xl font-bold text-desert-600">
                  {caravane.price} DH
                  <span className="text-lg text-gray-500">/jour</span>
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {caravane.duration && (
                  <div className="flex items-center justify-between p-4 bg-sand-50 rounded-xl">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold text-gray-800">{caravane.duration}</span>
                  </div>
                )}

                {caravane.difficulty && (
                  <div className="flex items-center justify-between p-4 bg-sand-50 rounded-xl">
                    <span className="text-gray-600">Difficulté</span>
                    <span className="font-semibold text-gray-800">{caravane.difficulty}</span>
                  </div>
                )}
              </div>

              {/* Booking Button */}
              <button
                onClick={() => navigate(`/reservation?type=caravane&id=${id}`)}
                className="w-full py-4 bg-gradient-to-r from-desert-600 to-sand-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <FaCalendarAlt />
                <span>{t(language, 'details.book')}</span>
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                {t(language, 'details.flexibleDates')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaravaneDetailsPage;


