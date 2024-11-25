import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { createWorker } from 'tesseract.js';
import { useOCRStore } from '../stores/ocrStore';
import { processImage as processImageAPI } from '../services/api';
import DropZone from '../components/DropZone';
import ProcessingStatus from '../components/ProcessingStatus';
import ResultDisplay from '../components/ResultDisplay';

export default function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const { result, setResult } = useOCRStore();

  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, BMP)');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const processImage = async (file: File) => {
    if (!validateImage(file)) return;

    setIsProcessing(true);
    setProgress(0);
    setResult('');
    setCurrentStatus('Processing image...');

    try {
      // First try to process via backend API
      try {
        const { data } = await processImageAPI(file);
        setResult(data.text);
        toast.success('Text extracted successfully!');
        return;
      } catch (error) {
        console.warn('Backend processing failed, falling back to client-side OCR');
      }

      // Fallback to client-side processing
      const worker = await createWorker();

      worker.logger = (m) => {
        if (m.progress) {
          setProgress(Math.round(m.progress * 100));
        }
        if (m.status) {
          setCurrentStatus(m.status);
        }
      };

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      
      if (!text.trim()) {
        throw new Error('No text was detected in the image. Please try a different image.');
      }
      
      setResult(text);
      toast.success('Text extracted successfully!');

      await worker.terminate();
    } catch (error) {
      console.error('OCR Processing Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
      setResult('');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStatus('');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processImage(file);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Processing</h1>
        
        <DropZone onDrop={onDrop} isProcessing={isProcessing} />
        
        {isProcessing && (
          <ProcessingStatus 
            progress={progress} 
            status={currentStatus} 
          />
        )}
        
        {result && !isProcessing && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}