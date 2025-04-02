import { Client, Prisma } from '@prisma/client';
import { NewClientEntity } from './types';

export class ClientRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  public async getClientById(clientId: string): Promise<Client | null> {
    return await this.prisma.client.findFirst({
      where: {
        id: clientId,
      },
    });
  }

  public async getClients(where: Prisma.ClientWhereInput): Promise<Client[]> {
    return await this.prisma.client.findMany({
      where,
    });
  }

  public async save(data: NewClientEntity): Promise<Client> {
    return await this.prisma.client.create({
      data: {
        id: data.id,
        name: data.name,
      },
    });
  }

  public async countClients(where: Prisma.ClientWhereInput): Promise<number> {
    return await this.prisma.client.count({
      where,
    });
  }
}
