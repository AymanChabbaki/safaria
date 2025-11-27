/**
 * ============================================================
 * SAFARIA Platform - Navbar Component (Tailwind)
 * ============================================================
 * Responsive navigation with language switcher and auth state
 * ============================================================
 */

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaMapMarkerAlt, FaHome, FaGlobe, FaChevronDown, FaClock, FaCalendarAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { t, languages } from '../utils/i18n';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, language, setLanguage } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setUserMenuOpen(false);
    navigate('/');
  };
  
  const handleNavClick = () => {
    closeMobileMenu();
    setUserMenuOpen(false);
    setLangMenuOpen(false);
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setLangMenuOpen(false);
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];
  
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-chefchaouen-500 via-chefchaouen-600 to-desert-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-90 transition duration-300"
            onClick={handleNavClick}
          >
            <img 
              src="/logoSAFARIA.png" 
              alt="SAFARIA" 
              className="h-20 w-auto drop-shadow-md"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-medium transition duration-300 hover:bg-white/20 ${
                  isActive ? 'bg-white/30' : ''
                }`
              }
              onClick={handleNavClick}
            >
              <FaHome className="text-lg" />
              <span>{t(language, 'nav.home')}</span>
            </NavLink>
            
            <NavLink 
              to="/map" 
              className={({ isActive }) => 
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-medium transition duration-300 hover:bg-white/20 ${
                  isActive ? 'bg-white/30' : ''
                }`
              }
              onClick={handleNavClick}
            >
              <FaMapMarkerAlt className="text-lg" />
              <span>{t(language, 'nav.map')}</span>
            </NavLink>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-medium transition duration-300 hover:bg-white/20"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
              >
                <FaGlobe className="text-lg" />
                <span>{currentLang.flag}</span>
                <FaChevronDown className="text-sm" />
              </button>
              
              {/* Language Dropdown */}
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-sand-100 transition ${
                          lang.code === language ? 'bg-chefchaouen-50 text-chefchaouen-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition duration-300"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <FaUser className="text-lg" />
                  <span>{user?.name || t(language, 'nav.user')}</span>
                  <FaChevronDown className="text-sm" />
                </button>
                
                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                      {isAdmin() && (
                        <Link 
                          to="/admin" 
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sand-100 transition"
                          onClick={handleNavClick}
                        >
                          <FaChartBar className="text-lg" />
                          <span className="font-medium">{t(language, 'nav.admin')}</span>
                        </Link>
                      )}
                      
                      <Link 
                        to="/history" 
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sand-100 transition"
                        onClick={handleNavClick}
                      >
                        <FaCalendarAlt className="text-lg" />
                        <span className="font-medium">{t(language, 'nav.reservation')}</span>
                      </Link>
                      
                      <button 
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-medium">{t(language, 'nav.logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 text-white font-medium hover:bg-white/20 rounded-lg transition duration-300"
                  onClick={handleNavClick}
                >
                  {t(language, 'nav.login')}
                </NavLink>
                
                <NavLink 
                  to="/register" 
                  className="px-5 py-2 bg-morocco-gold hover:bg-morocco-gold/90 text-white font-semibold rounded-lg shadow-md transition duration-300"
                  onClick={handleNavClick}
                >
                  {t(language, 'nav.register')}
                </NavLink>
              </div>
            )}
          </div>
        
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white text-2xl hover:bg-white/20 p-2 rounded-lg transition"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-chefchaouen-700 border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-3">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition ${
                    isActive ? 'bg-white/30' : 'hover:bg-white/20'
                  }`
                }
                onClick={handleNavClick}
              >
                <FaHome />
                <span>{t(language, 'nav.home')}</span>
              </NavLink>
              
              <NavLink 
                to="/map" 
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition ${
                    isActive ? 'bg-white/30' : 'hover:bg-white/20'
                  }`
                }
                onClick={handleNavClick}
              >
                <FaMapMarkerAlt />
                <span>{t(language, 'nav.map')}</span>
              </NavLink>

              {/* Mobile Language Switcher */}
              <div className="pt-2 border-t border-white/20">
                <p className="px-4 py-2 text-white/80 text-sm font-medium">{t(language, 'nav.language')}</p>
                <div className="space-y-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition ${
                        lang.code === language ? 'bg-white/30' : 'hover:bg-white/20'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-white/20 space-y-1">
                  <p className="px-4 py-2 text-white/80 text-sm font-medium">{user?.name}</p>
                  
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition"
                      onClick={handleNavClick}
                    >
                      <FaChartBar className="text-lg" />
                      <span className="font-medium">{t(language, 'nav.admin')}</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/history" 
                    className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition"
                    onClick={handleNavClick}
                  >
                    <FaCalendarAlt className="text-lg" />
                    <span className="font-medium">{t(language, 'nav.reservation')}</span>
                  </Link>
                  
                  <button 
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 rounded-lg hover:bg-red-900/30 transition"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="font-medium">{t(language, 'nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20 space-y-2">
                  <NavLink 
                    to="/login" 
                    className="block px-4 py-3 text-center text-white font-medium bg-white/20 rounded-lg hover:bg-white/30 transition"
                    onClick={handleNavClick}
                  >
                    {t(language, 'nav.login')}
                  </NavLink>
                  
                  <NavLink 
                    to="/register" 
                    className="block px-4 py-3 text-center text-white font-semibold bg-morocco-gold rounded-lg hover:bg-morocco-gold/90 transition"
                    onClick={handleNavClick}
                  >
                    {t(language, 'nav.register')}
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
