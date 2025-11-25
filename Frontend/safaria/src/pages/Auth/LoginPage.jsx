/**
 * ============================================================
 * SAFARIA Platform - Premium Auth Page (Login/Register Toggle)
 * ============================================================
 * Modern 2-panel animated design with Morocco-inspired theme
 * ============================================================
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { Check, Palette, Home as HomeIcon, Tent } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const { language } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert(t(language, 'auth.passwordMismatch') || 'Les mots de passe ne correspondent pas');
      return;
    }
    
    const result = isLogin 
      ? await login(formData.email, formData.password)
      : await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
    
    if (result.success) {
      navigate('/');
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-desert-100 via-sand-100 to-chefchaouen-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* LEFT PANEL - Form Section */}
          <motion.div 
            layout
            className={`w-full md:w-1/2 p-8 md:p-12 ${!isLogin ? 'md:order-2' : ''}`}
          >
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <img 
                src="/logoSAFARIA.png" 
                alt="SAFARIA Logo" 
                className="h-28 w-auto"
              />
            </motion.div>

            {/* Toggle Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex bg-gray-100 rounded-lg p-1 mb-8"
            >
              <button
                onClick={() => isLogin || toggleMode()}
                className={`flex-1 py-3 rounded-md font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-white shadow-md text-chefchaouen-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(language, 'auth.loginTitle')}
              </button>
              <button
                onClick={() => !isLogin || toggleMode()}
                className={`flex-1 py-3 rounded-md font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-white shadow-md text-chefchaouen-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(language, 'auth.registerTitle')}
              </button>
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Name Field (Register Only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(language, 'auth.fullName')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-500 focus:border-transparent transition"
                        placeholder="Mohamed Ahmed"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(language, 'auth.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-500 focus:border-transparent transition"
                      placeholder="exemple@safaria.ma"
                    />
                  </div>
                </motion.div>

                {/* Phone Field (Register Only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(language, 'auth.phone')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-500 focus:border-transparent transition"
                        placeholder="+212 6 00 00 00 00"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(language, 'auth.password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {/* Confirm Password (Register Only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(language, 'auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isLogin}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-500 focus:border-transparent transition"
                        placeholder="••••••••"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Forgot Password (Login Only) */}
                {isLogin && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-sm text-chefchaouen-600 hover:text-chefchaouen-700 font-medium"
                    >
                      {t(language, 'auth.forgotPassword')}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-chefchaouen-500 to-chefchaouen-600 hover:from-chefchaouen-600 hover:to-chefchaouen-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? t(language, 'common.loading')
                    : isLogin 
                      ? t(language, 'auth.login')
                      : t(language, 'auth.register')
                  }
                </motion.button>
              </motion.form>
            </AnimatePresence>
          </motion.div>

          {/* RIGHT PANEL - Inspirational Content */}
          <motion.div 
            layout
            className={`w-full md:w-1/2 bg-gradient-to-br from-chefchaouen-500 via-chefchaouen-600 to-desert-500 p-8 md:p-12 flex flex-col justify-center text-white ${isLogin ? 'md:order-2' : ''}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-content' : 'register-content'}
                initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {isLogin ? (
                  <>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-4xl font-bold font-display"
                    >
                      {t(language, 'auth.welcomeBack')}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg text-white font-medium"
                    >
                      {t(language, 'auth.exploreMorocco')}
                    </motion.p>
                    <div className="space-y-4 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.loginBenefit1')}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.loginBenefit2')}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.loginBenefit3')}
                        </p>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-4xl font-bold font-display"
                    >
                      {t(language, 'auth.joinUs')}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg text-white font-medium"
                    >
                      {t(language, 'auth.discoverExperiences')}
                    </motion.p>
                    <div className="space-y-4 mt-8">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Palette className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.registerBenefit1')}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <HomeIcon className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.registerBenefit2')}
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Tent className="w-5 h-5" />
                        </div>
                        <p className="text-base text-white font-medium">
                          {t(language, 'auth.registerBenefit3')}
                        </p>
                      </motion.div>
                    </div>
                  </>
                )}
                
                {/* Decorative Morocco Pattern */}
                <div className="mt-12 opacity-10">
                  <svg className="w-full h-32" viewBox="0 0 200 100">
                    <pattern id="morocco-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="white" />
                    </pattern>
                    <rect width="200" height="100" fill="url(#morocco-pattern)" />
                  </svg>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
