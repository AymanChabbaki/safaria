/**
 * ============================================================
 * SAFARIA Platform - Navbar Component (Tailwind)
 * ============================================================
 * Responsive navigation with language switcher and auth state
 * ============================================================
 */

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaMapMarkerAlt, FaHome, FaGlobe, FaChevronDown, FaClock, FaCalendarAlt, FaChartBar, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { t, languages } from '../utils/i18n';
import { getImageUrl } from '../utils/imageHelper';

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

            <NavLink 
              to="/experiences" 
              className={({ isActive }) => 
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-medium transition duration-300 hover:bg-white/20 ${
                  isActive ? 'bg-white/30' : ''
                }`
              }
              onClick={handleNavClick}
            >
              <FaGlobe className="text-lg" />
              <span>{t(language, 'nav.experiences')}</span>
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
                  {user?.photo ? (
                    <img 
                      src={user.photo.startsWith('http') ? user.photo : getImageUrl(user.photo)}
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <FaUser className="text-lg" />
                  )}
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
                        to="/profile" 
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sand-100 transition"
                        onClick={handleNavClick}
                      >
                        <FaUser className="text-lg" />
                        <span className="font-medium">{t(language, 'nav.profile')}</span>
                      </Link>
                      
                      <Link 
                        to="/favorites" 
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sand-100 transition"
                        onClick={handleNavClick}
                      >
                        <FaHeart className="text-lg text-red-500" />
                        <span className="font-medium">{t(language, 'nav.favorites')}</span>
                      </Link>
                      
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

      {/* Mobile Menu - Slide from Left */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Slide Menu */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-b from-chefchaouen-600 to-chefchaouen-800 shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 bg-white/10 backdrop-blur-sm border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src="/logoSAFARIA.png" 
                    alt="SAFARIA" 
                    className="h-16 w-auto drop-shadow-lg"
                  />
                  <button 
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <div className="w-10 h-10 bg-morocco-gold rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user?.name}</p>
                      <p className="text-white/70 text-sm">{user?.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
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

              <NavLink 
                to="/experiences" 
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition ${
                    isActive ? 'bg-white/30' : 'hover:bg-white/20'
                  }`
                }
                onClick={handleNavClick}
              >
                <FaGlobe />
                <span>{t(language, 'nav.experiences')}</span>
              </NavLink>
              </div>

              {/* Mobile Language Switcher */}
              <div className="pt-4 pb-2">
                <p className="px-4 pb-2 text-white/80 text-xs uppercase tracking-wide font-semibold">
                  {t(language, 'nav.language')}
                </p>
                <div className="grid grid-cols-3 gap-2 px-4">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition ${
                        lang.code === language ? 'bg-morocco-gold shadow-lg' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-2xl mb-1">{lang.flag}</span>
                      <span className="text-white text-xs font-medium">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 space-y-1">
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition group"
                      onClick={handleNavClick}
                    >
                      <div className="w-10 h-10 bg-morocco-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <FaChartBar className="text-lg" />
                      </div>
                      <span className="font-medium">{t(language, 'nav.admin')}</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition group"
                    onClick={handleNavClick}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FaUser className="text-lg" />
                    </div>
                    <span className="font-medium">{t(language, 'nav.profile')}</span>
                  </Link>
                  
                  <Link 
                    to="/favorites" 
                    className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition group"
                    onClick={handleNavClick}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FaHeart className="text-lg text-red-400" />
                    </div>
                    <span className="font-medium">{t(language, 'nav.favorites')}</span>
                  </Link>
                  
                  <Link 
                    to="/history" 
                    className="flex items-center space-x-3 px-4 py-3 text-white rounded-lg hover:bg-white/20 transition group"
                    onClick={handleNavClick}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FaCalendarAlt className="text-lg" />
                    </div>
                    <span className="font-medium">{t(language, 'nav.reservation')}</span>
                  </Link>
                  
                  <button 
                    className="w-full flex items-center space-x-3 px-4 py-3 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition group"
                    onClick={handleLogout}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FaSignOutAlt className="text-lg" />
                    </div>
                    <span className="font-medium">{t(language, 'nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 px-4 space-y-3">
                  <NavLink 
                    to="/login" 
                    className="block px-4 py-3 text-center text-white font-semibold bg-white/20 rounded-lg hover:bg-white/30 transition"
                    onClick={handleNavClick}
                  >
                    <FaUser className="inline mr-2" />
                    {t(language, 'nav.login')}
                  </NavLink>
                  
                  <NavLink 
                    to="/register" 
                    className="block px-4 py-3 text-center text-white font-semibold bg-morocco-gold rounded-lg hover:bg-morocco-gold/90 shadow-lg transition"
                    onClick={handleNavClick}
                  >
                    {t(language, 'nav.register')}
                  </NavLink>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;


