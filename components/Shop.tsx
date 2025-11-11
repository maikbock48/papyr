'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

export default function Shop() {
  const appState = getAppState();
  const isPro = appState.isPro;

  const products = [
    {
      id: 1,
      name: 'PAPYR T-Shirt',
      description: 'Premium T-Shirt mit PAPYR-Logo. 100% Bio-Baumwolle.',
      price: '29,99€',
      image: '/assets/PAPYR.png',
      badge: '+ gratis 20x20cm PAPYR-Block',
    },
    {
      id: 2,
      name: 'PAPYR Hoodie',
      description: 'Warmer Hoodie für kalte Abende. Perfekt für die Stunde des Wolfs.',
      price: '49,99€',
      image: '/assets/PAPYR.png',
      badge: '+ gratis 20x20cm PAPYR-Block',
    },
    {
      id: 3,
      name: 'PAPYR Notizblock (20x20cm)',
      description: 'Der offizielle PAPYR-Block. 50 Blatt, perfekt für deine Bekenntnisse.',
      price: '9,99€',
      image: '/assets/PAPYR.png',
    },
    {
      id: 4,
      name: 'PAPYR Stift-Set',
      description: '3 hochwertige Stifte. Schwarz auf weiß. Kein Schnickschnack.',
      price: '12,99€',
      image: '/assets/PAPYR.png',
    },
    {
      id: 5,
      name: 'PAPYR Cap',
      description: 'Streetwear trifft Disziplin. Für echte Macher.',
      price: '24,99€',
      image: '/assets/PAPYR.png',
      badge: '+ gratis 20x20cm PAPYR-Block',
    },
    {
      id: 6,
      name: 'PAPYR Komplettset',
      description: 'T-Shirt, Block, Stifte. Alles was du brauchst zum Starten.',
      price: '44,99€',
      originalPrice: '52,97€',
      image: '/assets/PAPYR.png',
      badge: 'SPAR 15%',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4" >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#2d2e2e' }}>
            PAPYR SHOP
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#666' }}>
            Echte Profis nutzen echtes Papier. Zu jedem Oberteil gibt's einen 20x20cm PAPYR-Block kostenlos dazu.
          </p>
          {isPro && (
            <div className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg">
              🎉 Als Pro-Member: 20% Rabatt auf alles!
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mb-12 bg-white p-6 md:p-8 border-2 shadow-lg rounded-xl" style={{ borderColor: '#e0e0e0' }}>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-4xl">💚</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                Jeder Kauf unterstützt soziale Projekte
              </h3>
              <p style={{ color: '#666' }}>
                Von jedem verkauften Produkt fließen 2€ direkt in Bildungsprojekte für benachteiligte Jugendliche.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              style={{ borderColor: '#e0e0e0' }}
            >
              <div className="relative mb-4">
                <div className="aspect-square bg-gray-50 border-2 rounded-xl flex items-center justify-center" style={{ borderColor: '#e0e0e0' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                {product.badge && (
                  <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-xs font-bold rounded-lg transform rotate-12 shadow-md">
                    {product.badge}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2" style={{ color: '#2d2e2e' }}>
                {product.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: '#666' }}>
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#2d2e2e' }}>
                    {product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm line-through" style={{ color: '#999' }}>
                      {product.originalPrice}
                    </div>
                  )}
                </div>
                {isPro && (
                  <div className="bg-black text-white px-3 py-1 text-xs font-bold rounded-lg shadow-sm">
                    -20% PRO
                  </div>
                )}
              </div>

              <button
                onClick={() => alert('Shop-Integration kommt bald! 🚀')}
                className="w-full bg-black text-white px-6 py-3 text-lg font-bold hover:bg-gray-900 transition-colors shadow-md rounded-xl"
              >
                In den Warenkorb
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white border-2 rounded-2xl p-8 max-w-2xl shadow-lg" style={{ borderColor: '#e0e0e0' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2d2e2e' }}>
              Noch Fragen?
            </h3>
            <p className="mb-4" style={{ color: '#666' }}>
              Versand innerhalb von 2-3 Werktagen. Kostenloser Versand ab 50€.
            </p>
            <p className="text-sm" style={{ color: '#999' }}>
              Alle Produkte werden nachhaltig und fair produziert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
