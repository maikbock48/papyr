'use client';

import { useState, useEffect } from 'react';

interface PopupButton {
  text: string;
  action: string;
}

interface OnboardingPopupProps {
  title: string;
  text: string;
  buttons: PopupButton[];
  onAction: (action: string) => void;
  isVisible: boolean;
}

export default function OnboardingPopup({
  title,
  text,
  buttons,
  onAction,
  isVisible
}: OnboardingPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay for smooth appearance
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleAction = (action: string) => {
    setShow(false);
    setTimeout(() => onAction(action), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
    >
      <div
        className={`max-w-2xl w-full bg-cream border-8 border-brown shadow-2xl transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-brown text-cream px-6 py-4 border-b-4 border-brown">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <p className="text-lg md:text-xl text-brown leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleAction(button.action)}
              className={`w-full px-6 py-4 text-lg md:text-xl font-bold transition-all border-4 ${
                index === 0
                  ? 'bg-brown text-cream border-brown hover:bg-brown/90 hover:scale-105'
                  : 'bg-cream text-brown border-brown hover:bg-vintage/30'
              }`}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
