import { BusinessError } from '@errors/business-error';

export class ClientCreationError extends BusinessError {
  constructor() {
    super('Error while saving client on database');
  }
}

export class ClientNotFoundError extends BusinessError {
  constructor(clientId: string) {
    super(`Client with id ${clientId} was not found`);
  }
}

export class ClientExistanceConflictError extends BusinessError {
  constructor(clientId: string) {
    super(`Client with id ${clientId} already exists`);
  }
}
