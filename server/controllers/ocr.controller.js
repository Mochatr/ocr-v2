import { createWorker } from 'tesseract.js';
import { logger } from '../utils/logger.js';
import { OCRResult } from '../models/ocrResult.model.js';
import { ApiError } from '../utils/apiError.js';

export const processImage = async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError('No image file provided', 400));
  }

  const worker = await createWorker();
  
  try {
    logger.info('Starting OCR processing');
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(req.file.buffer);
    
    if (!text.trim()) {
      throw new ApiError('No text detected in the image', 422);
    }

    // Save result to database
    const result = await OCRResult.create({
      userId: req.user.id,
      text,
      fileName: req.file.originalname,
      processedAt: new Date()
    });

    logger.info(`OCR processing completed for file: ${req.file.originalname}`);
    
    res.status(200).json({
      success: true,
      data: {
        text,
        resultId: result._id
      }
    });
  } catch (error) {
    logger.error('OCR processing error:', error);
    next(error);
  } finally {
    await worker.terminate();
  }
};

export const getProcessingHistory = async (req, res, next) => {
  try {
    const results = await OCRResult.find({ userId: req.user.id })
      .sort({ processedAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Error fetching OCR history:', error);
    next(error);
  }
};