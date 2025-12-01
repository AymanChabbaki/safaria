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
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimes
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import api from '../../utils/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    artisans: 0,
    sejours: 0,
    caravanes: 0,
    reservations: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
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

        const reservations = reservationsRes.data || [];
        const pending = reservations.filter(r => r.status === 'pending').length;
        const confirmed = reservations.filter(r => r.status === 'confirmed').length;
        const cancelled = reservations.filter(r => r.status === 'cancelled').length;

        setStats({
          artisans: artisansRes.data?.length || 0,
          sejours: sejoursRes.data?.length || 0,
          caravanes: caravanesRes.data?.length || 0,
          reservations: reservations.length,
          pending,
          confirmed,
          cancelled
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data
  const itemsData = [
    { name: 'Artisans', value: stats.artisans, color: '#DC2626' },
    { name: 'Séjours', value: stats.sejours, color: '#059669' },
    { name: 'Caravanes', value: stats.caravanes, color: '#D97706' }
  ];

  const reservationStatusData = [
    { name: 'En attente', value: stats.pending, color: '#F59E0B' },
    { name: 'Confirmé', value: stats.confirmed, color: '#10B981' },
    { name: 'Annulé', value: stats.cancelled, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jan', reservations: 12, items: 5 },
    { month: 'Fév', reservations: 19, items: 8 },
    { month: 'Mar', reservations: 15, items: 6 },
    { month: 'Avr', reservations: 25, items: 12 },
    { month: 'Mai', reservations: 22, items: 9 },
    { month: 'Jun', reservations: 30, items: 15 }
  ];

  const statCards = [
    {
      title: 'Total Artisans',
      value: stats.artisans,
      icon: FaPalette,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      link: '/admin/artisans',
      change: '+12%',
      isIncrease: true
    },
    {
      title: 'Total Séjours',
      value: stats.sejours,
      icon: FaHome,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      link: '/admin/sejours',
      change: '+8%',
      isIncrease: true
    },
    {
      title: 'Total Caravanes',
      value: stats.caravanes,
      icon: FaHiking,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      link: '/admin/caravanes',
      change: '+5%',
      isIncrease: true
    },
    {
      title: 'Réservations',
      value: stats.reservations,
      icon: FaCalendarCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      link: '/admin/reservations',
      change: '+23%',
      isIncrease: true
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
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de Bord
        </h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre plateforme Safaria</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const ChangeIcon = card.isIncrease ? FaArrowUp : FaArrowDown;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={card.link}
                className={`block bg-white rounded-xl border ${card.borderColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`text-2xl ${card.iconColor}`} />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${card.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    <ChangeIcon className="mr-1" />
                    {card.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des Éléments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={itemsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {itemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reservation Status Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Réservations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reservationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {reservationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances Mensuelles</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reservations" fill="#3B82F6" name="Réservations" />
            <Bar dataKey="items" fill="#10B981" name="Nouveaux Éléments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reservation Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annulées</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FaTimes className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/artisans"
            className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaPalette className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouvel Artisan</p>
          </Link>

          <Link
            to="/admin/sejours"
            className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaHome className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouveau Séjour</p>
          </Link>

          <Link
            to="/admin/caravanes"
            className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaHiking className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Nouvelle Caravane</p>
          </Link>

          <Link
            to="/admin/reservations"
            className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all text-center"
          >
            <FaCalendarCheck className="text-3xl mx-auto mb-2" />
            <p className="font-semibold">Voir Réservations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
