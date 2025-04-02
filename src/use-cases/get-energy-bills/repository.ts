import type { Prisma } from '@prisma/client';

export interface GetEnergyBillsRepository {
  dummy(): Promise<void>;
}

export class PrismaGetEnergyBillsRepository
  implements GetEnergyBillsRepository
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async dummy(): Promise<void> {
    await this.prisma.$executeRaw`SELECT 1`;
  }
}
