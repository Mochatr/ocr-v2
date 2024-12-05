import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Lock, History } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Advanced OCR',
    description: 'Extract text from images and documents with high accuracy'
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Get results in seconds with our optimized processing engine'
  },
  {
    icon: Lock,
    title: 'Secure Storage',
    description: 'Your documents are encrypted and safely stored'
  },
  {
    icon: History,
    title: 'Processing History',
    description: 'Access and manage your previous OCR results'
  }
];

export default function Landing() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Transform your</span>
                  <span className="block text-primary dark:text-primary-light">documents instantly</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Extract text from images and documents with our powerful OCR technology. Fast, accurate, and secure.
                </p>
                <div className="mt-5 sm:mt-8 flex justify-center">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary transition-colors md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="py-12 bg-background-secondary dark:bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary dark:text-primary-light font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need for document processing
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary dark:bg-primary-dark text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}