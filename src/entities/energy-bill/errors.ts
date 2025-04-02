import { BusinessError } from '@errors/business-error';

export class EnergyBillCreationError extends BusinessError {
  constructor() {
    super(`Error while saving the energy bill on database`);
  }
}

export class EnergyBillNotFoundError extends BusinessError {
  constructor(energyBillId: string) {
    super(`The energy bill with id ${energyBillId} was not found`);
  }
}
