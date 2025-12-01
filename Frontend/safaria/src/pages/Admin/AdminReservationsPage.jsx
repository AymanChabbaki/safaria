/**
 * ============================================================
 * SAFARIA Platform - Admin Reservations Page
 * ============================================================
 * Reservations management UI (view & manage)
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { Calendar, X, MapPin, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await api.reservations.getAll();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleView = (reservation) => {
    setSelectedReservation(reservation);
    setShowViewModal(true);
  };

  const handleAccept = async (id) => {
    if (window.confirm('Accepter cette réservation ?')) {
      try {
        await api.reservations.updateStatus(id, 'confirmed');
        fetchReservations();
      } catch (error) {
        console.error('Error accepting reservation:', error);
        alert('Erreur lors de l\'acceptation de la réservation');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir rejeter cette réservation ?')) {
      try {
        await api.reservations.delete(id);
        fetchReservations();
      } catch (error) {
        console.error('Error rejecting reservation:', error);
        alert('Erreur lors du rejet de la réservation');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="text-6xl text-chefchaouen-500 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Calendar className="w-8 h-8" /> Gestion des Réservations
        </h1>
        <p className="text-gray-600 mt-1">Consultez et gérez toutes les réservations</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-sand-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dates</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation, idx) => (
              <motion.tr
                key={reservation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-sand-50 transition"
              >
                <td className="px-6 py-4 text-gray-600">#{reservation.id}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-chefchaouen-100 text-chefchaouen-700 rounded-full text-sm font-medium">
                    {reservation.item_type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{reservation.user_email}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleView(reservation)}
                      className="p-2 bg-chefchaouen-100 text-chefchaouen-600 rounded-lg hover:bg-chefchaouen-200 transition"
                      title="Voir"
                    >
                      <FaEye />
                    </button>
                    {reservation.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAccept(reservation.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Accepter"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleReject(reservation.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Rejeter"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune réservation pour le moment.
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaEye className="w-6 h-6 text-chefchaouen-600" />
                  Détails de la Réservation
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedReservation.status)}`}>
                    {selectedReservation.status}
                  </span>
                  <span className="px-4 py-2 bg-chefchaouen-100 text-chefchaouen-700 rounded-full text-sm font-medium">
                    {selectedReservation.item_type}
                  </span>
                </div>

                {/* Reservation Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom de l'item
                    </p>
                    <p className="font-semibold text-gray-800">{selectedReservation.item_name || 'Non renseigné'}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="font-semibold text-gray-800">{selectedReservation.user_email}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </p>
                    <p className="font-semibold text-gray-800">{selectedReservation.user_phone || 'Non renseigné'}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date de réservation
                    </p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedReservation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-sand-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Période de séjour</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Date de début</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedReservation.start_date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div>
                      <p className="text-sm text-gray-500">Date de fin</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedReservation.end_date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedReservation.special_requests && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">Demandes spéciales</h3>
                    <p className="text-gray-600">{selectedReservation.special_requests}</p>
                  </div>
                )}

                {/* Pricing Info */}
                <div className="bg-morocco-red/5 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3">Détails de tarification</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix de l'item:</span>
                      <span className="font-semibold">{selectedReservation.item_price} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de jours:</span>
                      <span className="font-semibold">{selectedReservation.days} jour(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre d'invités:</span>
                      <span className="font-semibold">{selectedReservation.guests} personne(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-semibold">{selectedReservation.subtotal} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de service:</span>
                      <span className="font-semibold">{selectedReservation.service_fee} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span className="font-semibold">{selectedReservation.taxes} DH</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-gray-800">Total:</span>
                      <span className="font-bold text-morocco-red text-lg">{selectedReservation.total_price} DH</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedReservation.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleAccept(selectedReservation.id);
                        setShowViewModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Accepter
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedReservation.id);
                        setShowViewModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReservationsPage;
