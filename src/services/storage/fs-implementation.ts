import { promises as fs } from 'fs'; // Use fs.promises for async file operations
import path from 'path'; // For manipulating file paths
import logger from '@modules/logger';
import { v4 as uuid } from 'uuid';
import config from 'config';

import type { File, StorageService } from './service';

export class FileSystemStorageService implements StorageService {
  private readonly storageDir: string;

  constructor() {
    this.storageDir = config.get('storage.path');
  }

  async put(file: File): Promise<string> {
    const [, extension] = file.originalName.split('.');
    const key = `${this.storageDir}/${uuid()}.${extension}`;

    const filePath = path.join(this.storageDir, key);

    logger.info({ key, file }, 'Saving file to filesystem');

    try {
      await fs.writeFile(filePath, file.buffer);
    } catch (error) {
      logger.error({ error, key, file }, 'Error saving file to filesystem');
      throw new Error('Failed to save file');
    }

    return key;
  }

  async get(key: string): Promise<File> {
    const filePath = path.join(this.storageDir, key);

    logger.info({ key }, 'Fetching file from filesystem');

    try {
      const fileBuffer = await fs.readFile(filePath);

      return {
        originalName: path.basename(key),
        mimeType: 'application/octet-stream',
        size: fileBuffer.length,
        buffer: fileBuffer,
      };
    } catch (error) {
      logger.error({ error, key }, 'Error retrieving file from filesystem');
      throw new Error('File not found');
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.storageDir, key);

    logger.info({ key }, 'Deleting file from filesystem');

    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error({ error, key }, 'Error deleting file from filesystem');
      throw new Error('Failed to delete file');
    }
  }

  async url(key: string): Promise<string> {
    return `http://localhost:3000/${this.storageDir}/${key}`;
  }
}
