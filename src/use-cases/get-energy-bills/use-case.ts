import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { GetEnergyBillsInput, GetEnergyBillsOutput } from './dtos';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';

export type Input = GetEnergyBillsInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = GetEnergyBillsOutput;

export class GetEnergyBillsUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(private readonly energyBillService: EnergyBillService) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (!input) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    _input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const filteredBills = await this.energyBillService.getEnergyBills({});

    return right();
  }
}
