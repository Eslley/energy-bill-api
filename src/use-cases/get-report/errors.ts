import { BusinessError } from '@errors/business-error';

export class ReportGenerationError extends BusinessError {
  constructor() {
    super('Error generating report');
  }
}
