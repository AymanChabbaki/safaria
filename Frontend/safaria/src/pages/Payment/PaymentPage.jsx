/**
 * ============================================================
 * SAFARIA Platform - Payment Page (Mock Stripe-like)
 * ============================================================
 * Secure payment processing interface
 * ============================================================
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Lock, Calendar, Shield, CheckCircle, 
  ArrowLeft, User, Mail, Phone, MapPin 
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';

const PaymentPage = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationData } = location.state || {};

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });

  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!reservationData) {
    navigate('/map');
    return null;
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setCardData({ ...cardData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardData({ ...cardData, expiryDate: value });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create payment and reservation in backend
      const response = await api.payments.process({
        reservationData,
        payment: {
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardHolder: cardData.cardHolder,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          billingAddress: cardData.billingAddress
        }
      });

      // Show success animation
      setShowSuccess(true);

      // Download PDF receipt
      setTimeout(async () => {
        const pdfBlob = await api.payments.downloadReceipt(response.data.reservationId);
        
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SAFARIA_Receipt_${response.data.receiptNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        // Navigate to reservations page
        setTimeout(() => {
          navigate('/reservation');
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Payment failed. Please try again.';
      alert(errorMessage);
      setProcessing(false);
    }
  };

  const totalPrice = reservationData.totalPrice || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-chefchaouen-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {t(language, 'common.back')}
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">SAFARIA Payment</h1>
                </div>
                <p className="text-white/90 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t(language, 'payment.securePayment')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(language, 'payment.cardNumber')}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition text-lg font-mono"
                    />
                  </div>
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(language, 'payment.cardHolder')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                      placeholder="JOHN DOE"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition text-lg uppercase"
                    />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t(language, 'payment.expiryDate')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition text-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t(language, 'payment.cvv')}
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      required
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition text-lg font-mono text-center"
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(language, 'payment.billingAddress')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      value={cardData.billingAddress}
                      onChange={(e) => setCardData({ ...cardData, billingAddress: e.target.value })}
                      placeholder={t(language, 'payment.addressPlaceholder')}
                      required
                      rows="3"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    {t(language, 'payment.securityNotice')}
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={processing}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      {t(language, 'payment.processing')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      {t(language, 'payment.payNow')} {totalPrice} DH
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t(language, 'payment.orderSummary')}
              </h2>

              {/* Item Details */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                {reservationData.itemImage && (
                  <img 
                    src={reservationData.itemImage} 
                    alt={reservationData.itemName}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-800">{reservationData.itemName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{reservationData.startDate} - {reservationData.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{reservationData.guests} {t(language, 'payment.guests')}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{reservationData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{reservationData.phone}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>{t(language, 'payment.subtotal')}</span>
                  <span className="font-semibold">{reservationData.subtotal || totalPrice} DH</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t(language, 'payment.serviceFee')}</span>
                  <span className="font-semibold">{reservationData.serviceFee || 0} DH</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t(language, 'payment.taxes')}</span>
                  <span className="font-semibold">{reservationData.taxes || 0} DH</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{t(language, 'payment.total')}</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {totalPrice} DH
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t(language, 'payment.success')}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {t(language, 'payment.successMessage')}
              </p>
              <p className="text-sm text-gray-500">
                {t(language, 'payment.downloadingReceipt')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;
