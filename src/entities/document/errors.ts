import { BusinessError } from '@errors/business-error';

export class DocumentCreationError extends BusinessError {
  constructor() {
    super('Error while saving document on database');
  }
}

export class DocumentNotFoundError extends BusinessError {
  constructor(documentId: string) {
    super(`Document with id ${documentId} was not found`);
  }
}
