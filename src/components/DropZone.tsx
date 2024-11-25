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
          ? 'cursor-not-allowed border-gray-200 bg-gray-50' 
          : isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-500 cursor-pointer'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`mx-auto h-12 w-12 ${isProcessing ? 'text-gray-300' : 'text-gray-400'}`} />
      <p className={`mt-2 text-sm ${isProcessing ? 'text-gray-400' : 'text-gray-600'}`}>
        {isProcessing 
          ? 'Please wait while processing current image...' 
          : 'Drag and drop an image here, or click to select a file'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports PNG, JPG, JPEG, GIF, BMP (max 10MB)
      </p>
    </div>
  );
}