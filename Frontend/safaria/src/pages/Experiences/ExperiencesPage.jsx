/**
 * ============================================================
 * SAFARIA Platform - Experiences Page
 * ============================================================
 * Browse all experiences by category with filtering
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Home as HomeIcon, Tent, MapPin, Star, 
  Search, Filter, ChevronRight, Heart, Eye, Calendar,
  Users, ArrowRight, Sparkles, Award, Shield
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';
import { getCity } from '../../utils/cityExtractor';
import { getImageUrl } from '../../utils/imageHelper';

const ExperiencesPage = () => {
  const { language } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [artisans, setArtisans] = useState([]);
  const [sejours, setSejours] = useState([]);
  const [caravanes, setCaravanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    {
      id: 'all',
      name: t(language, 'experiences.categories.all'),
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'artisan',
      name: t(language, 'experiences.categories.artisan'),
      icon: Palette,
      color: 'from-morocco-red to-red-600'
    },
    {
      id: 'sejour',
      name: t(language, 'experiences.categories.sejour'),
      icon: HomeIcon,
      color: 'from-chefchaouen-500 to-blue-600'
    },
    {
      id: 'caravane',
      name: t(language, 'experiences.categories.caravane'),
      icon: Tent,
      color: 'from-desert-500 to-sand-600'
    }
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('safaria_favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [artisansRes, sejoursRes, caravanesRes] = await Promise.all([
          api.artisans.getAll(language),
          api.sejours.getAll(language),
          api.caravanes.getAll(language)
        ]);

        setArtisans(artisansRes.data || []);
        setSejours(sejoursRes.data || []);
        setCaravanes(caravanesRes.data || []);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchParams({ category: categoryId });
  };

  // Toggle favorite
  const toggleFavorite = (item, type) => {
    const favoriteItem = { id: item.id, type, ...item };
    const isFav = favorites.some(fav => fav.id === item.id && fav.type === type);
    
    let updatedFavorites;
    if (isFav) {
      updatedFavorites = favorites.filter(fav => !(fav.id === item.id && fav.type === type));
    } else {
      updatedFavorites = [...favorites, favoriteItem];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('safaria_favorites', JSON.stringify(updatedFavorites));
  };

  // Filter items based on category and search
  const getFilteredItems = () => {
    let items = [];
    
    if (activeCategory === 'all' || activeCategory === 'artisan') {
      items = [...items, ...artisans.map(item => ({ ...item, type: 'artisan' }))];
    }
    if (activeCategory === 'all' || activeCategory === 'sejour') {
      items = [...items, ...sejours.map(item => ({ ...item, type: 'sejour' }))];
    }
    if (activeCategory === 'all' || activeCategory === 'caravane') {
      items = [...items, ...caravanes.map(item => ({ ...item, type: 'caravane' }))];
    }

    if (searchQuery) {
      items = items.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  const ExperienceCard = ({ item, type }) => {
    const isFav = favorites.some(fav => fav.id === item.id && fav.type === type);
    const city = getCity({ latitude: item.latitude, longitude: item.longitude });

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
        onClick={() => navigate(`/${type}/${item.id}`)}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={getImageUrl(item.images?.[0])}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item, type);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
              isFav 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <div className="flex items-center gap-2">
              {type === 'artisan' && <Palette className="w-4 h-4 text-morocco-red" />}
              {type === 'sejour' && <HomeIcon className="w-4 h-4 text-chefchaouen-600" />}
              {type === 'caravane' && <Tent className="w-4 h-4 text-desert-600" />}
              <span className="text-xs font-semibold text-gray-700">
                {type === 'artisan' && t(language, 'map.filters.artisan')}
                {type === 'sejour' && t(language, 'map.filters.sejour')}
                {type === 'caravane' && t(language, 'map.filters.caravane')}
              </span>
            </div>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">{t(language, 'experiences.viewDetails')}</span>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {item.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{city}, Morocco</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">4.8</span>
              <span className="text-gray-500 text-sm">(120)</span>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-chefchaouen-600">
                {item.price} DH
              </div>
              {type === 'sejour' && (
                <div className="text-xs text-gray-500">{t(language, 'experiences.perNight')}</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-chefchaouen-600 via-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t(language, 'experiences.title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t(language, 'experiences.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t(language, 'experiences.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-chefchaouen-500 focus:ring-4 focus:ring-chefchaouen-100 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                    {activeCategory === category.id && (
                      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                        {filteredItems.length}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <p className="text-gray-600 text-center">
            <span className="font-semibold text-chefchaouen-600">{filteredItems.length}</span> expérience{filteredItems.length > 1 ? 's' : ''} trouvée{filteredItems.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <ExperienceCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  type={item.type}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gray-100 rounded-full">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t(language, 'experiences.noResults')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(language, 'experiences.noResultsDesc')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-3 bg-chefchaouen-600 text-white rounded-xl font-semibold hover:bg-chefchaouen-700 transition"
            >
              {t(language, 'experiences.resetFilters')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;

