/**
 * ============================================================
 * SAFARIA Platform - React Router Configuration
 * ============================================================
 * Main routing setup with protected routes
 * ============================================================
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Layouts
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/Home/HomePage';
import MapPage from './pages/Map/MapPage';
import ExperiencesPage from './pages/Experiences/ExperiencesPage';
import UniversalDetailsPage from './pages/Details/UniversalDetailsPage';
import ReservationPage from './pages/Reservation/ReservationPage';
import PaymentPage from './pages/Payment/PaymentPage';
import HistoryPage from './pages/History/HistoryPage';
import ProfilePage from './pages/Profile/ProfilePage';
import FavoritesPage from './pages/Favorites/FavoritesPage';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminArtisansPage from './pages/Admin/AdminArtisansPage';
import AdminSejoursPage from './pages/Admin/AdminSejoursPage';
import AdminCaravanesPage from './pages/Admin/AdminCaravanesPage';
import AdminReservationsPage from './pages/Admin/AdminReservationsPage';
import AdminProfilePage from './pages/Admin/AdminProfilePage';

// Error Pages
import NotFoundPage from './pages/NotFoundPage';

/**
 * ============================================================
 * PROTECTED ROUTE WRAPPER
 * ============================================================
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * ============================================================
 * AUTH ROUTE WRAPPER (Redirect if already logged in)
 * ============================================================
 */
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * ============================================================
 * ROUTER CONFIGURATION
 * ============================================================
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // ============================================================
      // PUBLIC ROUTES
      // ============================================================
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'experiences',
        element: <ExperiencesPage />,
      },
      
      // ============================================================
      // DETAILS ROUTES (Universal)
      // ============================================================
      {
        path: 'artisan/:id',
        element: <UniversalDetailsPage type="artisan" />,
      },
      {
        path: 'artisanat/:id',
        element: <UniversalDetailsPage type="artisan" />,
      },
      {
        path: 'sejour/:id',
        element: <UniversalDetailsPage type="sejour" />,
      },
      {
        path: 'caravane/:id',
        element: <UniversalDetailsPage type="caravane" />,
      },
      
      // ============================================================
      // RESERVATION ROUTE (Protected)
      // ============================================================
      {
        path: 'reservation',
        element: (
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        ),
      },
      
      // ============================================================
      // PAYMENT ROUTE (Protected)
      // ============================================================
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      
      // ============================================================
      // HISTORY ROUTE (Protected)
      // ============================================================
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      
      // ============================================================
      // PROFILE ROUTE (Protected)
      // ============================================================
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      
      // ============================================================
      // FAVORITES ROUTE (Protected)
      // ============================================================
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      
      // ============================================================
      // AUTH ROUTES (Redirect if authenticated)
      // ============================================================
      {
        path: 'login',
        element: (
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        ),
      },
      
      // ============================================================
      // ADMIN ROUTES (Protected + Admin Only with AdminLayout)
      // ============================================================
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'artisans',
        element: <AdminArtisansPage />,
      },
      {
        path: 'sejours',
        element: <AdminSejoursPage />,
      },
      {
        path: 'caravanes',
        element: <AdminCaravanesPage />,
      },
      {
        path: 'reservations',
        element: <AdminReservationsPage />,
      },
      {
        path: 'profile',
        element: <AdminProfilePage />,
      },
      
      // ============================================================
      // 404 FALLBACK
      // ============================================================
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
