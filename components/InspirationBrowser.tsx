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
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('gesundheit');
  const [randomItems, setRandomItems] = useState<string[]>([]);

  const categories = inspirationData.categories;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
      loadRandomItems();
    } else {
      setShow(false);
    }
  }, [isOpen, selectedCategory]);

  const loadRandomItems = () => {
    const category = categories[selectedCategory];
    const shuffled = [...category.items].sort(() => Math.random() - 0.5);
    setRandomItems(shuffled.slice(0, 20)); // Show 20 random items
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    loadRandomItems();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] bg-cream border-8 border-brown shadow-2xl transform transition-all duration-300 overflow-hidden flex flex-col ${
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
                  className={`px-4 py-2 font-bold border-4 transition-all whitespace-nowrap ${
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {randomItems.map((item, index) => (
              <div
                key={index}
                className="bg-white border-4 border-brown p-4 hover:bg-vintage/20 transition-colors cursor-pointer group"
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(item);
                  alert(`"${item}" in die Zwischenablage kopiert!`);
                }}
              >
                <p className="text-brown font-medium group-hover:font-bold transition-all">
                  {item}
                </p>
                <p className="text-xs text-brown/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Klicken zum Kopieren
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-vintage/20 px-6 py-4 border-t-4 border-brown/20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex-1 bg-brown text-cream px-6 py-3 text-lg font-bold hover:bg-brown/90 transition-colors border-4 border-brown"
            >
              🎲 Neue Inspirationen laden
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-cream text-brown px-6 py-3 text-lg font-bold hover:bg-vintage/30 transition-colors border-4 border-brown"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
