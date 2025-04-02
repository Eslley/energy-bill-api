import { EnergyBill, Prisma } from '@prisma/client';
import { EnergyBillRepository } from './energy-bill-repository';
import { EnergyBillEntity, NewEnergyBillEntity } from './types';
import logger from '@modules/logger';
import { Either, right, wrong } from '@core/either';
import { EnergyBillCreationError, EnergyBillNotFoundError } from './errors';
import { ClientService } from '@entities/client/client-service';
import { ParsedEnergyBill } from '@services/pdf-parser/service';
import { InstallationService } from '@entities/installation/installation-service';
import { InstallationNotFoundError } from '@entities/installation/errors';
import { ClientNotFoundError } from '@entities/client/errors';

export class EnergyBillService {
  private repository: EnergyBillRepository;
  private clientService: ClientService;
  private installationService: InstallationService;

  constructor(private readonly prisma: Prisma.TransactionClient) {
    this.repository = new EnergyBillRepository(this.prisma);
    this.clientService = new ClientService(this.prisma);
    this.installationService = new InstallationService(this.prisma);
  }

  async getEnergyBillById(
    energyBillId: string
  ): Promise<Either<EnergyBillNotFoundError, EnergyBillEntity>> {
    try {
      const energyBill = await this.repository.getEnergyBillById(energyBillId);

      if (!energyBill) {
        logger.error(`Energy bill with id ${energyBillId} was not found`);
        return wrong(new EnergyBillNotFoundError(energyBillId));
      }

      return right(this.mapToEntity(energyBill));
    } catch (error) {
      logger.error(
        {
          error,
        },
        `Error getting energy bill with id ${energyBillId}`
      );
      return wrong(new EnergyBillNotFoundError(energyBillId));
    }
  }

  async getEnergyBills(
    where: Prisma.EnergyBillWhereInput
  ): Promise<EnergyBillEntity[]> {
    try {
      const energyBills = await this.repository.get(where);

      return energyBills.map(this.mapToEntity);
    } catch (error) {
      logger.error(
        {
          error,
        },
        `Error getting energy bills`
      );
      return [];
    }
  }

  async saveEnergyBill(
    data: NewEnergyBillEntity
  ): Promise<
    Either<
      EnergyBillCreationError | ClientNotFoundError | InstallationNotFoundError,
      EnergyBillEntity
    >
  > {
    try {
      const clientResult = await this.clientService.getClientById(
        data.client.number
      );
      if (clientResult.isWrong()) {
        await this.clientService.saveClient({
          id: data.client.number,
          name: data.client.name,
        });
      }

      const installationResult =
        await this.installationService.getInstallationById(
          data.installation.number
        );
      if (installationResult.isWrong()) {
        await this.installationService.saveInstallation({
          id: data.installation.number,
          clientId: data.client.number,
        });
      }

      const energyBill = await this.repository.save(data);

      return right(this.mapToEntity(energyBill));
    } catch (error) {
      logger.error({ data, error }, 'Error saving energy bill with data');
      return wrong(new EnergyBillCreationError());
    }
  }

  public async countEnergyBills(
    where: Prisma.EnergyBillWhereInput
  ): Promise<number> {
    return await this.repository.countEnergyBills(where);
  }

  public mapToEntity(data: EnergyBill): EnergyBillEntity {
    return {
      id: data.id,
      clientId: data.clientId,
      installationId: data.installationId,
      referenceDate: data.referenceDate,
      dueDate: data.dueDate,
      emissionDate: data.emissionDate,
      receiptNumber: data.receiptNumber,
      totalValue: data.totalValue.toNumber(),
      eletricalEnergyQuantity: data.eletricalEnergyQuantity,
      eletricalEnergyUnitValue: data.eletricalEnergyUnitValue.toNumber(),
      eletricalEnergyTotalValue: data.eletricalEnergyTotalValue.toNumber(),
      GDIEnergyQuantity: data.GDIEnergyQuantity,
      GDIEnergyUnitValue: data.GDIEnergyUnitValue.toNumber(),
      GDIEnergyTotalValue: data.GDIEnergyTotalValue.toNumber(),
      SCEEEnergyQuantity: data.SCEEEnergyQuantity,
      SCEEEnergyUnitValue: data.SCEEEnergyUnitValue.toNumber(),
      SCEEEnergyTotalValue: data.SCEEEnergyTotalValue.toNumber(),
      publicLightingContribution: data.publicLightingContribution.toNumber(),
      damageCompensation: data?.damageCompensation?.toNumber(),
      billBarCode: data.billBarCode,
      raw: data.raw,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public mapParsedToNewEntity(data: ParsedEnergyBill): NewEnergyBillEntity {
    return {
      client: {
        number: data.clientNumber,
        name: data.clientName,
      },
      installation: {
        number: data.installationNumber,
      },
      referenceDate: data.referenceDate,
      dueDate: data.dueDate,
      emissionDate: data.emissionDate,
      receiptNumber: data.receiptNumber,
      totalValue: data.totalValue,
      eletricalEnergyQuantity: data.eletricalEnergy.quantity,
      eletricalEnergyUnitValue: data.eletricalEnergy.unitValue,
      eletricalEnergyTotalValue: data.eletricalEnergy.totalValue,
      GDIEnergyQuantity: data.GDIEnergy.quantity,
      GDIEnergyUnitValue: data.GDIEnergy.unitValue,
      GDIEnergyTotalValue: data.GDIEnergy.totalValue,
      SCEEEnergyQuantity: data.SCEEEnergy.quantity,
      SCEEEnergyUnitValue: data.SCEEEnergy.unitValue,
      SCEEEnergyTotalValue: data.SCEEEnergy.totalValue,
      publicLightingContribution: data.publicLightingContribution,
      damageCompensation: data.damageCompensation,
      billBarCode: data.billBarCode,
      raw: data.rawText,
    };
  }
}
