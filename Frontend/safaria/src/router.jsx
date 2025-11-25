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
import ArtisanatDetailsPage from './pages/Details/ArtisanatDetailsPage';
import SejourDetailsPage from './pages/Details/SejourDetailsPage';
import CaravaneDetailsPage from './pages/Details/CaravaneDetailsPage';
import ReservationPage from './pages/Reservation/ReservationPage';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminArtisansPage from './pages/Admin/AdminArtisansPage';
import AdminSejoursPage from './pages/Admin/AdminSejoursPage';
import AdminCaravanesPage from './pages/Admin/AdminCaravanesPage';
import AdminReservationsPage from './pages/Admin/AdminReservationsPage';

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
      
      // ============================================================
      // DETAILS ROUTES (Type-specific)
      // ============================================================
      {
        path: 'artisanat/:id',
        element: <ArtisanatDetailsPage />,
      },
      {
        path: 'sejour/:id',
        element: <SejourDetailsPage />,
      },
      {
        path: 'caravane/:id',
        element: <CaravaneDetailsPage />,
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
