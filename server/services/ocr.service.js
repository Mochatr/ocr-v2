import { OCRResult } from '../models/ocrResult.model.js';
import { createWorker } from 'tesseract.js';
import { logger } from '../utils/logger.js';
import { AuditService } from './audit.service.js';
import { ApiError } from '../utils/apiError.js';

export class OCRService {
  static async processAndStore(file, userId) {
    const startTime = Date.now();
    let worker = null;

    try {
      // Initialize OCR worker
      worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Process image
      const { data } = await worker.recognize(file.buffer);
      const processingTime = Date.now() - startTime;

      // Validate OCR result
      if (!data.text.trim()) {
        throw new ApiError('No text detected in the image', 422);
      }

      // Store OCR result
      const result = await OCRResult.create({
        userId,
        originalFileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        extractedText: data.text,
        confidence: data.confidence || 0,
        processingTime,
        status: 'completed',
        metadata: {
          imageWidth: data.width,
          imageHeight: data.height
        }
      });

      // Log successful processing
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

      logger.info(`OCR processing completed for file: ${file.originalname}`);

      return result;
    } catch (error) {
      // Log processing error
      await AuditService.logActivity({
        userId,
        action: 'ocr_completion',
        status: 'failure',
        details: {
          fileName: file.originalname,
          error: error.message
        }
      });

      logger.error('OCR processing error:', error);
      throw error;
    } finally {
      // Cleanup
      if (worker) {
        await worker.terminate();
      }
    }
  }

  static async getUserHistory(userId, options = {}) {
    try {
      const query = { userId };
      const limit = options.limit || 10;
      const skip = options.skip || 0;

      const results = await OCRResult.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('-extractedText');

      return results;
    } catch (error) {
      logger.error('Error fetching OCR history:', error);
      throw error;
    }
  }

  static async getResultById(resultId, userId) {
    try {
      const result = await OCRResult.findOne({
        _id: resultId,
        userId
      });

      if (!result) {
        throw new ApiError('OCR result not found', 404);
      }

      return result;
    } catch (error) {
      logger.error('Error fetching OCR result:', error);
      throw error;
    }
  }
}