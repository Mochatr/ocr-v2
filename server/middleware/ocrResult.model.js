import mongoose from 'mongoose';

const ocrResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  processedAt: {
    type: Date,
    default: Date.now
  }
});

export const OCRResult = mongoose.model('OCRResult', ocrResultSchema);