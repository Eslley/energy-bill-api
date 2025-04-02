import { Installation, Prisma } from '@prisma/client';
import { NewInstallationEntity } from './types';

export class InstallationRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  public async getInstallationById(
    installationId: string
  ): Promise<Installation | null> {
    return await this.prisma.installation.findFirst({
      where: {
        id: installationId,
      },
    });
  }

  public async getInstallations(
    where: Prisma.InstallationWhereInput
  ): Promise<Installation[]> {
    return await this.prisma.installation.findMany({
      where,
    });
  }

  public async save(data: NewInstallationEntity): Promise<Installation> {
    return await this.prisma.installation.create({
      data: {
        id: data.id,
        clientId: data.clientId,
      },
    });
  }

  public async countInstallations(
    where: Prisma.InstallationWhereInput
  ): Promise<number> {
    return await this.prisma.installation.count({
      where,
    });
  }
}
