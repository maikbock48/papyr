'use client';

import { useState, useEffect } from 'react';

interface ConfirmDialogButton {
  text: string;
  action: () => void;
  primary?: boolean;
  danger?: boolean;
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  buttons: ConfirmDialogButton[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  buttons,
  isOpen,
  onClose
}: ConfirmDialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    setShow(false);
    setTimeout(() => {
      action();
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        show ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`max-w-md w-full bg-cream border-8 border-brown shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brown text-cream px-6 py-4 border-b-4 border-brown">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-base md:text-lg text-brown leading-relaxed whitespace-pre-line text-center">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleAction(button.action)}
              className={`w-full px-6 py-3 text-base md:text-lg font-bold transition-all border-4 rounded-xl ${
                button.danger
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:scale-105'
                  : button.primary
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
