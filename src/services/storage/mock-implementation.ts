import logger from '@modules/logger';
import { v4 as uuid } from 'uuid';

import type { Bucket, File, PutOptions, StorageService } from './service';

export class MockStorageService implements StorageService {
  private readonly file: File = {
    originalName: 'mocked_file',
    mimeType: 'image/jpeg',
    size: 0,
    buffer: Buffer.from(''),
  };

  async put(
    bucket: Bucket,
    path: string,
    file: File,
    options?: PutOptions
  ): Promise<string> {
    let key: string;

    if (!options || (options && !options.key)) {
      const [, extension] = file.originalName.split('.');
      key = `${path}/${uuid()}.${extension}`;
    } else {
      key = options.key;
    }

    logger.info({ bucket, key, file }, 'Adding file');

    return key;
  }

  async get(_bucket: Bucket, _key: string): Promise<File> {
    return this.file;
  }

  async delete(bucket: Bucket, key: string): Promise<void> {
    logger.info({ bucket, key }, 'Deleting file');
  }

  async url(bucket: Bucket, key: string): Promise<string> {
    return `http://localhost:3000/${bucket}/${key}`;
  }
}
