/**
 * ============================================================
 * SAFARIA Platform - Reservation Page
 * ============================================================
 * Reservation form with date picker and auto-fill
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';
import useAppStore from '../../store/useAppStore';
import useAuthStore from "../../store/useAuthStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";

import 'react-datepicker/dist/react-datepicker.css';

const ReservationPage = () => {
  const { language } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    itemType: searchParams.get('type') || '',
    itemId: searchParams.get('id') || '',
    startDate: null,
    endDate: null,
    guests: 1,
    email: user?.email || '',
    phone: user?.phone || '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startDate || !formData.endDate) {
      setError(t(language, 'reservation.errors.dates'));
      return;
    }

    setLoading(true);

    try {
      await api.reservations.create({
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/reservation');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || t(language, 'reservation.errors.failed'));
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    artisan: '🎨 Artisan',
    sejour: '🏠 Séjour',
    caravane: '🐪 Caravane'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-chefchaouen-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-chefchaouen-500 to-desert-500 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{t(language, 'reservation.title')}</h1>
            <p className="text-white/90">{t(language, 'reservation.subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Item Type & ID (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t(language, 'reservation.type')}
                </label>
                <input
                  type="text"
                  value={typeLabels[formData.itemType] || formData.itemType}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl font-medium text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID
                </label>
                <input
                  type="text"
                  value={formData.itemId}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  {t(language, 'reservation.startDate')}
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                  placeholderText="Sélectionner..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  {t(language, 'reservation.endDate')}
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  minDate={formData.startDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                  placeholderText="Sélectionner..."
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUsers className="inline mr-2" />
                {t(language, 'reservation.guests')}
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  {t(language, 'reservation.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  {t(language, 'reservation.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t(language, 'reservation.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                placeholder={t(language, 'reservation.messagePlaceholder')}
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-chefchaouen-500 to-desert-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t(language, 'reservation.submitting')}
                </span>
              ) : (
                t(language, 'reservation.submit')
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center"
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {t(language, 'reservation.success.title')}
              </h2>
              <p className="text-gray-600">
                {t(language, 'reservation.success.message')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationPage;
