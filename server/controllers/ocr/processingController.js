import { ProcessingService } from '../../services/ocr/processingService.js';
import { logger } from '../../utils/logger.js';

export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No image file provided');
    }

    const result = await ProcessingService.processImage(req.file, req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        text: result.extractedText,
        confidence: result.confidence,
        resultId: result._id
      }
    });
  } catch (error) {
    logger.error('Image processing controller error:', {
      error: error.message,
      userId: req.user?.id,
      fileName: req.file?.originalname
    });
    next(error);
  }
};