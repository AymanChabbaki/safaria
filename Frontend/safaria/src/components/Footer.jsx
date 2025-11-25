/**
 * ============================================================
 * SAFARIA Platform - Footer Component (Tailwind)
 * ============================================================
 * Site footer with i18n, contact info and social links
 * ============================================================
 */

import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import useAppStore from '../store/useAppStore';
import { t } from '../utils/i18n';

const Footer = () => {
  const { language } = useAppStore();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-desert-800 to-desert-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/logoSAFARIA.png" 
                alt="SAFARIA" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sand-200 leading-relaxed">
              {t(language, 'footer.description')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-morocco-gold">
              {t(language, 'footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sand-200 hover:text-morocco-gold transition"
                >
                  {t(language, 'nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className="text-sand-200 hover:text-morocco-gold transition"
                >
                  {t(language, 'nav.map')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-sand-200 hover:text-morocco-gold transition"
                >
                  {t(language, 'nav.login')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-sand-200 hover:text-morocco-gold transition"
                >
                  {t(language, 'nav.register')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-morocco-gold">
              {t(language, 'footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sand-200">
                <FaEnvelope className="text-morocco-gold flex-shrink-0" />
                <a 
                  href="mailto:contact@safaria.ma" 
                  className="hover:text-morocco-gold transition"
                >
                  contact@safaria.ma
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sand-200">
                <FaPhone className="text-morocco-gold flex-shrink-0" />
                <a 
                  href="tel:+212600000000" 
                  className="hover:text-morocco-gold transition"
                >
                  +212 6 00 00 00 00
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sand-200">
                <FaMapMarkerAlt className="text-morocco-gold flex-shrink-0" />
                <span>Marrakech, Maroc</span>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-morocco-gold">
              {t(language, 'footer.followUs')}
            </h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-chefchaouen-600 hover:bg-chefchaouen-500 rounded-full transition transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-morocco-red via-morocco-gold to-chefchaouen-600 hover:opacity-90 rounded-full transition transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-chefchaouen-500 hover:bg-chefchaouen-400 rounded-full transition transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-sand-700 text-center">
          <p className="text-sand-300">
            &copy; {currentYear} SAFARIA. {t(language, 'footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
