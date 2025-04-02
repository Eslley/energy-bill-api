import { Document, Prisma } from '@prisma/client';
import { NewDocumentEntity } from './types';

export class DocumentRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  public async getDocumentById(documentId: string): Promise<Document | null> {
    return await this.prisma.document.findFirst({
      where: {
        id: documentId,
      },
    });
  }

  public async getDocuments(
    where: Prisma.DocumentWhereInput
  ): Promise<Document[]> {
    return await this.prisma.document.findMany({
      where,
    });
  }

  public async save(data: NewDocumentEntity): Promise<Document> {
    return await this.prisma.document.create({
      data: {
        fileName: data.fileName,
        mimeType: data.mimeType,
        path: data.path,
        size: data.size,
      },
    });
  }
}
