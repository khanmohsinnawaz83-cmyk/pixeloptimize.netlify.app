
import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../components/ImageUploader';
import { loadImage, processImage, formatBytes } from '../utils/imageUtils';
import { ProcessingResult, ImageFormat } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

const Converter: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessingResult | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [targetKB, setTargetKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const resultUrlRef = useRef<string | null>(null);

  const handleUpload = async (file: File) => {
    // Revoke any existing URLs before new upload
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setProcessedResult(null);
    setOriginalFile(file);
    await startProcessing(file, targetFormat, quality, targetKB);
  };

  const startProcessing = async (file: File, fmt: ImageFormat, q: number, tkb: number | null) => {
    setIsProcessing(true);
    try {
      const img = await loadImage(file);
      const result = await processImage(img, { 
        format: fmt, 
        quality: q,
        targetSizeKB: tkb || undefined
      });
      
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = result.url;
      setProcessedResult(result);
    } catch (err) {
      alert('Processing failed. The image might be too large or an unsupported type.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSettingsChange = async (fmt?: ImageFormat, q?: number, tkb?: number | null) => {
    const newFmt = fmt ?? targetFormat;
    const newQ = q ?? quality;
    const newTkb = tkb === undefined ? targetKB : tkb;

    setTargetFormat(newFmt);
    setQuality(newQ);
    setTargetKB(newTkb);

    if (originalFile) {
      await startProcessing(originalFile, newFmt, newQ, newTkb);
    }
  };

  const download = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult.url;
    const ext = targetFormat.split('/')[1];
    link.download = `pixeloptimize_${originalFile?.name.split('.')[0] || 'image'}.${ext}`;
    link.click();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Target Format</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { label: 'WebP', value: 'image/webp' },
                { label: 'JPG', value: 'image/jpeg' },
                { label: 'PNG', value: 'image/png' }
              ].map(fmt => (
                <button
                  key={fmt.value}
                  onClick={() => handleSettingsChange(fmt.value as ImageFormat)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${targetFormat === fmt.value ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-800 mb-4">Compression Type</h3>
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button 
                onClick={() => handleSettingsChange(undefined, undefined, null)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${targetKB === null ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
              >
                Quality Based
              </button>
              <button 
                onClick={() => handleSettingsChange(undefined, undefined, 100)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${targetKB !== null ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
              >
                Target Size (KB)
              </button>
            </div>

            {targetKB === null ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Quality</label>
                  <span className="text-indigo-600 font-bold">{quality}%</span>
                </div>
                <input
                  type="range" min="1" max="100" value={quality}
                  disabled={targetFormat === 'image/png'}
                  onChange={(e) => handleSettingsChange(undefined, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                {targetFormat === 'image/png' && <p className="text-[10px] text-orange-500">Note: PNG is lossless. Setting quality only works for JPG/WebP.</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Target KB</label>
                  <span className="text-indigo-600 font-bold">{targetKB} KB</span>
                </div>
                <input
                  type="range" min="10" max="2000" step="10" value={targetKB}
                  onChange={(e) => handleSettingsChange(undefined, undefined, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}
          </div>
          <AdPlaceholder slot="converter_sidebar" />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!originalFile ? (
            <ImageUploader onUpload={handleUpload} isLoading={isProcessing} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex flex-col md:flex-row gap-6 items-stretch mb-8">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Original</p>
                    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 mb-2 p-2">
                      <img src={URL.createObjectURL(originalFile)} className="max-h-full object-contain shadow-sm rounded" alt="Original" />
                    </div>
                    <div className="text-sm font-bold text-gray-700">{formatBytes(originalFile.size)}</div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="bg-indigo-50 p-4 rounded-full text-indigo-500 shadow-inner">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Optimized</p>
                    <div className="aspect-square bg-indigo-50/20 rounded-xl overflow-hidden flex items-center justify-center border border-indigo-100 relative mb-2 p-2">
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                      ) : (
                        processedResult && <img src={processedResult.url} className="max-h-full object-contain shadow-md rounded" alt="Converted" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-indigo-700">
                      {processedResult ? formatBytes(processedResult.size) : '--'}
                      {processedResult && originalFile && (
                        <span className={`ml-2 text-[10px] ${processedResult.size < originalFile.size ? 'text-green-500' : 'text-orange-400'}`}>
                          ({processedResult.size < originalFile.size ? '-' : '+'}{Math.abs(Math.round((1 - processedResult.size / originalFile.size) * 100))}%)
                        </span>
                      )}
                    </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button
                    disabled={!processedResult || isProcessing}
                    onClick={download}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    Download Optimized Image
                  </button>
                  <button
                    onClick={() => {
                      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
                      setOriginalFile(null);
                      setProcessedResult(null);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all"
                  >
                    Reset
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <section className="prose prose-indigo max-w-none bg-white p-8 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Image Converter & Compressor</h2>
        <p className="text-gray-600 text-sm mb-4">Our tool runs entirely in your browser using the Canvas API. This means your images are never uploaded to any server, ensuring 100% privacy and blazing fast speeds. You can convert to WebP to save up to 80% on file size while keeping your blog images crisp.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-indigo-500 font-bold">✓</span>
            <span>Supports JPG, PNG, and WebP formats.</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-indigo-500 font-bold">✓</span>
            <span>Client-side only processing (Zero latency).</span>
          </div>
        </div>
      </section>
      
      <AdPlaceholder slot="converter_bottom" />
    </div>
  );
};

export default Converter;
