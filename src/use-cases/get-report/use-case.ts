import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { GetReportInput, GetReportOutput } from './dtos';
import { EnergyBillReportService } from '@services/report/report-implementation';
import { ReportGenerationError } from './errors';

export type Input = GetReportInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = GetReportOutput;

export class GetReportUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(private readonly reportService: EnergyBillReportService) {
    super();
  }

  protected validate(_input: Input): Either<InputValidationError, void> {
    return right(undefined);
  }

  protected async execute(
    _input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const report = await this.reportService.generateReport();

    if (!report) return wrong(new ReportGenerationError());

    return right({ report });
  }
}
