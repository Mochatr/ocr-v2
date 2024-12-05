import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { OCRService } from '../services/ocr/service';
import { validateImageFile } from '../utils/file';

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    return () => {
      OCRService.cleanup();
    };
  }, []);

  const processImage = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setStatus('Initializing OCR...');
    setResult('');

    try {
      const { text } = await OCRService.processImage(file);

      if (!text.trim()) {
        throw new Error('No text detected in the image');
      }

      setResult(text);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
      setResult('');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatus('');
    }
  }, []);

  return {
    isProcessing,
    progress,
    status,
    result,
    processImage,
  };
}