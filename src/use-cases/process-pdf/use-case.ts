import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { ProcessPdfInput, ProcessPdfOutput } from './dtos';
import type { ProcessPdfRepository } from './repository';
import { PdfParserService } from '@services/pdf-parser/service';
import { StorageService } from '@services/storage/service';

export type Input = ProcessPdfInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ProcessPdfOutput;

export class ProcessPdfUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: ProcessPdfRepository,
    private readonly pdfParserService: PdfParserService,
    private readonly storageService: StorageService
  ) {
    super();
  }

  protected validate(_input: Input): Either<InputValidationError, void> {
    return right(undefined);
  }

  protected async execute(
    _input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const file = await this.storageService.get('3001422762-01-2024.pdf');
    //const file = await this.storageService.get('3001116735-01-2024.pdf');

    const parseResult = await this.pdfParserService.parse(file.buffer);
    if (parseResult.isWrong()) return wrong(parseResult.value);

    console.log(parseResult.value);

    return right(undefined);
  }
}
