import type { Prisma } from '@prisma/client';

export interface ProcessPdfRepository {
  dummy(): Promise<void>;
}

export class PrismaProcessPdfRepository implements ProcessPdfRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async dummy(): Promise<void> {
    await this.prisma.$executeRaw`SELECT 1`;
  }
}
