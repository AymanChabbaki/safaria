import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';

const FavoritesPage = () => {
  const { language } = useAppStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('safaria_favorites') || '[]');
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (itemId, itemType) => {
    const updatedFavorites = favorites.filter(
      fav => !(fav.id === itemId && fav.type === itemType)
    );
    localStorage.setItem('safaria_favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const getCategoryLabel = (type) => {
    const categories = {
      artisan: t(language, 'experiences.artisanat'),
      sejour: t(language, 'experiences.sejours'),
      caravane: t(language, 'experiences.caravanes')
    };
    return categories[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desert-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t(language, 'common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-white">
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaHeart className="text-3xl text-red-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              {t(language, 'favorites.title')}
            </h1>
          </div>
          <p className="text-gray-600">
            {t(language, 'favorites.subtitle')} ({favorites.length})
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {t(language, 'favorites.empty')}
            </h2>
            <p className="text-gray-500 mb-6">
              {t(language, 'favorites.emptyDesc')}
            </p>
            <Link
              to="/experiences"
              className="inline-block px-6 py-3 bg-desert-600 text-white rounded-lg hover:bg-desert-700 transition"
            >
              {t(language, 'favorites.explore')}
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      item.images?.[0]
                        ? `http://localhost:5000${item.images[0]}`
                        : item.main_image
                        ? `http://localhost:5000${item.main_image}`
                        : 'https://via.placeholder.com/400x300?text=No+Image'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-desert-600">
                    {getCategoryLabel(item.type)}
                  </div>

                  {/* Remove Favorite Button */}
                  <button
                    onClick={() => removeFavorite(item.id, item.type)}
                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-red-50 transition group"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="text-red-500 group-hover:scale-110 transition" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {item.name}
                  </h3>

                  {item.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-desert-600 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{item.location}</span>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price (for sejours and caravanes) */}
                  {item.price && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-desert-600">
                        {item.price} DH
                      </span>
                      {(item.type === 'sejour' || item.type === 'caravane') && (
                        <span className="text-gray-500 text-sm ml-2">
                          {t(language, 'experiences.perNight')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <Link
                    to={`/${item.type}/${item.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-desert-600 text-white rounded-lg hover:bg-desert-700 transition font-medium"
                  >
                    <FaInfoCircle className="inline mr-2" />
                    {t(language, 'experiences.viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
