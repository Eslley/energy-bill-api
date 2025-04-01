import { prisma } from '@modules/database';
import { PrismaProcessPdfRepository } from './repository';
import { ProcessPdfUseCase } from './use-case';
import { FileSystemStorageService } from '@services/storage/fs-implementation';
import { EnergyBillParserService } from '@services/pdf-parser/energy-bill-parser-implementation';

export function buildUseCase(): ProcessPdfUseCase {
  const repository = new PrismaProcessPdfRepository(prisma);
  const pdfParseService = new EnergyBillParserService();
  const storageService = new FileSystemStorageService();

  return new ProcessPdfUseCase(repository, pdfParseService, storageService);
}
