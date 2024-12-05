import { OCRWorker } from './worker';
import type { OCRProgress, OCRResult } from './types';

export class OCRService {
  private static worker = OCRWorker.getInstance();

  static async processImage(
    file: File,
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    try {
      return await this.worker.processImage(file, onProgress);
    } catch (error) {
      console.error('OCR Service Error:', error);
      throw error;
    }
  }

  static async cleanup(): Promise<void> {
    await this.worker.terminate();
  }
}