import { Installation, Prisma } from '@prisma/client';
import logger from '@modules/logger';
import { Either, right, wrong } from '@core/either';
import { InstallationRepository } from './installation-repository';
import { InstallationEntity, NewInstallationEntity } from './types';
import {
  InstallationCreationError,
  InstallationExistanceConflictError,
  InstallationNotFoundError,
} from './errors';
import { ClientService } from '@entities/client/client-service';

export class InstallationService {
  private repository: InstallationRepository;
  private clientService: ClientService;

  constructor(private readonly prisma: Prisma.TransactionClient) {
    this.repository = new InstallationRepository(this.prisma);
    this.clientService = new ClientService(this.prisma);
  }

  async getInstallationById(
    installationId: string
  ): Promise<Either<InstallationNotFoundError, InstallationEntity>> {
    try {
      const installation = await this.repository.getInstallationById(
        installationId
      );

      if (!installation) {
        logger.error(`Installation with id ${installationId} was not found`);
        return wrong(new InstallationNotFoundError(installationId));
      }

      return right(this.mapToEntity(installation));
    } catch (error) {
      logger.error(`Error getting installation with id ${installationId}`, {
        error,
      });
      return wrong(new InstallationNotFoundError(installationId));
    }
  }

  async getInstallations(
    where: Prisma.InstallationWhereInput
  ): Promise<InstallationEntity[]> {
    try {
      const installations = await this.repository.getInstallations(where);

      return installations.map(this.mapToEntity);
    } catch (error) {
      logger.error('Error getting installations', {
        error,
      });
      return [];
    }
  }

  async saveInstallation(
    data: NewInstallationEntity
  ): Promise<
    Either<
      InstallationCreationError | InstallationExistanceConflictError,
      InstallationEntity
    >
  > {
    try {
      const existentInstallation = await this.repository.getInstallationById(
        data.id
      );

      if (existentInstallation) {
        logger.error(`Installation with the id ${data.id} already exists`, {
          data,
        });
        return wrong(new InstallationExistanceConflictError(data.id));
      }

      const clientResult = await this.clientService.getClientById(
        data.clientId
      );
      if (clientResult.isWrong()) return wrong(clientResult.value);

      const installation = await this.repository.save(data);

      return right(this.mapToEntity(installation));
    } catch (error) {
      logger.error('Error saving installation with data', { data, error });
      return wrong(new InstallationCreationError());
    }
  }

  public mapToEntity(data: Installation): InstallationEntity {
    return {
      id: data.id,
      clientId: data.clientId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
