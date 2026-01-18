
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { loadImage, processImage, formatBytes } from '../utils/imageUtils';
import { ProcessingResult, ImageFormat } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

const Resizer: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessingResult | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(85);

  const handleUpload = async (file: File) => {
    setOriginalFile(file);
    setIsProcessing(true);
    try {
      const img = await loadImage(file);
      setWidth(img.width);
      setHeight(img.height);
      setOriginalRatio(img.width / img.height);
      const result = await processImage(img, { width: img.width, height: img.height, format: targetFormat, quality });
      setProcessedResult(result);
    } catch (err) {
      alert("Failed to load image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && originalRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && originalRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  const applyResize = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    try {
      const img = await loadImage(originalFile);
      const result = await processImage(img, { 
        width: width || img.width, 
        height: height || img.height, 
        format: targetFormat,
        quality: quality
      });
      setProcessedResult(result);
    } catch (err) {
      alert("Resize failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult.url;
    const ext = targetFormat.split('/')[1];
    link.download = `resized_${originalFile?.name.split('.')[0] || 'image'}.${ext}`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Resize & Optimize</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Width</label>
                  <input
                    type="number" value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Height</label>
                  <input
                    type="number" value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer mb-4">
                <input
                  type="checkbox" checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-gray-700">Maintain Aspect Ratio</span>
              </label>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Format</label>
                <select 
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm"
                >
                  <option value="image/webp">WebP (Optimized)</option>
                  <option value="image/jpeg">JPG (Standard)</option>
                  <option value="image/png">PNG (Lossless)</option>
                </select>

                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Quality</label>
                  <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                </div>
                <input
                  type="range" min="1" max="100" value={quality}
                  disabled={targetFormat === 'image/png'}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                disabled={!originalFile || isProcessing}
                onClick={applyResize}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm mt-4"
              >
                {isProcessing ? 'Processing...' : 'Apply & Preview'}
              </button>
            </div>
          </div>
          <AdPlaceholder slot="resizer_sidebar" />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!originalFile ? (
            <ImageUploader onUpload={handleUpload} isLoading={isProcessing} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-4 overflow-hidden flex items-center justify-center min-h-[350px] border border-gray-100 relative">
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    ) : (
                      processedResult && <img src={processedResult.url} className="max-h-[500px] object-contain shadow-sm" alt="Resized" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-indigo-50/50 p-3 rounded-xl">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase">Dimensions</p>
                      <p className="text-sm font-bold text-indigo-900">{processedResult?.width}x{processedResult?.height}</p>
                    </div>
                    <div className="bg-indigo-50/50 p-3 rounded-xl">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase">Format</p>
                      <p className="text-sm font-bold text-indigo-900">{targetFormat.split('/')[1].toUpperCase()}</p>
                    </div>
                    <div className="bg-indigo-50/50 p-3 rounded-xl">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase">Quality</p>
                      <p className="text-sm font-bold text-indigo-900">{targetFormat === 'image/png' ? '100%' : `${quality}%`}</p>
                    </div>
                    <div className="bg-indigo-50/50 p-3 rounded-xl">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase">Result Size</p>
                      <p className="text-sm font-bold text-indigo-900">{processedResult ? formatBytes(processedResult.size) : '--'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      disabled={!processedResult || isProcessing}
                      onClick={download}
                      className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                    >
                      Download Resized Image
                    </button>
                    <button
                      onClick={() => setOriginalFile(null)}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                    >
                      New
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resizer;
