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
  FaUser
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 70 }}
        className="bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen overflow-hidden"
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-morocco-red to-desert-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">SAFARIA</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0 text-gray-600"
          >
            {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-morocco-red to-desert-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu - Fixed height, no scroll */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-morocco-red text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`text-lg flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-morocco-red'}`} />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-medium text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="px-3 py-3 border-t border-gray-200 space-y-1 flex-shrink-0">
          <button
            onClick={() => navigate('/admin/profile')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all group"
          >
            <FaUser className="text-lg flex-shrink-0 text-gray-600 group-hover:text-morocco-red" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium text-sm"
              >
                Profile
              </motion.span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group"
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium text-sm"
              >
                Déconnexion
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
