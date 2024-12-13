import { OCRService } from '../services/ocr.service.js';
import { logger } from '../utils/logger.js';

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No image file provided');
    }

    const result = await OCRService.processAndStore(req.file, req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        text: result.extractedText,
        confidence: result.confidence,
        resultId: result._id
      }
    });
  } catch (error) {
    logger.error('OCR processing error:', error);
    next(error);
  }
};

export const getProcessingHistory = async (req, res, next) => {
  try {
    const results = await OCRService.getUserHistory(req.user.id);
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Error fetching OCR history:', error);
    next(error);
  }
};