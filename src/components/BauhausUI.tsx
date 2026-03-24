import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Music, Video, Heart, ExternalLink, Info, Mail, StickyNote, FlaskConical } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bauhaus-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-bauhaus-white border-4 border-bauhaus-black shadow-[12px_12px_0px_0px_var(--bauhaus-black)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b-4 border-bauhaus-black bg-bauhaus-yellow">
              <h2 className="text-3xl font-display uppercase tracking-widest">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-bauhaus-black hover:text-bauhaus-white transition-colors border-2 border-bauhaus-black"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const BauhausButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'yellow' | 'black';
  className?: string;
  style?: React.CSSProperties;
}> = ({ onClick, children, variant = 'black', className = '', style }) => {
  const variants = {
    red: 'bg-bauhaus-red text-bauhaus-white hover:bg-bauhaus-black',
    blue: 'bg-bauhaus-blue text-bauhaus-white hover:bg-bauhaus-red',
    yellow: 'bg-bauhaus-yellow text-bauhaus-black hover:bg-bauhaus-blue hover:text-bauhaus-white',
    black: 'bg-bauhaus-black text-bauhaus-white hover:bg-bauhaus-yellow hover:text-bauhaus-black',
  };

  return (
    <button
      onClick={onClick}
      style={style}
      className={`
        px-4 py-3 text-xl font-display font-bold uppercase tracking-widest
        border-4 border-bauhaus-black transition-all duration-300
        active:translate-x-1 active:translate-y-1 active:shadow-none
        shadow-[6px_6px_0px_0px_var(--bauhaus-black)]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
