
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith('image/')) {
        onUpload(files[0]);
        // Reset key to allow re-upload of same file
        setInputKey(Date.now());
      } else {
        alert("Please upload a valid image file (JPG, PNG, or WebP).");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
      // Reset key so selecting the same file again triggers onChange
      setInputKey(Date.now());
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-72 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center cursor-pointer group shadow-sm ${
        isDragging 
          ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]' 
          : 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-gray-50'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        key={inputKey}
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title=""
      />
      
      <div className="text-center px-6 pointer-events-none">
        <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
          isDragging ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {isDragging ? 'Drop it here!' : 'Click or Drag Image'}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Upload any JPG, PNG or WebP image. Processing is 100% private and stays in your browser.
        </p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-3"></div>
            <p className="text-indigo-600 font-bold text-sm">Loading Image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
