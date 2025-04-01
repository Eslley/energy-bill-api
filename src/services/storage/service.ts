export enum Bucket {
  Public = 'base-public',
  Private = 'base-private',
}

export type PutOptions = {
  key: string;
};

export type File = {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
};

export interface StorageService {
  put(
    bucket: Bucket,
    path: string,
    file: File,
    options?: PutOptions
  ): Promise<string>;
  get(bucket: Bucket, key: string): Promise<File>;
  delete(bucket: Bucket, key: string): Promise<void>;
  url(bucket: Bucket, key: string): Promise<string>;
}
