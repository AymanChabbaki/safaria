/**
 * ============================================================
 * SAFARIA Platform - User Profile Page
 * ============================================================
 * Enhanced user profile management with modern design
 * ============================================================
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, X, Edit2, Lock, Shield, Calendar, Award, MapPin, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const { language } = useAppStore();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [previewUrl, setPreviewUrl] = useState(user?.photo || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        photo: user.photo || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPreviewUrl(user.photo || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear any previous messages
      setMessage({ type: '', text: '' });
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Photo must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update form data with file
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate password fields if any password field is filled
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          setMessage({ type: 'error', text: 'Current password is required to change password' });
          setLoading(false);
          return;
        }
        if (!formData.newPassword) {
          setMessage({ type: 'error', text: 'New password is required' });
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }
      
      // Add password fields if changing password
      if (formData.currentPassword && formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      const response = await api.auth.updateProfile(formDataToSend);
      
      console.log('API response:', response);
      
      // The response structure is { data: { user: {...} } }
      const updatedUser = response.data?.user || response.user;
      
      if (!updatedUser) {
        throw new Error('No user data in response');
      }
      
      updateUser(updatedUser);
      
      // Update local state with the response data
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        photo: updatedUser.photo || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPreviewUrl(updatedUser.photo || '');
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>Home</span>
            <span>/</span>
            <span className="text-chefchaouen-600 font-medium">My Profile</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-chefchaouen-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {t(language, 'profile.title')}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t(language, 'profile.subtitle')}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
              {/* Profile Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-r from-chefchaouen-600 via-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                      {previewUrl ? (
                        <img 
                          src={previewUrl.startsWith('http') ? previewUrl : `http://localhost:5000${previewUrl}`}
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-chefchaouen-500 to-blue-500 text-white text-3xl font-bold">
                          {getInitials(formData.name)}
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Button - Always visible */}
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={() => {
                        if (!isEditing) {
                          setIsEditing(true);
                        }
                        fileInputRef.current?.click();
                      }}
                      className="absolute bottom-0 right-0 p-2.5 bg-chefchaouen-600 rounded-full shadow-lg hover:bg-chefchaouen-700 transition-all hover:scale-110 z-10"
                      title="Change profile photo"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </motion.button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || 'User'}</h2>
                <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-chefchaouen-100 to-blue-100 rounded-full">
                  {user?.role === 'admin' ? (
                    <>
                      <Shield className="w-4 h-4 text-chefchaouen-600" />
                      <span className="text-chefchaouen-700 text-sm font-semibold">Administrator</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 text-sm font-semibold">Member</span>
                    </>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500">{t(language, 'profile.memberSince')}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500">{t(language, 'profile.status')}</p>
                    <p className="text-sm font-semibold text-green-600">{t(language, 'profile.active')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition relative ${
                      activeTab === 'profile'
                        ? 'text-chefchaouen-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      {t(language, 'profile.tabs.personal')}
                    </div>
                    {activeTab === 'profile' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-chefchaouen-600"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition relative ${
                      activeTab === 'security'
                        ? 'text-chefchaouen-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      {t(language, 'profile.tabs.security')}
                    </div>
                    {activeTab === 'security' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-chefchaouen-600"
                      />
                    )}
                  </button>
                </div>
              </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Message Alert */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-md ${
                    message.type === 'success' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Toggle Button */}
            {!isEditing && activeTab === 'profile' && (
              <div className="flex justify-end mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                >
                  <Edit2 className="w-5 h-5" />
                  {t(language, 'profile.editProfile')}
                </motion.button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all ${
                          isEditing 
                            ? 'border-gray-300 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100 bg-white' 
                            : 'border-transparent bg-gray-50 cursor-not-allowed'
                        } outline-none font-medium`}
                        required
                      />
                    </div>

                    {/* Email Field (Read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.email')}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-transparent bg-gray-50 cursor-not-allowed font-medium text-gray-600"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {t(language, 'profile.emailReadonly')}
                      </p>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.phone')}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100 bg-white' 
                              : 'border-transparent bg-gray-50 cursor-not-allowed'
                          } outline-none font-medium`}
                          placeholder="+212 6XX XXX XXX"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{t(language, 'profile.passwordSecurity')}</h3>
                          <p className="text-sm text-gray-600">
                            {t(language, 'profile.passwordSecurityDesc')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.currentPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-300 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100 transition-all outline-none font-medium"
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.newPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-300 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100 transition-all outline-none font-medium"
                          placeholder="Enter new password (min 6 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`h-1 flex-1 rounded-full transition-all ${
                          formData.newPassword.length === 0 ? 'bg-gray-200' :
                          formData.newPassword.length < 6 ? 'bg-red-400' :
                          formData.newPassword.length < 8 ? 'bg-yellow-400' :
                          'bg-green-400'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          {formData.newPassword.length === 0 ? '' :
                           formData.newPassword.length < 6 ? t(language, 'profile.passwordStrength.weak') :
                           formData.newPassword.length < 8 ? t(language, 'profile.passwordStrength.good') :
                           t(language, 'profile.passwordStrength.strong')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2 text-chefchaouen-600" />
                        {t(language, 'profile.fields.confirmPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3.5 pr-12 rounded-xl border-2 transition-all outline-none font-medium ${
                            formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                              : 'border-gray-300 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100'
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {t(language, 'profile.passwordMismatch')}
                        </p>
                      )}
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {t(language, 'profile.passwordMatch')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-chefchaouen-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t(language, 'profile.updating')}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {t(language, 'profile.saveChanges')}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        photo: user?.photo || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPreviewUrl(user?.photo || '');
                      setMessage({ type: '', text: '' });
                    }}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    <span>{t(language, 'profile.cancel')}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
