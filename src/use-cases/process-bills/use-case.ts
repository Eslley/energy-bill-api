import { Either, right } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { ProcessBillsInput, ProcessBillsOutput } from './dtos';
import { PdfParserService } from '@services/pdf-parser/service';
import { StorageService } from '@services/storage/service';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import logger from '@modules/logger';
import { DocumentService } from '@entities/document/document-service';

export type Input = ProcessBillsInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ProcessBillsOutput;

export class ProcessBillsUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly pdfParserService: PdfParserService,
    private readonly storageService: StorageService,
    private readonly energyBillService: EnergyBillService,
    private readonly documentService: DocumentService
  ) {
    super();
  }

  protected validate(_input: Input): Either<InputValidationError, void> {
    return right(undefined);
  }

  protected async execute(
    _input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const files = [
      '3001116735-01-2024.pdf',
      '3001116735-02-2024.pdf',
      '3001116735-03-2024.pdf',
      '3001116735-04-2024.pdf',
      '3001116735-05-2024.pdf',
      '3001116735-06-2024.pdf',
      '3001116735-07-2024.pdf',
      '3001116735-08-2024.pdf',
      '3001116735-09-2024.pdf',
      '3001422762-01-2024.pdf',
      '3001422762-02-2024.pdf',
      '3001422762-03-2024.pdf',
      '3001422762-04-2024.pdf',
      '3001422762-05-2024.pdf',
      '3001422762-06-2024.pdf',
      '3001422762-07-2024.pdf',
      '3001422762-08-2024.pdf',
      '3001422762-09-2024.pdf',
    ];

    for (const filePath of files) {
      const file = await this.storageService.get(`faturas/${filePath}`);

      const parseResult = await this.pdfParserService.parse(file.buffer);
      if (parseResult.isWrong()) {
        logger.error('error parsing pdf', parseResult.value);
        continue;
      }

      const parsedBill = parseResult.value;
      const mappedBill =
        this.energyBillService.mapParsedToNewEntity(parsedBill);

      const billCreationResult = await this.energyBillService.saveEnergyBill(
        mappedBill
      );
      if (billCreationResult.isWrong()) {
        logger.error('error saving bill', parseResult.value);
        continue;
      }

      const fileKey = await this.storageService.put(file);
      await this.documentService.saveDocument({
        fileName: file.originalName,
        mimeType: file.mimeType,
        path: fileKey,
        size: file.size,
      });
    }

    return right(undefined);
  }
}
