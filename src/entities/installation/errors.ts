import { BusinessError } from '@errors/business-error';

export class InstallationCreationError extends BusinessError {
  constructor() {
    super('Error while saving installation on database');
  }
}

export class InstallationExistanceConflictError extends BusinessError {
  constructor(installationId: string) {
    super(`Installation with id ${installationId} already exists`);
  }
}

export class InstallationNotFoundError extends BusinessError {
  constructor(installationId: string) {
    super(`The installation with id ${installationId} was not found`);
  }
}
