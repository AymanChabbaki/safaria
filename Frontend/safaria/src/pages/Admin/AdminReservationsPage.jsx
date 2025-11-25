/**
 * ============================================================
 * SAFARIA Platform - Admin Reservations Page
 * ============================================================
 * Reservations management UI (view & manage)
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../../utils/api";

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchReservations();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800">📅 Gestion des Réservations</h1>
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
                    {reservation.itemType}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{reservation.email}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-chefchaouen-100 text-chefchaouen-600 rounded-lg hover:bg-chefchaouen-200 transition">
                      <FaEye />
                    </button>
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                      <FaCheck />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <FaTimes />
                    </button>
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
    </div>
  );
};

export default AdminReservationsPage;
