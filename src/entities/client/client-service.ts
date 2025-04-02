import { Client, Prisma } from '@prisma/client';
import { ClientEntity, NewClientEntity } from './types';
import logger from '@modules/logger';
import { Either, right, wrong } from '@core/either';
import { ClientRepository } from './client-repository';
import {
  ClientCreationError,
  ClientExistanceConflictError,
  ClientNotFoundError,
} from './errors';

export class ClientService {
  private repository: ClientRepository;

  constructor(private readonly prisma: Prisma.TransactionClient) {
    this.repository = new ClientRepository(this.prisma);
  }

  async getClientById(
    clientId: string
  ): Promise<Either<ClientNotFoundError, ClientEntity>> {
    try {
      const client = await this.repository.getClientById(clientId);

      if (!client) {
        logger.error(`Client with id ${clientId} was not found`);
        return wrong(new ClientNotFoundError(clientId));
      }

      return right(this.mapToEntity(client));
    } catch (error) {
      logger.error(`Error getting client with id ${clientId}`, {
        error,
      });
      return wrong(new ClientNotFoundError(clientId));
    }
  }

  async getClients(where: Prisma.ClientWhereInput): Promise<ClientEntity[]> {
    try {
      const clients = await this.repository.getClients(where);

      return clients.map(this.mapToEntity);
    } catch (error) {
      logger.error('Error getting clients', {
        error,
      });
      return [];
    }
  }

  async saveClient(
    data: NewClientEntity
  ): Promise<
    Either<ClientCreationError | ClientExistanceConflictError, ClientEntity>
  > {
    try {
      const existentClient = await this.repository.getClientById(data.id);

      if (existentClient) {
        logger.error(`Client with the id ${data.id} already exists`, {
          data,
        });
        return wrong(new ClientExistanceConflictError(data.id));
      }

      const client = await this.repository.save(data);

      return right(this.mapToEntity(client));
    } catch (error) {
      logger.error('Error saving client with data', { data, error });
      return wrong(new ClientCreationError());
    }
  }

  public async countClients(where: Prisma.ClientWhereInput): Promise<number> {
    return await this.repository.countClients(where);
  }

  public mapToEntity(data: Client): ClientEntity {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
