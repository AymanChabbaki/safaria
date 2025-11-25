/**
 * ============================================================
 * SAFARIA Platform - Chat Assistant Widget
 * ============================================================
 * Floating chat bubble with FAQ responses
 * ============================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, MapPin, CreditCard, RefreshCw, Phone } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import chatResponses from '../data/chatResponses.json';

const ChatWidget = () => {
  const { language } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showFAQ, setShowFAQ] = useState(true);

  const responses = chatResponses[language] || chatResponses.fr;

  const handleFAQClick = (key) => {
    const response = responses[key];
    if (response) {
      setMessages([
        ...messages,
        { type: 'user', text: response.question },
        { type: 'bot', text: response.answer }
      ]);
      setShowFAQ(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setShowFAQ(true);
  };

  const faqButtons = [
    { key: 'itineraries', Icon: MapPin, color: 'chefchaouen' },
    { key: 'payment', Icon: CreditCard, color: 'oasis' },
    { key: 'cancellation', Icon: RefreshCw, color: 'desert' },
    { key: 'contact', Icon: Phone, color: 'morocco-red' }
  ];

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-2 z-[9999] w-24 h-24 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src="/logoSAFARIA.png" 
          alt="SAFARIA" 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-2 right-2 z-[9998] w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-chefchaouen-500 to-desert-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center p-2.5">
                    <img 
                      src="/logoSAFARIA.png" 
                      alt="SAFARIA" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Assistant SAFARIA</h3>
                    <p className="text-sm text-white/90">En ligne</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="text-white/80 hover:text-white transition text-sm flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" /> Nouveau
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition p-1 hover:bg-white/20 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-sand-50 space-y-3">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-700">{responses.greeting}</p>
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-chefchaouen-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ Buttons */}
            {showFAQ && (
              <div className="p-4 bg-white border-t border-sand-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Questions fréquentes :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {faqButtons.map(btn => {
                    const Icon = btn.Icon;
                    return (
                      <button
                        key={btn.key}
                        onClick={() => handleFAQClick(btn.key)}
                        className={`p-3 bg-gradient-to-br from-${btn.color}-50 to-${btn.color}-100 hover:from-${btn.color}-100 hover:to-${btn.color}-200 text-${btn.color}-700 rounded-lg text-left text-sm font-medium transition-all hover:shadow-md flex items-start gap-2`}
                      >
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>{responses[btn.key]?.question}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Back to FAQ */}
            {!showFAQ && (
              <div className="p-4 bg-white border-t border-sand-200">
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-sand-100 hover:bg-sand-200 text-gray-700 rounded-lg font-medium transition"
                >
                  ← Retour aux questions
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
