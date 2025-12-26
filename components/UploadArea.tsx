
import React from 'react';

interface UploadAreaProps {
  onFilesSelected: (files: FileList) => void;
  count: number;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected, count }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-2 border-dashed border-neutral-400 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm transition-all hover:border-neutral-600 group">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-serif mb-2 text-neutral-800">Curation of Memories</h3>
      <p className="text-neutral-500 font-serif italic mb-8">Select 12 frames to compose your annual anthology ({count}/12 selected)</p>
      
      <label className="inline-block px-10 py-4 bg-neutral-900 text-white rounded-full cursor-pointer hover:bg-neutral-800 transition-colors font-mono uppercase tracking-widest text-sm shadow-xl active:scale-95">
        Choose Files
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleInputChange} 
        />
      </label>
      
      <p className="mt-6 text-[10px] text-neutral-400 font-mono uppercase">Accepted: JPEG, PNG, WEBP</p>
    </div>
  );
};
