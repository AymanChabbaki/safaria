/**
 * ============================================================
 * SAFARIA Platform - Artisanat Details Page
 * ============================================================
 * Premium artisan details with gallery and 360° viewer
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Viewer } from '@photo-sphere-viewer/core';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import useAppStore from "../../store/useAppStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";
import { getImageUrl } from '../../utils/imageHelper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@photo-sphere-viewer/core/index.css';

const ArtisanatDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show360, setShow360] = useState(false);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await api.artisans.getById(id);
        setArtisan(response.data);
      } catch (error) {
        console.error('Error fetching artisan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [id]);

  const images360 = artisan?.images360 ? (typeof artisan.images360 === 'string' ? JSON.parse(artisan.images360) : artisan.images360) : [];

  useEffect(() => {
    if (show360 && images360[0]) {
      const viewer = new Viewer({
        container: document.querySelector('#viewer-360'),
        panorama: getImageUrl(images360[0]),
        navbar: ['zoom', 'fullscreen']
      });
      return () => viewer.destroy();
    }
  }, [show360, images360]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <FaSpinner className="text-6xl text-chefchaouen-500 animate-spin" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <p className="text-xl text-gray-600">Artisan non trouvé</p>
      </div>
    );
  }

  const photos = artisan.images ? (typeof artisan.images === 'string' ? JSON.parse(artisan.images) : artisan.images) : [];

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-morocco-red to-desert-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-4">{artisan.name}</h1>
            <p className="text-xl flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              {artisan.region}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & 360 */}
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
                  autoplay={{ delay: 3000 }}
                  className="h-96"
                >
                  {photos.map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={getImageUrl(photo)}
                        alt={`${artisan.name} ${idx + 1}`}
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
                <div id="viewer-360" className="w-full h-full"></div>
              </motion.div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-desert-800 mb-4">
                {t(language, 'details.about')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {artisan.description}
              </p>

              {artisan.specialty && (
                <div className="mt-6 p-4 bg-sand-100 rounded-xl">
                  <h3 className="font-semibold text-desert-700 mb-2">
                    {t(language, 'details.specialty')}
                  </h3>
                  <p className="text-gray-700">{artisan.specialty}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-4"
            >
              <h3 className="text-2xl font-bold text-desert-800 mb-6">
                {t(language, 'details.contact')}
              </h3>

              <div className="space-y-4">
                {artisan.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-chefchaouen-100 rounded-full flex items-center justify-center">
                      <FaPhone className="text-chefchaouen-600" />
                    </div>
                    <a
                      href={`tel:${artisan.phone}`}
                      className="text-gray-700 hover:text-chefchaouen-600 transition"
                    >
                      {artisan.phone}
                    </a>
                  </div>
                )}

                {artisan.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-oasis-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-oasis-600" />
                    </div>
                    <a
                      href={`mailto:${artisan.email}`}
                      className="text-gray-700 hover:text-oasis-600 transition"
                    >
                      {artisan.email}
                    </a>
                  </div>
                )}

                {artisan.region && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-desert-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-desert-600" />
                    </div>
                    <span className="text-gray-700">{artisan.region}</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate(`/reservation?type=artisan&id=${id}`)}
                className="w-full mt-6 py-4 bg-gradient-to-r from-morocco-red to-morocco-gold text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>{t(language, 'details.order')}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanatDetailsPage;


