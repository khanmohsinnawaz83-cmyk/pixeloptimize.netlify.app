
import React, { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import { loadImage, formatBytes, processImage } from '../utils/imageUtils';
import { ImageMetadata, ProcessingResult } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

const SizeChecker: React.FC = () => {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [simulation, setSimulation] = useState<ProcessingResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleUpload = async (file: File) => {
    setIsSimulating(true);
    try {
      const img = await loadImage(file);
      setMetadata({
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.width,
        height: img.height,
        previewUrl: URL.createObjectURL(file)
      });
      
      // Auto-simulate a 75% quality WebP conversion for comparison
      const sim = await processImage(img, { format: 'image/webp', quality: 75 });
      setSimulation(sim);
    } catch (err) {
      alert("Error reading file info.");
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (simulation?.url) URL.revokeObjectURL(simulation.url);
      if (metadata?.previewUrl) URL.revokeObjectURL(metadata.previewUrl);
    };
  }, [simulation, metadata]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {!metadata ? (
            <ImageUploader onUpload={handleUpload} isLoading={isSimulating} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center mb-8 shadow-inner">
                 <img src={metadata.previewUrl} className="max-h-full object-contain" alt="Preview" />
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Dimensions</p>
                    <p className="text-sm font-bold text-gray-700">{metadata.width} &times; {metadata.height}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current Size</p>
                    <p className="text-sm font-bold text-gray-700">{formatBytes(metadata.size)}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Format</p>
                    <p className="text-sm font-bold text-gray-700">{metadata.type.split('/')[1].toUpperCase()}</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Resolution</p>
                    <p className="text-sm font-bold text-gray-700">{(metadata.width * metadata.height / 1000000).toFixed(2)} MP</p>
                 </div>
               </div>

               {simulation && (
                 <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                      <h4 className="font-bold text-lg mb-1">Optimization Potential</h4>
                      <p className="text-indigo-100 text-sm">We can shrink this to <span className="font-bold">{formatBytes(simulation.size)}</span> using WebP conversion.</p>
                    </div>
                    <div className="bg-white/10 px-6 py-2 rounded-full font-extrabold text-2xl">
                      -{Math.round((1 - simulation.size / metadata.size) * 100)}%
                    </div>
                 </div>
               )}

               <div className="flex gap-4">
                 <button
                   onClick={() => setMetadata(null)}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all"
                 >
                   Check New Image
                 </button>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <AdPlaceholder slot="checker_sidebar" />
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Detailed Info</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">File Name</span>
                <span className="font-medium text-gray-700 truncate max-w-[120px]">{metadata?.name || '--'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">Orientation</span>
                <span className="font-medium text-gray-700">{metadata ? (metadata.width > metadata.height ? 'Landscape' : 'Portrait') : '--'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">AspectRatio</span>
                <span className="font-medium text-gray-700">{metadata ? (metadata.width / metadata.height).toFixed(2) + ':1' : '--'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChecker;
