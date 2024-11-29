import { createWorker } from 'tesseract.js';
import type { LoggerMessage } from '../types/tesseract';

export interface OCRProgressCallback {
  onProgress: (progress: number) => void;
  onStatus: (status: string) => void;
}

export class OCRService {
  private static createProgressHandler(callbacks: OCRProgressCallback) {
    return {
      progress: (p: number) => callbacks.onProgress(Math.round(p * 100)),
      status: (s: string) => callbacks.onStatus(s)
    };
  }

  static async processImage(
    file: File,
    callbacks: OCRProgressCallback
  ): Promise<string> {
    const worker = await createWorker();
    const progressHandler = this.createProgressHandler(callbacks);

    try {
      worker.logger = (m: LoggerMessage) => {
        if ('progress' in m) {
          progressHandler.progress(m.progress);
        }
        if ('status' in m) {
          progressHandler.status(m.status);
        }
      };

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      
      if (!text.trim()) {
        throw new Error('No text was detected in the image');
      }
      
      return text;
    } finally {
      await worker.terminate();
    }
  }
}