/**
 * ============================================================
 * SAFARIA Platform - Main App Component
 * ============================================================
 * Application entry point with routing configuration
 * ============================================================
 */

import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    // Play background music with low volume
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // 15% volume - gentle background music
      audioRef.current.play().catch(error => {
        // Auto-play might be blocked by browser, user will need to interact first
        console.log('Background music autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <>
      {/* Background Moroccan Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/moroccan-music.mp3"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

