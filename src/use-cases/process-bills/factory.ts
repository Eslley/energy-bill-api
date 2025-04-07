import { EnergyBillParserService } from '@services/pdf-parser/energy-bill-parser-implementation';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import { DocumentService } from '@entities/document/document-service';
import { Prisma } from '@prisma/client';
import { ProcessBillsUseCase } from './use-case';
import { CloudinaryService } from '@services/storage/cloudinary-implementation';

export function buildUseCase(
  prisma: Prisma.TransactionClient
): ProcessBillsUseCase {
  const pdfParseService = new EnergyBillParserService();
  const storageService = new CloudinaryService();
  const energyBillService = new EnergyBillService(prisma);
  const documentService = new DocumentService(prisma);

  return new ProcessBillsUseCase(
    pdfParseService,
    storageService,
    energyBillService,
    documentService
  );
}
