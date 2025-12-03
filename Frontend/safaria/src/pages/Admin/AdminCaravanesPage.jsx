/**
 * ============================================================
 * SAFARIA Platform - Admin Caravanes Page
 * ============================================================
 * Caravanes management UI with CRUD operations
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Tent, X, Eye, MapPin, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AdminCaravanesPage = () => {
  const [caravanes, setCaravanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCaravane, setSelectedCaravane] = useState(null);
  const [formData, setFormData] = useState({
    name_fr: '',
    name_en: '',
    name_ar: '',
    description_fr: '',
    description_en: '',
    description_ar: '',
    latitude: '',
    longitude: '',
    price: '',
    main_image: '',
    images: [],
    images360: []
  });

  useEffect(() => {
    fetchCaravanes();
  }, []);

  const fetchCaravanes = async () => {
    try {
      setLoading(true);
      const response = await api.caravanes.getAll();
      setCaravanes(response.data || []);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name_fr: '',
      name_en: '',
      name_ar: '',
      description_fr: '',
      description_en: '',
      description_ar: '',
      latitude: '',
      longitude: '',
      price: '',
      main_image: '',
      images: [],
      images360: []
    });
    setShowAddModal(true);
  };

  const handleEdit = (caravane) => {
    setSelectedCaravane(caravane);
    
    // Parse images
    let parsedImages = [];
    if (caravane.images) {
      try {
        parsedImages = typeof caravane.images === 'string' ? JSON.parse(caravane.images) : caravane.images;
      } catch (e) {
        console.error('Error parsing images:', e);
      }
    }
    
    // Parse images360
    let parsedImages360 = [];
    if (caravane.images360) {
      try {
        parsedImages360 = typeof caravane.images360 === 'string' ? JSON.parse(caravane.images360) : caravane.images360;
      } catch (e) {
        console.error('Error parsing images360:', e);
      }
    }
    
    setFormData({
      name_fr: caravane.name_fr || '',
      name_en: caravane.name_en || '',
      name_ar: caravane.name_ar || '',
      description_fr: caravane.description_fr || '',
      description_en: caravane.description_en || '',
      description_ar: caravane.description_ar || '',
      latitude: caravane.latitude || '',
      longitude: caravane.longitude || '',
      price: caravane.price || '',
      main_image: caravane.main_image || '',
      images: parsedImages,
      images360: parsedImages360
    });
    setShowEditModal(true);
  };

  const handleView = (caravane) => {
    setSelectedCaravane(caravane);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette caravane ?')) {
      try {
        await api.caravanes.delete(id);
        fetchCaravanes();
      } catch (error) {
        console.error('Error deleting artisan:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images' || key === 'images360') {
          formData[key].forEach(file => data.append(key, file));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      await api.caravanes.create(data);
      setShowAddModal(false);
      fetchCaravanes();
    } catch (error) {
      console.error('Error creating artisan:', error);
      alert('Erreur lors de la création');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images' || key === 'images360') {
          if (Array.isArray(formData[key])) {
            // Send existing image URLs (strings) as JSON
            const existingImages = formData[key].filter(item => typeof item === 'string');
            if (existingImages.length > 0) {
              data.append(`existing_${key}`, JSON.stringify(existingImages));
            }
            // Send new image files
            formData[key].forEach(file => {
              if (file instanceof File) data.append(key, file);
            });
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      await api.caravanes.update(selectedCaravane.id, data);
      setShowEditModal(false);
      fetchCaravanes();
    } catch (error) {
      console.error('Error updating artisan:', error);
      alert('Erreur lors de la modification');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-desert-600 animate-spin" />
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
        <button 
          onClick={handleAdd}
          className="px-6 py-3 bg-gradient-to-r from-desert-600 to-desert-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter Caravane</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prix</th>
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
                  <td className="px-6 py-4 font-medium text-gray-800">{caravane.name_fr || caravane.name}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-md truncate">{caravane.description_fr || caravane.description}</td>
                  <td className="px-6 py-4 text-gray-600">{caravane.price} DH</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(caravane)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                        title="Voir"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(caravane)}
                        className="p-2 bg-chefchaouen-100 text-chefchaouen-600 rounded-lg hover:bg-chefchaouen-200 transition"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(caravane.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {caravanes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune caravane trouvée. Cliquez sur "Ajouter Caravane" pour commencer.
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-desert-600" />
                  Ajouter une Caravane
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (Multilingual)</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇫🇷 Français</label>
                      <input
                        type="text"
                        required
                        value={formData.name_fr}
                        onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                        placeholder="Nom en français"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇬🇧 English</label>
                      <input
                        type="text"
                        required
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Name in English"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇲🇦 العربية</label>
                      <input
                        type="text"
                        required
                        value={formData.name_ar}
                        onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                        placeholder="الاسم بالعربية"
                        dir="rtl"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent text-right"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Multilingual)</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇫🇷 Français</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_fr}
                        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                        placeholder="Description en français"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇬🇧 English</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="Description in English"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇲🇦 العربية</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                        placeholder="الوصف بالعربية"
                        dir="rtl"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morocco-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images de la galerie</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({ ...formData, images: files });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-desert-100 file:text-desert-700 hover:file:bg-desert-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sélectionnez plusieurs images pour la galerie</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images 360°</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({ ...formData, images360: files });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-desert-100 file:text-desert-700 hover:file:bg-desert-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sélectionnez les images 360°</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-morocco-red text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-chefchaouen-600" />
                  Modifier la Caravane
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom (Multilingual)</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇫🇷 Français</label>
                      <input
                        type="text"
                        required
                        value={formData.name_fr}
                        onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                        placeholder="Nom en français"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇬🇧 English</label>
                      <input
                        type="text"
                        required
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Name in English"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇲🇦 العربية</label>
                      <input
                        type="text"
                        required
                        value={formData.name_ar}
                        onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                        placeholder="الاسم بالعربية"
                        dir="rtl"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent text-right"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Multilingual)</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇫🇷 Français</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_fr}
                        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                        placeholder="Description en français"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇬🇧 English</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="Description in English"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">🇲🇦 العربية</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                        placeholder="الوصف بالعربية"
                        dir="rtl"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images de la galerie</label>
                  {formData.images.length > 0 && (
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={getImageUrl(img)}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== idx);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({ ...formData, images: [...formData.images, ...files] });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-chefchaouen-100 file:text-chefchaouen-700 hover:file:bg-chefchaouen-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sélectionnez de nouvelles images pour la galerie</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images 360°</label>
                  {formData.images360.length > 0 && (
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {formData.images360.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={getImageUrl(img)}
                            alt={`360 ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages360 = formData.images360.filter((_, i) => i !== idx);
                              setFormData({ ...formData, images360: newImages360 });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({ ...formData, images360: [...formData.images360, ...files] });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chefchaouen-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-chefchaouen-100 file:text-chefchaouen-700 hover:file:bg-chefchaouen-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sélectionnez de nouvelles images 360°</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-chefchaouen-600 text-white rounded-lg hover:bg-chefchaouen-700 transition"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedCaravane && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-green-600" />
                  Détails de la Caravane
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedCaravane.main_image && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(selectedCaravane.main_image)}
                      alt={selectedCaravane.name_fr || selectedCaravane.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Image Gallery */}
                {selectedCaravane.images && (() => {
                  const images = typeof selectedCaravane.images === 'string' ? JSON.parse(selectedCaravane.images) : selectedCaravane.images;
                  return images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Galerie d'images</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {images.map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(img)}
                              alt={`${selectedCaravane.name_fr || selectedCaravane.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 360 Images Buttons */}
                {selectedCaravane.images360 && (() => {
                  const images360 = typeof selectedCaravane.images360 === 'string' ? JSON.parse(selectedCaravane.images360) : selectedCaravane.images360;
                  return images360.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Images 360°</h4>
                      <div className="flex flex-wrap gap-3">
                        {images360.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.open(getImageUrl(img), '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-chefchaouen-600 text-white rounded-lg hover:bg-chefchaouen-700 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Vue 360° {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedCaravane.name_fr || selectedCaravane.name}</h3>
                  <p className="text-gray-600">{selectedCaravane.description_fr || selectedCaravane.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sand-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Position</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Lat: {selectedCaravane.latitude}, Long: {selectedCaravane.longitude}
                    </p>
                  </div>

                  <div className="bg-sand-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Prix</span>
                    </div>
                    <p className="text-2xl font-bold text-desert-600">{selectedCaravane.price} DH</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCaravanesPage;

