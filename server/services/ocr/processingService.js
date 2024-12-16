import { createWorker } from 'tesseract.js';
import { OCRResult } from '../../models/ocrResult.model.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../utils/logger.js';
import { validateImageFile } from './validators.js';
import { AuditService } from '../audit.service.js';

export class ProcessingService {
  static async processImage(file, userId) {
    const startTime = Date.now();
    let worker = null;

    try {
      const validationError = validateImageFile(file);
      if (validationError) {
        throw new ApiError(validationError, 400);
      }

      worker = await this.initializeWorker();
      const result = await this.performOCR(worker, file);
      const savedResult = await this.saveResult(result, file, userId, startTime);

      return savedResult;
    } catch (error) {
      await this.handleProcessingError(error, file, userId);
      throw error;
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  static async initializeWorker() {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    return worker;
  }

  static async performOCR(worker, file) {
    const { data } = await worker.recognize(file.buffer);
    
    if (!data.text.trim()) {
      throw new ApiError('No text detected in the image', 422);
    }

    return data;
  }

  static async saveResult(ocrData, file, userId, startTime) {
    const processingTime = Date.now() - startTime;

    const result = await OCRResult.create({
      userId,
      originalFileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedText: ocrData.text,
      confidence: ocrData.confidence || 0,
      processingTime,
      status: 'completed',
      metadata: {
        imageWidth: ocrData.width,
        imageHeight: ocrData.height
      }
    });

    await AuditService.logActivity({
      userId,
      action: 'ocr_completion',
      status: 'success',
      details: {
        resultId: result._id,
        fileName: file.originalname,
        processingTime
      }
    });

    return result;
  }

  static async handleProcessingError(error, file, userId) {
    logger.error('OCR Processing error:', {
      error: error.message,
      stack: error.stack,
      fileName: file?.originalname,
      userId
    });

    await AuditService.logActivity({
      userId,
      action: 'ocr_error',
      status: 'failure',
      details: {
        fileName: file?.originalname,
        error: error.message
      }
    });
  }
}