/**
 * ============================================================
 * SAFARIA Platform - Root Layout Component
 * ============================================================
 * Main layout wrapper with Navbar and Footer
 * ============================================================
 */

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import useAuthStore from '../store/useAuthStore';
import { useEffect } from 'react';

const RootLayout = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Hide footer on map page
  const showFooter = location.pathname !== '/map';
  
  return (
    <div className="root-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <ChatWidget />
    </div>
  );
};

export default RootLayout;

