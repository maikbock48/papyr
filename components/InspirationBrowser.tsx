'use client';

import { useState, useEffect } from 'react';
import inspirationData from '@/lib/inspirationData.json';
import RitualPopup from './RitualPopup';

interface InspirationBrowserProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryKey = keyof typeof inspirationData.categories;

export default function InspirationBrowser({ isOpen, onClose }: InspirationBrowserProps) {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('verbindung');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [showRitualPopup, setShowRitualPopup] = useState(false);

  const categories = inspirationData.categories;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
      shuffleItems();
    } else {
      setShow(false);
    }
  }, [isOpen, selectedCategory]);

  const shuffleItems = () => {
    const category = categories[selectedCategory];
    const shuffled = [...category.items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setCurrentIndex(0); // Reset to first item
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(shuffledItems.length - 1); // Loop to end
    }
  };

  const handleShuffle = () => {
    shuffleItems();
  };

  const handleCopy = () => {
    const currentItem = shuffledItems[currentIndex];
    if (currentItem) {
      setShowRitualPopup(true);
    }
  };

  if (!isOpen) return null;

  const currentItem = shuffledItems[currentIndex] || '';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'backdrop-blur-md' : ''
      }`}
      onClick={handleClose}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0)' }}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] bg-white border-2 shadow-2xl rounded-2xl transform transition-all duration-300 overflow-hidden flex flex-col ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ borderColor: '#2d2e2e' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b-2 flex-shrink-0 relative" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#2d2e2e' }}>
              Lass dich von der Community inspirieren!
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 hover:opacity-70 transition-opacity text-3xl font-bold"
            style={{ color: '#2d2e2e' }}
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-4 border-b-2 flex-shrink-0" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(categories) as CategoryKey[]).map((key) => {
              const category = categories[key];
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`px-4 py-3 font-bold border-2 rounded-xl transition-all shadow-md ${
                    selectedCategory === key
                      ? 'bg-black text-white scale-105 shadow-lg'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: '#2d2e2e',
                    color: selectedCategory === key ? 'white' : '#2d2e2e'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - Single Card with Navigation */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          {/* Card */}
          <div className="relative w-full max-w-2xl">
            <div className="bg-white border-2 rounded-2xl p-8 md:p-12 shadow-xl min-h-[200px] flex items-center justify-center" style={{ borderColor: '#2d2e2e' }}>
              <p className="text-2xl md:text-4xl font-bold text-center leading-relaxed" style={{ color: '#2d2e2e' }}>
                {currentItem}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-black text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-gray-900 transition-all hover:scale-110 border-2 shadow-xl"
              style={{ borderColor: '#2d2e2e' }}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-black text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-gray-900 transition-all hover:scale-110 border-2 shadow-xl"
              style={{ borderColor: '#2d2e2e' }}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <div className="mt-6 text-center">
            <p className="text-lg font-medium" style={{ color: '#666' }}>
              {currentIndex + 1} / {shuffledItems.length}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t-2 flex-shrink-0" style={{ backgroundColor: 'rgb(206, 205, 203)', borderColor: '#2d2e2e' }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-white px-6 py-3 text-lg font-bold hover:bg-gray-50 transition-all hover:scale-105 border-2 rounded-xl shadow-md"
              style={{ borderColor: '#2d2e2e', color: '#2d2e2e' }}
            >
              Kopieren
            </button>
            <button
              onClick={handleShuffle}
              className="flex-1 bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-all hover:scale-105 border-2 rounded-xl shadow-md"
              style={{ borderColor: '#2d2e2e' }}
            >
              🎲 Mischen
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-white px-6 py-3 text-lg font-bold hover:bg-gray-50 transition-all hover:scale-105 border-2 rounded-xl shadow-md"
              style={{ borderColor: '#2d2e2e', color: '#2d2e2e' }}
            >
              Schließen
            </button>
          </div>
        </div>
      </div>

      {/* Ritual Popup */}
      <RitualPopup
        isOpen={showRitualPopup}
        onClose={() => setShowRitualPopup(false)}
        inspirationText={currentItem}
      />
    </div>
  );
}
