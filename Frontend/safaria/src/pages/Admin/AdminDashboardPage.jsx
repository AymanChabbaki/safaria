/**
 * ============================================================
 * SAFARIA Platform - Admin Dashboard Page
 * ============================================================
 * Premium admin dashboard with stats and quick actions
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPalette, 
  FaHome, 
  FaHiking, 
  FaCalendarCheck, 
  FaChartLine,
  FaSpinner 
} from 'react-icons/fa';
import api from '../../utils/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    artisans: 0,
    sejours: 0,
    caravanes: 0,
    reservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artisansRes, sejoursRes, caravanesRes, reservationsRes] = await Promise.all([
          api.artisans.getAll(),
          api.sejours.getAll(),
          api.caravanes.getAll(),
          api.reservations.getAll()
        ]);

        setStats({
          artisans: artisansRes.data?.length || 0,
          sejours: sejoursRes.data?.length || 0,
          caravanes: caravanesRes.data?.length || 0,
          reservations: reservationsRes.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Artisans',
      value: stats.artisans,
      icon: FaPalette,
      color: 'morocco-red',
      link: '/admin/artisans'
    },
    {
      title: 'Séjours',
      value: stats.sejours,
      icon: FaHome,
      color: 'oasis',
      link: '/admin/sejours'
    },
    {
      title: 'Caravanes',
      value: stats.caravanes,
      icon: FaHiking,
      color: 'desert',
      link: '/admin/caravanes'
    },
    {
      title: 'Réservations',
      value: stats.reservations,
      icon: FaCalendarCheck,
      color: 'chefchaouen',
      link: '/admin/reservations'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="text-6xl text-chefchaouen-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-desert-800 mb-2">
          Dashboard Administrateur
        </h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme SAFARIA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              to={card.link}
              className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-l-4 border-${card.color}-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
                <div className={`w-16 h-16 bg-${card.color}-100 rounded-2xl flex items-center justify-center`}>
                  <card.icon className={`text-3xl text-${card.color}-600`} />
                </div>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-600">
                <FaChartLine className="mr-2" />
                <span>Voir détails</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions Rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/artisans"
            className="p-4 bg-gradient-to-br from-morocco-red to-red-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaPalette className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouvel Artisan</p>
          </Link>

          <Link
            to="/admin/sejours"
            className="p-4 bg-gradient-to-br from-oasis-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaHome className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouveau Séjour</p>
          </Link>

          <Link
            to="/admin/caravanes"
            className="p-4 bg-gradient-to-br from-desert-500 to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaHiking className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouvelle Caravane</p>
          </Link>

          <Link
            to="/admin/reservations"
            className="p-4 bg-gradient-to-br from-chefchaouen-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaCalendarCheck className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Voir Réservations</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activité Récente</h2>
        <p className="text-gray-600">Les dernières activités seront affichées ici...</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
