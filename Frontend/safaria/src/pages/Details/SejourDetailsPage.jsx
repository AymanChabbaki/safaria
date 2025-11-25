/**
 * ============================================================
 * SAFARIA Platform - Sejour Details Page
 * ============================================================
 * Premium stay details with gallery and booking
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBed, FaWifi, FaParking, FaUtensils, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import useAppStore from "../../store/useAppStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SejourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [sejour, setSejour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSejour = async () => {
      try {
        const response = await api.sejours.getById(id);
        setSejour(response.data);
      } catch (error) {
        console.error('Error fetching sejour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSejour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <FaSpinner className="text-6xl text-chefchaouen-500 animate-spin" />
      </div>
    );
  }

  if (!sejour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <p className="text-xl text-gray-600">Séjour non trouvé</p>
      </div>
    );
  }

  const photos = sejour.photos || [];
  const amenities = [
    { icon: FaBed, label: 'Chambres confortables' },
    { icon: FaWifi, label: 'WiFi gratuit' },
    { icon: FaParking, label: 'Parking gratuit' },
    { icon: FaUtensils, label: 'Petit-déjeuner inclus' }
  ];

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-chefchaouen-600 to-oasis-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-4">{sejour.title}</h1>
            <p className="text-xl flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              {sejour.location}
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
                  autoplay={{ delay: 3500 }}
                  className="h-96"
                >
                  {photos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={`http://localhost:5000${photo}`}
                        alt={`${sejour.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-chefchaouen-800 mb-4">
                {t(language, 'details.description')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {sejour.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-chefchaouen-800 mb-6">
                {t(language, 'details.amenities')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-sand-50 rounded-xl">
                    <amenity.icon className="text-2xl text-chefchaouen-600" />
                    <span className="text-gray-700 font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
                  {t(language, 'details.pricePerNight')}
                </p>
                <p className="text-4xl font-bold text-chefchaouen-600">
                  {sejour.price} DH
                  <span className="text-lg text-gray-500">/nuit</span>
                </p>
              </div>

              {sejour.duration && (
                <div className="mb-6 p-4 bg-sand-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Durée recommandée</p>
                  <p className="text-lg font-semibold text-gray-800">{sejour.duration}</p>
                </div>
              )}

              {/* Booking Button */}
              <button
                onClick={() => navigate(`/reservation?type=sejour&id=${id}`)}
                className="w-full py-4 bg-gradient-to-r from-chefchaouen-500 to-oasis-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <FaCalendarAlt />
                <span>{t(language, 'details.book')}</span>
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                {t(language, 'details.noPrepayment')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SejourDetailsPage;
