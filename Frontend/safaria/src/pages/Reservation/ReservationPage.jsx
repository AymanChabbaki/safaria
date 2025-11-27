/**
 * ============================================================
 * SAFARIA Platform - Reservation Page
 * ============================================================
 * Enhanced reservation form with item details and payment integration
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Mail, Phone, MessageSquare, 
  ArrowRight, Clock, CreditCard, MapPin, Star,
  Sparkles, CheckCircle, AlertCircle, Palette, Home, Mountain
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAuthStore from "../../store/useAuthStore";
import { t } from "../../utils/i18n";
import api from "../../utils/api";
import { getCity } from '../../utils/cityExtractor';

import 'react-datepicker/dist/react-datepicker.css';

const ReservationPage = () => {
  const { language } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get item data from navigation state
  const itemData = location.state || {};

  const [formData, setFormData] = useState({
    itemType: itemData.itemType || '',
    itemId: itemData.itemId || '',
    itemName: itemData.itemName || '',
    itemPrice: itemData.itemPrice || 0,
    startDate: null,
    endDate: null,
    guests: 1,
    email: user?.email || '',
    phone: user?.phone || '',
    message: ''
  });

  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!formData.itemId || !formData.itemType) {
        setLoadingItem(false);
        return;
      }

      try {
        let response;
        const itemType = formData.itemType;
        
        if (itemType === 'artisan' || itemType === 'artisanat') {
          response = await api.artisans.getById(formData.itemId, language);
        } else if (itemType === 'sejour') {
          response = await api.sejours.getById(formData.itemId, language);
        } else if (itemType === 'caravane') {
          response = await api.caravanes.getById(formData.itemId, language);
        }

        if (response && response.data) {
          const item = response.data.data || response.data;
          setItemDetails(item);
          setFormData(prev => ({
            ...prev,
            itemName: item.name || item.title,
            itemPrice: item.price_per_night || item.price_per_person || item.price || 0
          }));
        }
      } catch (err) {
        console.error('Error fetching item:', err);
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItemDetails();
  }, [formData.itemId, formData.itemType, language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startDate || !formData.endDate) {
      setError(t(language, 'reservation.selectDates'));
      return;
    }

    // Calculate days and total
    const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24));
    const subtotal = formData.itemPrice * days * formData.guests;
    const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
    const taxes = Math.round(subtotal * 0.05); // 5% taxes
    const totalPrice = subtotal + serviceFee + taxes;

    // Navigate to payment page with reservation data
    navigate('/payment', {
      state: {
        reservationData: {
          itemType: formData.itemType,
          itemId: formData.itemId,
          itemName: formData.itemName,
          itemPrice: formData.itemPrice,
          itemImage: itemDetails?.main_image ? `http://localhost:5000${itemDetails.main_image}` : null,
          checkIn: formData.startDate.toISOString().split('T')[0], // Backend expects YYYY-MM-DD
          checkOut: formData.endDate.toISOString().split('T')[0], // Backend expects YYYY-MM-DD
          startDate: formData.startDate.toLocaleDateString(), // For display
          endDate: formData.endDate.toLocaleDateString(), // For display
          guests: formData.guests,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.message, // Backend expects specialRequests
          message: formData.message, // Keep for display
          days,
          subtotal,
          serviceFee,
          taxes,
          total: totalPrice, // Backend expects total
          totalPrice // Keep for display
        }
      }
    });
  };

  const typeLabels = {
    artisan: t(language, 'map.filters.artisan'),
    artisanat: t(language, 'map.filters.artisan'),
    sejour: t(language, 'map.filters.sejour'),
    caravane: t(language, 'map.filters.caravane')
  };

  const typeIcons = {
    artisan: <Palette className="w-8 h-8 text-purple-600" />,
    artisanat: <Palette className="w-8 h-8 text-purple-600" />,
    sejour: <Home className="w-8 h-8 text-blue-600" />,
    caravane: <Mountain className="w-8 h-8 text-orange-600" />
  };

  // Calculate price preview
  const days = formData.startDate && formData.endDate 
    ? Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = formData.itemPrice * days * formData.guests;
  const serviceFee = Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + serviceFee + taxes;

  if (loadingItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-50 via-white to-chefchaouen-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-chefchaouen-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-chefchaouen-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-chefchaouen-500 via-chefchaouen-600 to-desert-500 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8" />
                  <h1 className="text-4xl font-bold">{t(language, 'reservation.completeBooking')}</h1>
                </div>
                <p className="text-white/90">{t(language, 'reservation.almostThere')}</p>
              </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Item Details Card */}
            {itemDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-chefchaouen-50 to-blue-50 p-6 rounded-2xl border-2 border-chefchaouen-200"
              >
                <div className="flex items-start gap-4">
                  {itemDetails.main_image && (
                    <img 
                      src={`http://localhost:5000${itemDetails.main_image}`}
                      alt={formData.itemName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {typeIcons[formData.itemType]}
                      <span className="px-3 py-1 bg-chefchaouen-200 text-chefchaouen-800 rounded-full text-sm font-semibold">
                        {typeLabels[formData.itemType]}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.itemName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{getCity(itemDetails)}, Morocco</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Date Range Picker */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-chefchaouen-600" />
                {t(language, 'reservation.selectDates')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(language, 'reservation.checkIn')}
                  </label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition text-lg"
                    placeholderText={t(language, 'reservation.selectDate')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(language, 'reservation.checkOut')}
                  </label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    minDate={formData.startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition text-lg"
                    placeholderText={t(language, 'reservation.selectDate')}
                  />
                </div>
              </div>
              {days > 0 && (
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {days} {days === 1 ? t(language, 'reservation.night') : t(language, 'reservation.nights')}
                </p>
              )}
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-chefchaouen-600" />
                {t(language, 'reservation.numberOfGuests')}
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition text-lg font-semibold"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t(language, 'reservation.contactInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-chefchaouen-600" />
                    {t(language, 'reservation.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-chefchaouen-600" />
                    {t(language, 'reservation.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-chefchaouen-600" />
                {t(language, 'reservation.specialRequests')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-chefchaouen-500 focus:outline-none transition"
                placeholder={t(language, 'reservation.requestsPlaceholder')}
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !formData.startDate || !formData.endDate}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-5 bg-gradient-to-r from-chefchaouen-500 via-chefchaouen-600 to-desert-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  {t(language, 'reservation.processing')}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {t(language, 'reservation.proceedToPayment')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

          {/* Price Summary - Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t(language, 'reservation.priceSummary')}
              </h2>

              {days > 0 && (
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>{formData.itemPrice} DH × {days} {days === 1 ? t(language, 'reservation.night') : t(language, 'reservation.nights')}</span>
                    <span className="font-semibold">{subtotal} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t(language, 'reservation.serviceFee')}</span>
                    <span className="font-semibold">{serviceFee} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t(language, 'reservation.taxes')}</span>
                    <span className="font-semibold">{taxes} DH</span>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-chefchaouen-50 to-desert-50 rounded-xl p-4 border-2 border-chefchaouen-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{t(language, 'reservation.total')}</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-chefchaouen-600 to-desert-600 bg-clip-text text-transparent">
                    {days > 0 ? totalPrice : 0} DH
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">{t(language, 'reservation.freeCancel')}</p>
                  <p className="text-blue-700">{t(language, 'reservation.cancelPolicy')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default ReservationPage;
