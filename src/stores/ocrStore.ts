import { create } from 'zustand';

interface OCRState {
  result: string;
  setResult: (text: string) => void;
  clearResult: () => void;
}

export const useOCRStore = create<OCRState>((set) => ({
  result: '',
  setResult: (text: string) => set({ result: text }),
  clearResult: () => set({ result: '' })
}));