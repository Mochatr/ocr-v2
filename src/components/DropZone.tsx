import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  isProcessing: boolean;
}

export default function DropZone({ onDrop, isProcessing }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isProcessing 
          ? 'cursor-not-allowed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg-secondary' 
          : isDragActive 
            ? 'border-primary dark:border-primary-light bg-primary/5 dark:bg-primary-dark/10' 
            : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary-light cursor-pointer'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`mx-auto h-12 w-12 ${
        isProcessing 
          ? 'text-gray-300 dark:text-gray-600' 
          : 'text-gray-400 dark:text-gray-500'
      }`} />
      <p className={`mt-2 text-sm ${
        isProcessing 
          ? 'text-gray-400 dark:text-gray-500' 
          : 'text-gray-600 dark:text-gray-400'
      }`}>
        {isProcessing 
          ? 'Please wait while processing current image...' 
          : 'Drag and drop an image here, or click to select a file'}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Supports PNG, JPG, JPEG, GIF, BMP (max 10MB)
      </p>
    </div>
  );
}