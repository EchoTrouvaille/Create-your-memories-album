
import React from 'react';
import { MemoryPhoto } from '../types';

interface VinylRecordProps {
  photo: MemoryPhoto;
  isRevealed: boolean;
  index: number;
}

export const VinylRecord: React.FC<VinylRecordProps> = ({ photo, isRevealed, index }) => {
  const baseDelay = index * 150;

  return (
    <div 
      className={`absolute transition-all duration-1000 ease-out z-10
        ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      style={{
        left: `${photo.x}%`,
        top: `${photo.y}%`,
        transform: `translate(-50%, -50%) rotate(${photo.rotation}deg)`,
        transitionDelay: `${baseDelay}ms`
      }}
    >
      <div className="relative group cursor-pointer">
        {/* Record Body */}
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-neutral-900 vinyl-grooves border-2 border-neutral-800 flex items-center justify-center record-shadow group-hover:scale-105 transition-transform">
          {/* Inner Label */}
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white overflow-hidden border-2 border-neutral-900 flex items-center justify-center relative">
            <img 
              src={photo.url} 
              alt={`Month ${photo.month}`} 
              className="w-full h-full object-cover grayscale-[0.3]"
            />
            {/* Spindle Hole */}
            <div className="absolute w-2 h-2 bg-[#f4f1ea] rounded-full shadow-inner"></div>
          </div>
          {/* Month Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="font-mono text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Chapter {photo.month}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
