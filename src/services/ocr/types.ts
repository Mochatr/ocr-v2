export interface OCRProgress {
  progress: number;
  status: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface OCRError extends Error {
  code?: string;
}