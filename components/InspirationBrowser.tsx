'use client';

import { useState, useEffect } from 'react';
import inspirationData from '@/lib/inspirationData.json';

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
      navigator.clipboard.writeText(currentItem);
      alert(`"${currentItem}" in die Zwischenablage kopiert!`);
    }
  };

  if (!isOpen) return null;

  const currentItem = shuffledItems[currentIndex] || '';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] bg-cream border-8 border-brown shadow-2xl rounded-3xl transform transition-all duration-300 overflow-hidden flex flex-col ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brown text-cream px-6 py-4 border-b-4 border-brown flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              🎲 Stöberkiste
            </h2>
            <button
              onClick={handleClose}
              className="text-cream hover:text-vintage transition-colors text-3xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-sm md:text-base text-cream/80 mt-2">
            Lass dich inspirieren von anderen Zielen
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-vintage/20 px-4 py-3 border-b-4 border-brown/20 flex-shrink-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {(Object.keys(categories) as CategoryKey[]).map((key) => {
              const category = categories[key];
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`px-4 py-2 font-bold border-4 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-brown text-cream border-brown scale-105'
                      : 'bg-white text-brown border-brown hover:bg-vintage/30'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - Single Card with Navigation */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col items-center justify-center">
          {/* Card */}
          <div className="relative w-full max-w-2xl">
            <div className="bg-white border-8 border-brown rounded-2xl p-8 md:p-12 shadow-2xl min-h-[200px] flex items-center justify-center">
              <p className="text-2xl md:text-4xl text-brown font-bold text-center leading-relaxed">
                {currentItem}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-brown text-cream w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-brown/90 transition-all hover:scale-110 border-4 border-brown shadow-xl"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-brown text-cream w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-brown/90 transition-all hover:scale-110 border-4 border-brown shadow-xl"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <div className="mt-6 text-center">
            <p className="text-lg text-brown/70 font-medium">
              {currentIndex + 1} / {shuffledItems.length}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-vintage/20 px-6 py-4 border-t-4 border-brown/20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-vintage text-brown px-6 py-3 text-lg font-bold hover:bg-vintage/80 transition-colors border-4 border-brown rounded-xl"
            >
              📋 Kopieren
            </button>
            <button
              onClick={handleShuffle}
              className="flex-1 bg-brown text-cream px-6 py-3 text-lg font-bold hover:bg-brown/90 transition-colors border-4 border-brown rounded-xl"
            >
              🎲 Mischen
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-cream text-brown px-6 py-3 text-lg font-bold hover:bg-vintage/30 transition-colors border-4 border-brown rounded-xl"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
