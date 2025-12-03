/**
 * ============================================================
 * SAFARIA Platform - Main App Component
 * ============================================================
 * Application entry point with routing configuration
 * ============================================================
 */

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

