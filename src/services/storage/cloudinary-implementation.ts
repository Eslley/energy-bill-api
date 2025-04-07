import { v2 as cloudinary } from 'cloudinary';
import config from 'config';
import { File, StorageService } from './service';
import path from 'path';
import logger from '@modules/logger';
import { promises as fs } from 'fs';

export class CloudinaryService implements StorageService {
  private readonly storageDir: string;

  constructor() {
    cloudinary.config({
      cloud_name: config.get('storage.cloudinary.cloudName'),
      api_key: config.get('storage.cloudinary.apiKey'),
      api_secret: config.get('storage.cloudinary.apiSecret'),
    });
    this.storageDir = config.get('storage.path');
  }

  async get(key: string): Promise<File> {
    const filePath = path.join(this.storageDir, key);

    logger.info({ key }, 'Fetching file from filesystem');

    try {
      const fileBuffer = await fs.readFile(filePath);

      return {
        originalName: path.basename(key),
        mimeType: 'application/pdf',
        size: fileBuffer.length,
        buffer: fileBuffer,
      };
    } catch (error) {
      logger.error({ error, key }, 'Error retrieving file from filesystem');
      throw new Error('File not found');
    }
  }

  delete(_key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  url(_key: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async put(file: File): Promise<string> {
    const uploadResult = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            access_mode: 'public',
            folder: 'pdfs',
            public_id: file.originalName.replace('.pdf', ''),
          },
          (error, result) => {
            if (error || !result) return reject(error);
            return resolve(result.secure_url);
          }
        )
        .end(file.buffer);
    });

    return uploadResult;
  }
}
