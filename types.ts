
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  previewUrl: string;
}

export interface ProcessingResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: ImageFormat;
}

export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  COMPRESSOR = 'COMPRESSOR',
  CONVERTER = 'CONVERTER',
  RESIZER = 'RESIZER',
  QUALITY = 'QUALITY',
  CHECKER = 'CHECKER'
}
