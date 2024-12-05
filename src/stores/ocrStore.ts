import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OCRState {
  result: string;
  setResult: (text: string) => void;
  clearResult: () => void;
}

export const useOCRStore = create<OCRState>()(
  persist(
    (set) => ({
      result: '',
      setResult: (text: string) => set({ result: text }),
      clearResult: () => set({ result: '' }),
    }),
    {
      name: 'ocr-storage',
    }
  )
);