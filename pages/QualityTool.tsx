
import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../components/ImageUploader';
import { loadImage, processImage, formatBytes } from '../utils/imageUtils';
import { ProcessingResult, ImageFormat } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

const QualityTool: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessingResult | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track URL for revocation
  const currentUrlRef = useRef<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const img = await loadImage(file);
      setOriginalFile(file);
      setLoadedImage(img);
      // Determine best initial format (don't use PNG for quality control by default)
      const initialFormat = file.type === 'image/png' ? 'image/webp' : (file.type as ImageFormat);
      setTargetFormat(initialFormat);
      await runProcess(img, quality, initialFormat);
    } catch (err) {
      alert("Failed to load image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const runProcess = async (img: HTMLImageElement, q: number, fmt: ImageFormat) => {
    setIsProcessing(true);
    try {
      const result = await processImage(img, { quality: q, format: fmt });
      
      // Revoke old URL to save memory
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
      
      currentUrlRef.current = result.url;
      setProcessedResult(result);
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle slider/format changes with debounce
  useEffect(() => {
    if (loadedImage) {
      const timer = setTimeout(() => {
        runProcess(loadedImage, quality, targetFormat);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [quality, targetFormat, loadedImage]);

  const download = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult.url;
    const ext = targetFormat.split('/')[1];
    link.download = `quality_${quality}_${originalFile?.name.split('.')[0] || 'image'}.${ext}`;
    link.click();
  };

  const reset = () => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
    }
    setOriginalFile(null);
    setLoadedImage(null);
    setProcessedResult(null);
    currentUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Quality Settings</h3>
            
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Output Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTargetFormat('image/webp')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${targetFormat === 'image/webp' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  WebP
                </button>
                <button
                  onClick={() => setTargetFormat('image/jpeg')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${targetFormat === 'image/jpeg' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  JPEG
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">Note: Quality slider only works with lossy formats like WebP and JPEG.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Quality Level</label>
                <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-xs">{quality}%</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="pt-4">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Impact Analysis</p>
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    {quality > 85 
                      ? 'High Quality: Virtually no visible artifacts, but file size remains relatively large.' 
                      : quality > 40 
                        ? 'Optimal: Best balance for websites. Significant size reduction with good clarity.' 
                        : 'Low Quality: Maximum compression. Artifacts will be visible, recommended only for thumbnails.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <AdPlaceholder slot="quality_sidebar" />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!originalFile ? (
            <ImageUploader onUpload={handleUpload} isLoading={isProcessing} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="relative group rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shadow-inner min-h-[400px] flex items-center justify-center p-4">
                 {isProcessing && (
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                     <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                        <span className="font-bold text-gray-700 text-sm">Processing...</span>
                     </div>
                   </div>
                 )}
                 {processedResult && (
                   <img 
                    src={processedResult.url} 
                    className="max-h-[600px] object-contain shadow-2xl rounded-lg transition-opacity duration-200" 
                    style={{ opacity: isProcessing ? 0.7 : 1 }}
                    alt="Quality Preview" 
                   />
                 )}
               </div>

               <div className="mt-8 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex-grow flex items-center space-x-10">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Original Size</p>
                      <p className="text-lg font-bold text-gray-700">{formatBytes(originalFile.size)}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div className="text-center">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Optimized Size</p>
                      <p className="text-lg font-bold text-indigo-600">{processedResult ? formatBytes(processedResult.size) : '--'}</p>
                      {processedResult && (
                        <p className="text-[10px] text-green-500 font-bold">
                          {Math.round((1 - processedResult.size / originalFile.size) * 100)}% smaller
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto">
                    <button
                      disabled={!processedResult || isProcessing}
                      onClick={download}
                      className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                      Download
                    </button>
                    <button
                      onClick={reset}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                    >
                      Reset
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">Master Your Image Quality & Speed</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Page speed is a critical ranking factor for SEO. High-resolution images often contain more data than a standard screen can even display. 
          Use our <strong>Image Quality Controller</strong> to strip away unnecessary data. By selecting <strong>WebP</strong> as your output format and 
          setting a quality level between 60% and 80%, you can often reduce file sizes by up to 90% without any perceptible loss in visual quality 
          on standard mobile and desktop displays.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start p-4 bg-green-50 rounded-xl">
            <span className="text-green-500 text-lg mr-3">✓</span>
            <p className="text-xs text-green-800"><strong>Instant Preview:</strong> See exactly how the image looks before you download.</p>
          </div>
          <div className="flex items-start p-4 bg-blue-50 rounded-xl">
            <span className="text-blue-500 text-lg mr-3">✓</span>
            <p className="text-xs text-blue-800"><strong>Client-Side:</strong> No data is sent to a server. Processing happens entirely in your RAM.</p>
          </div>
        </div>
      </section>
      
      <AdPlaceholder slot="quality_bottom" />
    </div>
  );
};

export default QualityTool;
