
import { ImageFormat, ProcessingResult } from '../types';

/**
 * Formats bytes into human readable format (KB, MB)
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Loads a file and returns an Image object
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
};

/**
 * Processes image with specified params
 * Fixes transparency for JPEG conversion by filling white background.
 */
export const processImage = async (
  img: HTMLImageElement,
  options: {
    format?: ImageFormat;
    quality?: number; // 0 to 100
    width?: number;
    height?: number;
    targetSizeKB?: number;
  }
): Promise<ProcessingResult> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas context not available');

  const width = options.width || img.width;
  const height = options.height || img.height;
  canvas.width = width;
  canvas.height = height;

  // Handle transparency for JPEGs
  const format = options.format || 'image/jpeg' as ImageFormat;
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
  
  ctx.drawImage(img, 0, 0, width, height);
  
  // 1. Target KB Logic (Binary Search for quality)
  // Forced to WebP if target is set but PNG is selected (since PNG toBlob has no quality parameter)
  const actualFormat = (options.targetSizeKB && format === 'image/png') ? 'image/webp' : format;

  if (options.targetSizeKB && (actualFormat === 'image/jpeg' || actualFormat === 'image/webp')) {
    let low = 0.01;
    let high = 0.95;
    let bestBlob: Blob | null = null;

    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), actualFormat, mid));
      
      if (blob.size / 1024 <= options.targetSizeKB) {
        bestBlob = blob;
        low = mid; 
      } else {
        high = mid; 
      }
    }
    
    const finalBlob = bestBlob || (await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), actualFormat, 0.01)));
    return {
      blob: finalBlob,
      url: URL.createObjectURL(finalBlob),
      size: finalBlob.size,
      width,
      height,
      format: actualFormat as ImageFormat
    };
  }

  // 2. Standard Quality Logic
  const quality = options.quality !== undefined ? options.quality / 100 : 0.85;
  const blob: Blob = await new Promise((res) => {
    if (format === 'image/png') {
      canvas.toBlob((b) => res(b!), format);
    } else {
      canvas.toBlob((b) => res(b!), format, quality);
    }
  });

  return {
    blob,
    url: URL.createObjectURL(blob),
    size: blob.size,
    width,
    height,
    format
  };
};
