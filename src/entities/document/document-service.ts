import { Document, Prisma } from '@prisma/client';
import logger from '@modules/logger';
import { Either, right, wrong } from '@core/either';
import { DocumentRepository } from './document-repository';
import { DocumentEntity, NewDocumentEntity } from './types';
import { DocumentCreationError, DocumentNotFoundError } from './errors';

export class DocumentService {
  private repository: DocumentRepository;

  constructor(private readonly prisma: Prisma.TransactionClient) {
    this.repository = new DocumentRepository(this.prisma);
  }

  async getdocumentById(
    documentId: string
  ): Promise<Either<DocumentNotFoundError, DocumentEntity>> {
    try {
      const document = await this.repository.getDocumentById(documentId);

      if (!document) {
        logger.error(`Document with id ${documentId} was not found`);
        return wrong(new DocumentNotFoundError(documentId));
      }

      return right(this.mapToEntity(document));
    } catch (error) {
      logger.error(`Error getting document with id ${documentId}`, {
        error,
      });
      return wrong(new DocumentNotFoundError(documentId));
    }
  }

  async getDocuments(
    where: Prisma.DocumentWhereInput
  ): Promise<DocumentEntity[]> {
    try {
      const documents = await this.repository.getDocuments(where);

      return documents.map(this.mapToEntity);
    } catch (error) {
      logger.error('Error getting documents', {
        error,
      });
      return [];
    }
  }

  async saveDocument(
    data: NewDocumentEntity
  ): Promise<Either<DocumentCreationError, DocumentEntity>> {
    try {
      const document = await this.repository.save(data);

      return right(this.mapToEntity(document));
    } catch (error) {
      logger.error('Error saving document with data', { data, error });
      return wrong(new DocumentCreationError());
    }
  }

  public mapToEntity(data: Document): DocumentEntity {
    return {
      id: data.id,
      fileName: data.fileName,
      mimeType: data.mimeType,
      path: data.path,
      size: data.size,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
