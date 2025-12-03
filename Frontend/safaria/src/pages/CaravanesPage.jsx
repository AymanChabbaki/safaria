import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Compass, Sun, Moon, Mountain, Users, Shield, Share2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { translations } from '../utils/i18n';

const CaravanesPage = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const t = (lang, key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: Compass,
      titleKey: 'caravanes.features.adventure.title',
      descKey: 'caravanes.features.adventure.desc',
    },
    {
      icon: Moon,
      titleKey: 'caravanes.features.overnight.title',
      descKey: 'caravanes.features.overnight.desc',
    },
    {
      icon: Mountain,
      titleKey: 'caravanes.features.landscape.title',
      descKey: 'caravanes.features.landscape.desc',
    },
    {
      icon: Shield,
      titleKey: 'caravanes.features.guided.title',
      descKey: 'caravanes.features.guided.desc',
    },
  ];

  const highlights = [
    'caravanes.highlights.item1',
    'caravanes.highlights.item2',
    'caravanes.highlights.item3',
    'caravanes.highlights.item4',
    'caravanes.highlights.item5',
    'caravanes.highlights.item6',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {t(language, 'common.back')}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                {t(language, 'caravanes.title')}
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              {t(language, 'caravanes.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-600/20 to-orange-400/20">
                <motion.button
                  onClick={() => setIsPlaying(true)}
                  className="bg-white text-orange-600 rounded-full p-6 shadow-xl hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-12 h-12 ml-1" />
                </motion.button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {t(language, 'caravanes.videoTitle')}
                  </h3>
                  <p className="text-white/80">
                    {t(language, 'caravanes.videoDesc')}
                  </p>
                </div>
              </div>
            ) : (
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                src="/caravanes-video.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t(language, 'caravanes.descriptionTitle')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t(language, 'caravanes.descriptionText')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t(language, 'caravanes.whyChoose')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(language, feature.titleKey)}
                </h3>
                <p className="text-gray-600">
                  {t(language, feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t(language, 'caravanes.experienceHighlights')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold">✓</span>
                </div>
                <p className="text-gray-700 text-lg">
                  {t(language, highlight)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            {t(language, 'caravanes.ctaTitle')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t(language, 'caravanes.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/map')}
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t(language, 'caravanes.exploreCaravans')}
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
              {t(language, 'common.share')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CaravanesPage;
