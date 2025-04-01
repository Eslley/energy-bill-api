import { BusinessError } from '@errors/business-error';

export class EnergyBillParserError extends BusinessError {
  constructor() {
    super('Error while parsing energy bill');
  }
}

export class EnergyBillParserFieldError extends BusinessError {
  constructor(field: string) {
    super(`Error while parsing the field: ${field}`);
  }
}
