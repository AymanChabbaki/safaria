/**
 * ============================================================
 * SAFARIA Platform - Admin Caravanes Page
 * ============================================================
 * Caravanes management UI (CRUD placeholder)
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Tent } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminCaravanesPage = () => {
  const [caravanes, setCaravanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaravanes = async () => {
      try {
        const response = await api.caravanes.getAll();
        setCaravanes(response.data || []);
      } catch (error) {
        console.error('Error fetching caravanes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaravanes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-desert-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Tent className="w-8 h-8 text-desert-600" />
            Gestion des Caravanes
          </h1>
          <p className="text-gray-600 mt-1">Gérez toutes les caravanes de la plateforme</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-desert-600 to-sand-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Ajouter Caravane</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-sand-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Titre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Destination</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prix/Jour</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Durée</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {caravanes.map((caravane, idx) => (
              <motion.tr
                key={caravane.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-sand-50 transition"
              >
                <td className="px-6 py-4 text-gray-600">#{caravane.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{caravane.title}</td>
                <td className="px-6 py-4 text-gray-600">{caravane.destination}</td>
                <td className="px-6 py-4 text-gray-600">{caravane.price} DH</td>
                <td className="px-6 py-4 text-gray-600">{caravane.duration}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-chefchaouen-100 text-chefchaouen-600 rounded-lg hover:bg-chefchaouen-200 transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {caravanes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune caravane trouvée. Cliquez sur "Ajouter Caravane" pour commencer.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCaravanesPage;
