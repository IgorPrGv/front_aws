// src/components/ui/ImageModal.tsx
import React from 'react';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  isOpen: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} 
    >
      <div className="relative p-4 max-w-4xl max-h-full">
        <button
          className="absolute top-2 right-2 text-white text-3xl font-bold p-2"
          onClick={onClose}
        >
          &times; {/* Caractere 'X' */}
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
};