import { FileSystemStorageService } from '@services/storage/fs-implementation';
import { EnergyBillParserService } from '@services/pdf-parser/energy-bill-parser-implementation';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import { DocumentService } from '@entities/document/document-service';
import { Prisma } from '@prisma/client';
import { ProcessBillsUseCase } from './use-case';

export function buildUseCase(
  prisma: Prisma.TransactionClient
): ProcessBillsUseCase {
  const pdfParseService = new EnergyBillParserService();
  const storageService = new FileSystemStorageService();
  const energyBillService = new EnergyBillService(prisma);
  const documentService = new DocumentService(prisma);

  return new ProcessBillsUseCase(
    pdfParseService,
    storageService,
    energyBillService,
    documentService
  );
}
