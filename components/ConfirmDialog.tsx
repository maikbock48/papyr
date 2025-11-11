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
        show ? 'backdrop-blur-sm' : ''
      }`}
      onClick={onClose}
      style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)' }}
    >
      <div
        className={`max-w-md w-full bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ border: '0.5px solid black' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 border-b-2" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-xl md:text-2xl font-bold text-center">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-line text-center" style={{ color: '#2d2e2e' }}>
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 space-y-3" style={{ backgroundColor: 'rgb(206, 205, 203)' }}>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleAction(button.action)}
              className={`w-full px-6 py-3 text-base md:text-lg font-bold transition-all rounded-xl border-2 ${
                button.danger
                  ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-md'
                  : button.primary
                  ? 'bg-black text-white hover:bg-gray-900 hover:scale-105 shadow-md'
                  : 'bg-white hover:bg-gray-50 shadow-sm'
              }`}
              style={button.danger || button.primary ? { borderColor: 'transparent' } : { borderColor: '#e0e0e0', color: '#2d2e2e' }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
