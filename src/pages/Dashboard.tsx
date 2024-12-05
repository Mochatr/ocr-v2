import React, { useCallback } from 'react';
import { useOCR } from '../hooks/useOCR';
import DropZone from '../components/DropZone';
import ProcessingStatus from '../components/ProcessingStatus';
import ResultDisplay from '../components/ResultDisplay';

export default function Dashboard() {
  const { isProcessing, progress, status, result, processImage } = useOCR();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-background-main rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Document Processing</h1>
        
        <DropZone onDrop={handleDrop} isProcessing={isProcessing} />
        
        {isProcessing && (
          <ProcessingStatus 
            progress={progress} 
            status={status} 
          />
        )}
        
        {result && !isProcessing && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}