import React from 'react';
import { FileText, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ResultDisplayProps {
  result: string;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const downloadText = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Extracted Text
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
              toast.success('Copied to clipboard!');
            }}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Copy to clipboard
          </button>
          <button
            onClick={downloadText}
            className="flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
      </div>
    </div>
  );
}