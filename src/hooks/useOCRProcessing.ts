import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { OCRService } from '../services/ocrService';
import { validateImageFile } from '../utils/fileValidation';
import { useOCRStore } from '../stores/ocrStore';

export const useOCRProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const { setResult } = useOCRStore();

  const processImage = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult('');
    setStatus('Initializing OCR engine...');

    try {
      const text = await OCRService.processImage(file, {
        onProgress: setProgress,
        onStatus: setStatus
      });
      
      setResult(text);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('OCR Processing Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
      setResult('');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatus('');
    }
  }, [setResult]);

  return {
    isProcessing,
    progress,
    status,
    processImage
  };
}