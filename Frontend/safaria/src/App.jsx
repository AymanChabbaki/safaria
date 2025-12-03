/**
 * ============================================================
 * SAFARIA Platform - Main App Component
 * ============================================================
 * Application entry point with routing configuration
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Volume2, VolumeX } from 'lucide-react';
import './App.css';

function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(true);

  useEffect(() => {
    // Try to autoplay after first user interaction
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.volume = 0.15;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setTimeout(() => setShowMusicButton(false), 3000);
          })
          .catch(() => {
            setShowMusicButton(true);
          });
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isPlaying]);

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setShowMusicButton(true);
      } else {
        audioRef.current.volume = 0.15;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <>
      {/* Background Moroccan Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://res.cloudinary.com/dzefefwb2/video/upload/v1764778883/moroccan-music_pw9duw.mp3"
      />

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        onMouseEnter={() => setShowMusicButton(true)}
        className={`fixed bottom-6 left-6 z-50 backdrop-blur-md bg-white/10 border border-white/20 text-white p-3 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 ${
          showMusicButton ? 'opacity-100' : 'opacity-40 hover:opacity-100'
        }`}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      <RouterProvider router={router} />
    </>
  );
}

export default App;

