import { Controller as OvernightController, Post } from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import { ApplicationError } from '@errors/application-error';
import type * as errors from './errors';
import { buildUseCase } from './factory';
import type { FailureOutput, SuccessOutput } from './use-case';
import { prisma } from '@modules/database';

type ErrorTypes =
  | keyof typeof errors
  | 'InputValidationError'
  | 'UnknownError'
  | string;

@OvernightController('process-bills')
export class ProcessBillsController extends Controller<
  FailureOutput,
  SuccessOutput
> {
  @Post()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const result = await prisma
      .$transaction(
        async (prismaTransaction) => {
          const useCase = buildUseCase(prismaTransaction);

          const result = await useCase.run();
          if (result.isWrong()) throw result;
          return result;
        },
        { timeout: 30000 }
      )
      .catch((error) => error);

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.mapError<ErrorTypes>({
        InputValidationError: this.badRequest,
        UnknownError: this.internalServerError,
        EnergyBillParserFieldError: this.badRequest,
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
