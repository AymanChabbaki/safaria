/**
 * ============================================================
 * SAFARIA Platform - City Extraction Utility
 * ============================================================
 * Extract city names from item names and coordinates
 * ============================================================
 */

// Moroccan cities with their approximate coordinates
const MOROCCAN_CITIES = {
  'Marrakech': { lat: 31.6295, lon: -7.9811, keywords: ['marrakech', 'marrakesh'] },
  'Fès': { lat: 34.0333, lon: -5.0000, keywords: ['fès', 'fes', 'fez'] },
  'Casablanca': { lat: 33.5731, lon: -7.5898, keywords: ['casablanca', 'casa'] },
  'Rabat': { lat: 34.0209, lon: -6.8416, keywords: ['rabat'] },
  'Tanger': { lat: 35.7595, lon: -5.8340, keywords: ['tanger', 'tangier', 'tangiers'] },
  'Agadir': { lat: 30.4278, lon: -9.5981, keywords: ['agadir'] },
  'Meknès': { lat: 33.8935, lon: -5.5473, keywords: ['meknès', 'meknes'] },
  'Essaouira': { lat: 31.5084, lon: -9.7596, keywords: ['essaouira', 'mogador'] },
  'Chefchaouen': { lat: 35.1688, lon: -5.2636, keywords: ['chefchaouen', 'chaouen'] },
  'Merzouga': { lat: 31.0801, lon: -4.0133, keywords: ['merzouga', 'erg chebbi'] },
  'Ouarzazate': { lat: 30.9335, lon: -6.9370, keywords: ['ouarzazate'] },
  'Tétouan': { lat: 35.5889, lon: -5.3626, keywords: ['tétouan', 'tetouan'] },
  'Ifrane': { lat: 33.5228, lon: -5.1106, keywords: ['ifrane'] },
  'Safi': { lat: 32.2994, lon: -9.2372, keywords: ['safi'] },
  'El Jadida': { lat: 33.2316, lon: -8.5007, keywords: ['el jadida', 'jadida'] },
  'Nador': { lat: 35.1681, lon: -2.9331, keywords: ['nador'] },
  'Kénitra': { lat: 34.2610, lon: -6.5802, keywords: ['kénitra', 'kenitra'] },
  'Béni Mellal': { lat: 32.3373, lon: -6.3498, keywords: ['béni mellal', 'beni mellal'] },
  'Mohammedia': { lat: 33.6866, lon: -7.3827, keywords: ['mohammedia'] },
  'Oujda': { lat: 34.6867, lon: -1.9114, keywords: ['oujda'] },
};

/**
 * Extract city name from item name
 * @param {string} itemName - The name of the item (e.g., "Atelier de Poterie Fès")
 * @returns {string} - City name or 'Morocco'
 */
export const extractCityFromName = (itemName) => {
  if (!itemName) return 'Morocco';
  
  const lowerName = itemName.toLowerCase();
  
  for (const [city, data] of Object.entries(MOROCCAN_CITIES)) {
    for (const keyword of data.keywords) {
      if (lowerName.includes(keyword)) {
        return city;
      }
    }
  }
  
  return 'Morocco';
};

/**
 * Get city name from coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {string} - Closest city name
 */
export const getCityFromCoordinates = (latitude, longitude) => {
  if (!latitude || !longitude) return 'Morocco';
  
  let closestCity = 'Morocco';
  let minDistance = Infinity;
  
  for (const [city, coords] of Object.entries(MOROCCAN_CITIES)) {
    const distance = Math.sqrt(
      Math.pow(latitude - coords.lat, 2) + 
      Math.pow(longitude - coords.lon, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }
  
  // If distance is too far (> 1 degree), return Morocco
  return minDistance < 1 ? closestCity : 'Morocco';
};

/**
 * Get city name using multiple methods
 * @param {Object} item - Item object with name, latitude, longitude
 * @returns {string} - City name
 */
export const getCity = (item) => {
  if (!item) return 'Morocco';
  
  // Try extracting from name first
  const cityFromName = extractCityFromName(item.name || item.title);
  if (cityFromName !== 'Morocco') {
    return cityFromName;
  }
  
  // Fallback to coordinates
  if (item.latitude && item.longitude) {
    return getCityFromCoordinates(item.latitude, item.longitude);
  }
  
  return 'Morocco';
};

export default {
  extractCityFromName,
  getCityFromCoordinates,
  getCity,
  MOROCCAN_CITIES,
};

