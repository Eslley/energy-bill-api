export type File = {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
};

export interface StorageService {
  put(file: File): Promise<string>;
  get(key: string): Promise<File>;
  delete(key: string): Promise<void>;
  url(key: string): Promise<string>;
}
