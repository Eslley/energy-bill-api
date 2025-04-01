import type { File } from '@services/storage/service';

export function convertMulterFile(file: Express.Multer.File): File {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
}

export function convertMulterFileArray(files: Express.Multer.File[]): File[] {
  return files.map((file) => convertMulterFile(file));
}

export function convertMulterFileObject(files: {
  [fieldname: string]: Express.Multer.File[];
}): { [fieldname: string]: File[] } {
  const result: { [fieldname: string]: File[] } = {};

  Object.keys(files).forEach((key) => {
    result[key] = convertMulterFileArray(files[key]);
  });

  return result;
}
