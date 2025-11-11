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
        show ? 'backdrop-blur-md' : ''
      }`}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0)' }}
    >
      <div
        className={`max-w-2xl w-full bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ border: '0.5px solid black' }}
      >
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 border-b-2" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          <p className="text-lg md:text-xl leading-relaxed whitespace-pre-line" style={{ color: '#2d2e2e' }}>
            {text}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 space-y-3" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleAction(button.action)}
              className={`w-full px-6 py-4 text-lg md:text-xl font-bold transition-all rounded-xl border-2 shadow-md ${
                index === 0
                  ? 'bg-black text-white hover:bg-gray-900 hover:scale-105'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={index === 0 ? { borderColor: 'transparent' } : { borderColor: '#e0e0e0', color: '#2d2e2e' }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
