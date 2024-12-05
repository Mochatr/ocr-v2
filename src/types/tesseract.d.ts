declare module 'tesseract.js' {
  export interface LoggerMessage {
    workerId?: string;
    status?: string;
    progress?: number;
    userJobId?: string;
  }

  export interface RecognizeResult {
    data: {
      text: string;
      hocr?: string;
      tsv?: string;
    };
  }

  export interface Worker {
    load(): Promise<void>;
    loadLanguage(lang: string): Promise<void>;
    initialize(lang: string): Promise<void>;
    recognize(image: File | Blob | string): Promise<RecognizeResult>;
    terminate(): Promise<void>;
  }

  export interface WorkerOptions {
    logger?: (m: LoggerMessage) => void;
    errorHandler?: (err: Error) => void;
    langPath?: string;
  }

  export function createWorker(options?: WorkerOptions): Promise<Worker>;
}