import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Sparkles, Users, MapPin, Star, Heart, Share2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { translations } from '../utils/i18n';

const ArtisanatPage = () => {
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
      icon: Users,
      titleKey: 'artisanat.features.authentic.title',
      descKey: 'artisanat.features.authentic.desc',
    },
    {
      icon: MapPin,
      titleKey: 'artisanat.features.local.title',
      descKey: 'artisanat.features.local.desc',
    },
    {
      icon: Star,
      titleKey: 'artisanat.features.quality.title',
      descKey: 'artisanat.features.quality.desc',
    },
    {
      icon: Heart,
      titleKey: 'artisanat.features.passion.title',
      descKey: 'artisanat.features.passion.desc',
    },
  ];

  const highlights = [
    'artisanat.highlights.item1',
    'artisanat.highlights.item2',
    'artisanat.highlights.item3',
    'artisanat.highlights.item4',
    'artisanat.highlights.item5',
    'artisanat.highlights.item6',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-desert-600 to-desert-500 text-white py-20">
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
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                {t(language, 'artisanat.title')}
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              {t(language, 'artisanat.subtitle')}
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
            <iframe
              className="w-full h-full"
              src="https://drive.google.com/file/d/1Qel7dVWfvVbF3WAmyKT35jr3vlWP_jgG/preview"
              allow="autoplay"
              allowFullScreen
            ></iframe>
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
            {t(language, 'artisanat.descriptionTitle')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t(language, 'artisanat.descriptionText')}
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
            {t(language, 'artisanat.whyChoose')}
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
                <div className="bg-desert-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-desert-600" />
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
          className="mb-16 bg-gradient-to-br from-desert-50 to-desert-100 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t(language, 'artisanat.experienceHighlights')}
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
                <div className="bg-desert-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
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
          className="text-center bg-gradient-to-r from-desert-600 to-desert-500 text-white rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            {t(language, 'artisanat.ctaTitle')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t(language, 'artisanat.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/map')}
              className="bg-white text-desert-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t(language, 'artisanat.exploreArtisans')}
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

export default ArtisanatPage;

