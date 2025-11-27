/**
 * ============================================================
 * SAFARIA Platform - Reservation History Page
 * ============================================================
 * User's booking history with filters and statistics
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Users, CreditCard, Download,
  Filter, TrendingUp, DollarSign, MapPinned, Clock,
  CheckCircle, XCircle, AlertCircle, Eye, Package, X, Mail, Phone
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAuthStore from '../../store/useAuthStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';
import { getCity } from '../../utils/cityExtractor';

const HistoryPage = () => {
  const { language } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalSpent: 0,
    favoriteCity: 'Morocco'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchReservations();
  }, [isAuthenticated, navigate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.reservations.getAll();
      const userReservations = response.data || response.data?.data || [];
      
      // Filter reservations for current user
      const myReservations = userReservations.filter(
        r => r.user_email === user?.email
      );
      
      setReservations(myReservations);
      calculateStats(myReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reservationsList) => {
    const total = reservationsList.length;
    const totalSpent = reservationsList.reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0);
    
    // Find most visited city
    const cityCount = {};
    reservationsList.forEach(r => {
      const city = extractCity(r);
      cityCount[city] = (cityCount[city] || 0) + 1;
    });
    
    const favoriteCity = Object.keys(cityCount).reduce((a, b) => 
      cityCount[a] > cityCount[b] ? a : b, 'Morocco'
    );

    setStats({ total, totalSpent, favoriteCity });
  };

  const extractCity = (reservation) => {
    // If itemDetails exist with coordinates, use them
    if (reservation.itemDetails) {
      return getCity(reservation.itemDetails);
    }
    // Otherwise fall back to extracting from name
    return getCity({ name: reservation.item_name });
  };

  const filteredReservations = reservations.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDownloadReceipt = async (reservationId) => {
    try {
      const blob = await api.payments.downloadReceipt(reservationId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SAFARIA_Receipt_${reservationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert(t(language, 'error') || 'Failed to download receipt');
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const filterButtons = [
    { key: 'all', label: t(language, 'history.filters.all'), count: reservations.length },
    { key: 'confirmed', label: t(language, 'history.filters.confirmed'), count: reservations.filter(r => r.status === 'confirmed').length },
    { key: 'completed', label: t(language, 'history.filters.completed'), count: reservations.filter(r => r.status === 'completed').length },
    { key: 'cancelled', label: t(language, 'history.filters.cancelled'), count: reservations.filter(r => r.status === 'cancelled').length },
    { key: 'pending', label: t(language, 'history.filters.pending'), count: reservations.filter(r => r.status === 'pending').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-chefchaouen-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t(language, 'history.title')}
          </h1>
          <p className="text-gray-600">
            {t(language, 'history.subtitle')}
          </p>
        </motion.div>

        {reservations.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center"
          >
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t(language, 'history.noReservations')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t(language, 'history.noReservationsDesc')}
            </p>
            <button
              onClick={() => navigate('/map')}
              className="bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition"
            >
              {t(language, 'history.exploreNow')}
            </button>
          </motion.div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t(language, 'history.totalReservations')}</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t(language, 'history.totalSpent')}</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSpent.toFixed(0)} DH</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MapPinned className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t(language, 'history.favoriteDest')}</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.favoriteCity}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`px-5 py-2 rounded-full font-medium transition ${
                      filter === btn.key
                        ? 'bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {btn.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Reservations List */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredReservations.map((reservation, index) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Status Badge */}
                        <div className="flex items-start gap-4">
                          <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(reservation.status)} flex items-center gap-2`}>
                            {getStatusIcon(reservation.status)}
                            <span className="font-semibold text-sm">
                              {t(language, `history.status.${reservation.status}`)}
                            </span>
                          </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {reservation.item_name}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{extractCity(reservation)}, Morocco</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm uppercase font-medium">
                                  {reservation.item_type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-chefchaouen-600">
                                {parseFloat(reservation.total_price).toFixed(0)} DH
                              </p>
                              <p className="text-xs text-gray-500">{t(language, 'history.totalPaid')}</p>
                            </div>
                          </div>

                          {/* Date & Guest Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500">{t(language, 'history.checkIn')}</p>
                                <p className="font-medium">{new Date(reservation.start_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-red-600" />
                              <div>
                                <p className="text-xs text-gray-500">{t(language, 'history.checkOut')}</p>
                                <p className="font-medium">{new Date(reservation.end_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-gray-500">{t(language, 'history.guests')}</p>
                                <p className="font-medium">{reservation.guests} {reservation.guests > 1 ? t(language, 'history.guests') : t(language, 'history.guest')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <div>
                                <p className="text-xs text-gray-500">{t(language, 'history.nights')}</p>
                                <p className="font-medium">{reservation.days} {reservation.days > 1 ? t(language, 'history.nights') : t(language, 'history.night')}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleDownloadReceipt(reservation.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg transition"
                            >
                              <Download className="w-4 h-4" />
                              {t(language, 'history.downloadReceipt')}
                            </button>
                            <button
                              onClick={() => handleViewDetails(reservation)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition"
                            >
                              <Eye className="w-4 h-4" />
                              {t(language, 'history.viewDetails')}
                            </button>
                          </div>

                          {/* Booked Date */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              {t(language, 'history.bookedOn')} {new Date(reservation.created_at).toLocaleDateString()} 
                              {reservation.transaction_id && (
                                <span className="ml-4">
                                  {t(language, 'history.transactionId')}: <span className="font-mono">{reservation.transaction_id}</span>
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showModal && selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{t(language, 'history.viewDetails')}</h2>
                    <p className="text-blue-100 text-sm">#{selectedReservation.id}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-full transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Status</span>
                  <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(selectedReservation.status)} flex items-center gap-2`}>
                    {getStatusIcon(selectedReservation.status)}
                    <span className="font-semibold">
                      {t(language, `history.status.${selectedReservation.status}`)}
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedReservation.item_name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-chefchaouen-600" />
                      <span>{extractCity(selectedReservation)}, Morocco</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="uppercase font-medium">{selectedReservation.item_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{parseFloat(selectedReservation.item_price).toFixed(0)} DH / {t(language, 'history.night')}</span>
                    </div>
                  </div>
                </div>

                {/* Dates & Guests */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold text-sm">{t(language, 'history.checkIn')}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(selectedReservation.start_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-MA' : 'en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold text-sm">{t(language, 'history.checkOut')}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(selectedReservation.end_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-MA' : 'en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold text-sm">{t(language, 'history.guests')}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedReservation.guests}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold text-sm">{t(language, 'history.nights')}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedReservation.days}</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-chefchaouen-600" />
                    <span>{selectedReservation.user_email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-chefchaouen-600" />
                    <span>{selectedReservation.user_phone}</span>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedReservation.special_requests && (
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                    <p className="text-gray-700 text-sm">{selectedReservation.special_requests}</p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({selectedReservation.days} {selectedReservation.days > 1 ? t(language, 'history.nights') : t(language, 'history.night')})</span>
                    <span className="font-medium">{parseFloat(selectedReservation.subtotal).toFixed(0)} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Service Fee</span>
                    <span className="font-medium">{parseFloat(selectedReservation.service_fee).toFixed(0)} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Taxes</span>
                    <span className="font-medium">{parseFloat(selectedReservation.taxes).toFixed(0)} DH</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-chefchaouen-600">{parseFloat(selectedReservation.total_price).toFixed(0)} DH</span>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  <p>{t(language, 'history.bookedOn')} {new Date(selectedReservation.created_at).toLocaleDateString()}</p>
                  {selectedReservation.transaction_id && (
                    <p className="mt-1">
                      {t(language, 'history.transactionId')}: <span className="font-mono font-semibold">{selectedReservation.transaction_id}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleDownloadReceipt(selectedReservation.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                  >
                    <Download className="w-5 h-5" />
                    {t(language, 'history.downloadReceipt')}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
