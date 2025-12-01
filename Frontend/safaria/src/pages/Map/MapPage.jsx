/**
 * ============================================================
 * SAFARIA Platform - Interactive Map Page
 * ============================================================
 * React Leaflet map with custom markers, filters, and popups
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, MapPin, Loader2, Palette, Home as HomeIcon, Tent, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { t } from '../../utils/i18n';
import api from '../../utils/api';
import 'leaflet/dist/leaflet.css';

// Custom marker icons using colored SAFARIA logo
const createLogoIcon = (color) => {
  return new DivIcon({
    html: `
      <div style="position: relative; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));">
        <div style="position: absolute; width: 55px; height: 55px; border-radius: 50%; background-color: white; border: 4px solid ${color};"></div>
        <img src="/logoSAFARIA.png" 
             style="position: relative; width: 48px; height: 48px; object-fit: contain; z-index: 1;" 
             alt="SAFARIA" />
      </div>
    `,
    iconSize: [75, 75],
    iconAnchor: [37.5, 37.5],
    popupAnchor: [0, -37.5],
    className: ''
  });
};

const markerIcons = {
  artisan: createLogoIcon('#E53E3E'), // Red
  sejour: createLogoIcon('#3B82F6'),  // Blue
  caravane: createLogoIcon('#F59E0B') // Orange/Gold
};

// Map centering component
const MapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Mock data for display
const mockData = {
  artisans: [
    {
      id: 1,
      name: 'Atelier de Poterie Fès',
      description: 'Artisanat traditionnel de poterie et céramique',
      latitude: 34.0331,
      longitude: -5.0003,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.10 PM.jpeg',
      price: 150
    },
    {
      id: 2,
      name: 'Tissage Berbère Marrakech',
      description: 'Tapis et textiles berbères authentiques',
      latitude: 31.6295,
      longitude: -7.9811,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.11 PM.jpeg',
      price: 200
    },
    {
      id: 3,
      name: 'Ferronnerie d\'Art Essaouira',
      description: 'Portes, lanternes et objets en fer forgé',
      latitude: 31.5125,
      longitude: -9.7595,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.11 PM (1).jpeg',
      price: 180
    }
  ],
  sejours: [
    {
      id: 1,
      name: 'Riad Traditionnel Marrakech',
      description: 'Séjour authentique dans un riad du 18ème siècle',
      latitude: 31.6295,
      longitude: -7.9811,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.11 PM (2).jpeg',
      price: 450
    },
    {
      id: 2,
      name: 'Maison Bleue Chefchaouen',
      description: 'Vue panoramique sur la ville bleue',
      latitude: 35.1711,
      longitude: -5.2636,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.12 PM.jpeg',
      price: 380
    },
    {
      id: 3,
      name: 'Kasbah du Désert Merzouga',
      description: 'Au pied des dunes de l\'Erg Chebbi',
      latitude: 31.0801,
      longitude: -4.0133,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.12 PM (1).jpeg',
      price: 320
    }
  ],
  caravanes: [
    {
      id: 1,
      name: 'Expédition Sahara 3 Jours',
      description: 'Aventure à dos de chameau dans le désert',
      latitude: 31.0801,
      longitude: -4.0133,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.13 PM.jpeg',
      price: 650
    },
    {
      id: 2,
      name: 'Nuit Sous les Étoiles',
      description: 'Bivouac traditionnel dans les dunes',
      latitude: 30.9335,
      longitude: -4.0070,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.13 PM (1).jpeg',
      price: 280
    },
    {
      id: 3,
      name: 'Trek Vallée du Drâa',
      description: 'Caravane à travers les palmeraies',
      latitude: 30.2841,
      longitude: -6.9085,
      image: '/images/WhatsApp Image 2025-11-23 at 6.09.12 PM (2).jpeg',
      price: 520
    }
  ]
};

const MapPage = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState({ artisans: [], sejours: [], caravanes: [] });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mapCenter, setMapCenter] = useState([31.7917, -7.0926]); // Morocco center (Marrakech)

  // Fetch all data from database (refetch when language changes)
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const [artisansRes, sejoursRes, caravanesRes] = await Promise.all([
          api.artisans.getAll(language).catch(() => ({ data: [] })),
          api.sejours.getAll(language).catch(() => ({ data: [] })),
          api.caravanes.getAll(language).catch(() => ({ data: [] }))
        ]);
        
        const fetchedData = {
          artisans: artisansRes.data || [],
          sejours: sejoursRes.data || [],
          caravanes: caravanesRes.data || []
        };
        
        // Check if database is empty
        const totalItems = fetchedData.artisans.length + fetchedData.sejours.length + fetchedData.caravanes.length;
        
        if (totalItems === 0) {
          console.log('Database is empty, using mock data');
          setMapData(mockData);
        } else {
          setMapData(fetchedData);
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
        setMapData(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, [language]); // Refetch when language changes

  // Filter data based on active filter
  const getFilteredMarkers = () => {
    const markers = [];
    
    if (activeFilter === 'all' || activeFilter === 'artisan') {
      mapData.artisans.forEach(artisan => {
        if (artisan.latitude && artisan.longitude) {
          markers.push({
            id: `artisan-${artisan.id}`,
            type: 'artisan',
            data: artisan,
            position: [parseFloat(artisan.latitude), parseFloat(artisan.longitude)]
          });
        }
      });
    }
    
    if (activeFilter === 'all' || activeFilter === 'sejour') {
      mapData.sejours.forEach(sejour => {
        if (sejour.latitude && sejour.longitude) {
          markers.push({
            id: `sejour-${sejour.id}`,
            type: 'sejour',
            data: sejour,
            position: [parseFloat(sejour.latitude), parseFloat(sejour.longitude)]
          });
        }
      });
    }
    
    if (activeFilter === 'all' || activeFilter === 'caravane') {
      mapData.caravanes.forEach(caravane => {
        if (caravane.latitude && caravane.longitude) {
          markers.push({
            id: `caravane-${caravane.id}`,
            type: 'caravane',
            data: caravane,
            position: [parseFloat(caravane.latitude), parseFloat(caravane.longitude)]
          });
        }
      });
    }
    
    return markers;
  };

  const filteredMarkers = getFilteredMarkers();

  // Handle marker click to navigate
  const handleViewDetails = (type, id) => {
    const routeMap = {
      artisan: `/artisan/${id}`,
      sejour: `/sejour/${id}`,
      caravane: `/caravane/${id}`
    };
    navigate(routeMap[type]);
  };

  const filterButtons = [
    { key: 'all', label: t(language, 'map.filters.all'), Icon: MapIcon, color: 'chefchaouen' },
    { key: 'artisan', label: t(language, 'map.filters.artisan'), Icon: Palette, color: 'morocco-red' },
    { key: 'sejour', label: t(language, 'map.filters.sejour'), Icon: HomeIcon, color: 'chefchaouen' },
    { key: 'caravane', label: t(language, 'map.filters.caravane'), Icon: Tent, color: 'desert' }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-chefchaouen-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-desert-700">
            {t(language, 'map.loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Map Container */}
      <MapContainer 
        center={mapCenter} 
        zoom={6} 
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenter center={mapCenter} />
        
        {/* Render Markers */}
        {filteredMarkers.map(marker => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={markerIcons[marker.type]}
          >
            <Popup>
              <div className="p-3 min-w-[280px]">
                {/* SAFARIA Logo Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-chefchaouen-100">
                  <img 
                    src="/logoSAFARIA.png" 
                    alt="SAFARIA" 
                    className="h-8 w-auto"
                  />
                  <span className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                    marker.type === 'artisan' ? 'bg-red-100 text-red-700' :
                    marker.type === 'sejour' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {marker.type === 'artisan' ? <><Palette className="w-3 h-3" /> Artisan</> :
                     marker.type === 'sejour' ? <><HomeIcon className="w-3 h-3" /> Séjour</> :
                     <><Tent className="w-3 h-3" /> Caravane</>}
                  </span>
                </div>

                {/* Popup Image */}
                <div className="relative mb-3 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={
                      marker.data.images && marker.data.images.length > 0
                        ? `http://localhost:5000${marker.data.images[0]}`
                        : marker.data.main_image
                          ? `http://localhost:5000${marker.data.main_image}`
                          : marker.data.image || '/logoSAFARIA.png'
                    }
                    alt={marker.data.name || marker.data.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.target.src = '/logoSAFARIA.png'; }}
                  />
                </div>
                
                {/* Popup Title */}
                <h3 className="font-bold text-base text-desert-800 mb-1">
                  {marker.data.name || marker.data.title}
                </h3>
                
                {/* Popup Description */}
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {marker.data.description}
                </p>
                
                {/* Price */}
                {marker.data.price_per_night || marker.data.price_per_person || marker.data.price && (
                  <p className="text-sm font-bold text-chefchaouen-600 mb-2">
                    {marker.data.price_per_night || marker.data.price_per_person || marker.data.price} DH
                    {marker.data.price_per_night && <span className="text-xs font-normal">/nuit</span>}
                    {marker.data.price_per_person && <span className="text-xs font-normal">/personne</span>}
                  </p>
                )}
                
                {/* Show More Button */}
                <button 
                  onClick={() => handleViewDetails(marker.type, marker.data.id)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-chefchaouen-500 to-desert-500 text-white font-semibold rounded-lg hover:from-chefchaouen-600 hover:to-desert-600 transition-all transform hover:scale-105 shadow-md text-sm"
                >
                  Show More Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Filter Buttons */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-full shadow-xl"
        >
          <Filter className="w-5 h-5 text-desert-600" />
          {filterButtons.map(btn => {
            const Icon = btn.Icon;
            return (
              <button
                key={btn.key}
                onClick={() => setActiveFilter(btn.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                  activeFilter === btn.key
                    ? `bg-${btn.color}-500 text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {btn.label}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Results Counter & Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] space-y-2">
        {/* Results Counter */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-lg shadow-xl"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-desert-700">
            <MapPin className="w-4 h-4" />
            {filteredMarkers.length} {t(language, 'map.results')}
          </p>
        </motion.div>

        {/* Map Legend */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-xl"
        >
          <p className="text-xs font-bold text-gray-500 mb-2">LÉGENDE</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Artisanat</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Séjours</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Caravanes</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SAFARIA Branding Badge */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-chefchaouen-500 to-desert-500 p-3 rounded-lg shadow-2xl"
        >
          <img 
            src="/logoSAFARIA.png" 
            alt="SAFARIA" 
            className="h-12 w-auto drop-shadow-md"
          />
          <p className="text-xs text-white font-semibold mt-1 text-center">Explorez le Maroc</p>
        </motion.div>
      </div>
    </div>
  );
};

export default MapPage;
