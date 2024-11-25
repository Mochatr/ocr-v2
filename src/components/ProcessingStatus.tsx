import React from 'react';
import { Loader } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  status: string;
}

export default function ProcessingStatus({ progress, status }: ProcessingStatusProps) {
  return (
    <div className="mt-6">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              {status || 'Processing'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-indigo-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div 
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300"
          />
        </div>
      </div>
      <div className="text-center">
        <Loader className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
}