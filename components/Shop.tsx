'use client';

import { useState } from 'react';
import { getAppState } from '@/lib/storage';

export default function Shop() {
  const appState = getAppState();
  const isPro = appState.hasPaid; // TODO: differentiate between basic paid and pro

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
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-brown mb-4">
            PAPYR SHOP
          </h1>
          <p className="text-lg md:text-xl text-brown/70 max-w-2xl mx-auto">
            Echte Profis nutzen echtes Papier. Zu jedem Oberteil gibt's einen 20x20cm PAPYR-Block kostenlos dazu.
          </p>
          {isPro && (
            <div className="mt-6 inline-block bg-vintage text-brown px-6 py-3 rounded-full font-bold border-4 border-brown">
              🎉 Als Pro-Member: 20% Rabatt auf alles!
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mb-12 bg-brown text-cream p-6 md:p-8 border-4 border-brown shadow-xl rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-4xl">💚</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Jeder Kauf unterstützt soziale Projekte
              </h3>
              <p className="text-cream/90">
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
              className="bg-white border-4 border-brown rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="relative mb-4">
                <div className="aspect-square bg-vintage/20 border-2 border-brown/30 rounded-xl flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                {product.badge && (
                  <div className="absolute -top-3 -right-3 bg-vintage text-brown px-3 py-1 text-xs font-bold border-2 border-brown rounded-lg transform rotate-12">
                    {product.badge}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-brown mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-brown/70 mb-4">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-brown">
                    {product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-brown/50 line-through">
                      {product.originalPrice}
                    </div>
                  )}
                </div>
                {isPro && (
                  <div className="bg-vintage text-brown px-3 py-1 text-xs font-bold border-2 border-brown rounded-lg">
                    -20% PRO
                  </div>
                )}
              </div>

              <button
                onClick={() => alert('Shop-Integration kommt bald! 🚀')}
                className="w-full bg-brown text-cream px-6 py-3 text-lg font-bold hover:bg-brown/90 transition-colors border-4 border-brown shadow-lg rounded-xl"
              >
                In den Warenkorb
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white border-4 border-brown/30 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-2xl font-bold text-brown mb-4">
              Noch Fragen?
            </h3>
            <p className="text-brown/70 mb-4">
              Versand innerhalb von 2-3 Werktagen. Kostenloser Versand ab 50€.
            </p>
            <p className="text-sm text-brown/50">
              Alle Produkte werden nachhaltig und fair produziert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
