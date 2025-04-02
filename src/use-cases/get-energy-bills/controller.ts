import { Get, Controller as OvernightController } from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import { ApplicationError } from '@errors/application-error';
import type * as errors from './errors';
import { buildUseCase } from './factory';
import type { FailureOutput, Input, SuccessOutput } from './use-case';

type ErrorTypes = keyof typeof errors | 'InputValidationError' | 'UnknownError';

@OvernightController('get-energy-bills')
export class GetEnergyBillsController extends Controller<
  FailureOutput,
  SuccessOutput
> {
  @Get()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const useCase = buildUseCase();
    const result = await useCase.run({
      clientNumber: req.query?.clientNumber,
      year: req.query?.year,
    } as Input);

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.mapError<ErrorTypes>({
        InputValidationError: this.badRequest,
        UnknownError: this.internalServerError,
        DummyError: this.badRequest,
      });

      const treatment = errorMap[error.constructor.name as ErrorTypes];

      if (!treatment) {
        throw new ApplicationError('Unexpected error.');
      }

      return treatment.bind(this)(req, res, result);
    }

    return this.ok(req, res, result);
  }
}
