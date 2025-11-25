/**
 * ============================================================
 * SAFARIA Platform - Admin Layout Component
 * ============================================================
 * AdminLTE-style layout with sidebar navigation
 * ============================================================
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaTachometerAlt, 
  FaPalette, 
  FaHome, 
  FaHiking, 
  FaCalendarCheck,
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';

const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const { language } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      path: '/admin', 
      icon: FaTachometerAlt, 
      label: 'Dashboard', 
      color: 'chefchaouen',
      exact: true 
    },
    { 
      path: '/admin/artisans', 
      icon: FaPalette, 
      label: 'Artisans', 
      color: 'morocco-red' 
    },
    { 
      path: '/admin/sejours', 
      icon: FaHome, 
      label: 'Séjours', 
      color: 'oasis' 
    },
    { 
      path: '/admin/caravanes', 
      icon: FaHiking, 
      label: 'Caravanes', 
      color: 'desert' 
    },
    { 
      path: '/admin/reservations', 
      icon: FaCalendarCheck, 
      label: 'Réservations', 
      color: 'chefchaouen' 
    }
  ];

  return (
    <div className="flex h-screen bg-sand-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gradient-to-b from-desert-800 to-desert-900 text-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold">SAFARIA Admin</h2>
              <p className="text-xs text-white/70">Panel d'administration</p>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-morocco-gold to-morocco-red rounded-full flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 min-w-0"
              >
                <p className="font-semibold truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-white/70 truncate">{user?.email}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <item.icon className="text-xl flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <FaArrowLeft className="text-xl flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium"
              >
                Retour au site
              </motion.span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all"
          >
            <FaSignOutAlt className="text-xl flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium"
              >
                Déconnexion
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
