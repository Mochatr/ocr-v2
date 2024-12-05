import { createWorker } from 'tesseract.js';
import type { OCRProgress, OCRResult } from './types';

export class OCRWorker {
  private static instance: OCRWorker;
  private worker: Awaited<ReturnType<typeof createWorker>> | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): OCRWorker {
    if (!OCRWorker.instance) {
      OCRWorker.instance = new OCRWorker();
    }
    return OCRWorker.instance;
  }

  private async initialize(): Promise<void> {
    if (!this.worker) {
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      this.isInitialized = true;
    }
  }

  async processImage(
    file: File,
    progressCallback?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.worker) {
        throw new Error('OCR worker not initialized');
      }

      const result = await this.worker.recognize(file);

      return {
        text: result.data.text,
        confidence: result.data.confidence || 0
      };
    } catch (error) {
      console.error('OCR Processing Error:', error);
      throw error;
    }
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}