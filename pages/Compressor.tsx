
import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../components/ImageUploader';
import { loadImage, processImage, formatBytes } from '../utils/imageUtils';
import { ProcessingResult, ImageFormat } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

const Compressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessingResult | null>(null);
  const [targetKB, setTargetKB] = useState<number>(100);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const resultUrlRef = useRef<string | null>(null);

  const handleUpload = (file: File) => {
    setOriginalFile(file);
    const initialFmt = file.type === 'image/png' ? 'image/webp' : (file.type as ImageFormat);
    setTargetFormat(initialFmt);
    setProcessedResult(null);
  };

  const handleCompress = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    try {
      const img = await loadImage(originalFile);
      const result = await processImage(img, { targetSizeKB: targetKB, format: targetFormat });
      
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = result.url;
      setProcessedResult(result);
    } catch (err) {
      alert('Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (originalFile) {
      const timer = setTimeout(handleCompress, 300);
      return () => clearTimeout(timer);
    }
  }, [originalFile, targetKB, targetFormat]);

  const downloadImage = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult.url;
    const ext = processedResult.format.split('/')[1];
    link.download = `compressed_${targetKB}kb_${originalFile?.name.split('.')[0]}.${ext}`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Compressor Settings</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Target Size: <span className="text-indigo-600 font-extrabold">{targetKB} KB</span></label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[50, 100, 200, 500].map(kb => (
                  <button
                    key={kb}
                    onClick={() => setTargetKB(kb)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${targetKB === kb ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Under {kb}KB
                  </button>
                ))}
              </div>
              <input
                type="range" min="10" max="2000" step="10" value={targetKB}
                onChange={(e) => setTargetKB(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Output Format</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setTargetFormat('image/webp')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${targetFormat === 'image/webp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                  WebP (Best)
                </button>
                <button 
                  onClick={() => setTargetFormat('image/jpeg')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${targetFormat === 'image/jpeg' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                  JPG
                </button>
              </div>
            </div>
          </div>
          <AdPlaceholder slot="compressor_sidebar" />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!originalFile ? (
            <ImageUploader onUpload={handleUpload} isLoading={isProcessing} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Original ({formatBytes(originalFile.size)})</p>
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                    <img src={URL.createObjectURL(originalFile)} className="max-h-full object-contain" alt="Original" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase">Compressed ({processedResult ? formatBytes(processedResult.size) : '--'})</p>
                    {processedResult && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded">-{Math.round((1 - processedResult.size/originalFile.size)*100)}%</span>
                    )}
                  </div>
                  <div className="aspect-square bg-indigo-50/20 rounded-xl overflow-hidden border border-indigo-100 flex items-center justify-center relative">
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    ) : (
                      processedResult && <img src={processedResult.url} className="max-h-full object-contain" alt="Compressed" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  disabled={!processedResult || isProcessing}
                  onClick={downloadImage}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  Download Compressed {targetFormat === 'image/webp' ? 'WebP' : 'JPG'}
                </button>
                <button
                  onClick={() => setOriginalFile(null)}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compressor;
