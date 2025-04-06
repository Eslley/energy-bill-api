import { Prisma } from '@prisma/client';
import { EnergyBillQueryResult, NewEnergyBillEntity } from './types';

export class EnergyBillRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  public async getEnergyBillById(
    energyBillId: string
  ): Promise<EnergyBillQueryResult | null> {
    return await this.prisma.energyBill.findFirst({
      where: {
        id: energyBillId,
      },
      include: {
        document: true,
        client: true,
      },
    });
  }

  public async get(
    where: Prisma.EnergyBillWhereInput
  ): Promise<EnergyBillQueryResult[]> {
    return await this.prisma.energyBill.findMany({
      where,
      include: {
        document: true,
        client: true,
      },
      orderBy: {
        referenceDate: 'asc',
      },
    });
  }

  public async save(
    data: NewEnergyBillEntity,
    documentId: string
  ): Promise<EnergyBillQueryResult> {
    return await this.prisma.energyBill.create({
      data: {
        clientId: data.client.number,
        installationId: data.installation.number,
        documentId,
        referenceDate: data.referenceDate,
        dueDate: data.dueDate,
        emissionDate: data.emissionDate,
        receiptNumber: data.receiptNumber,
        totalValue: data.totalValue,
        eletricalEnergyQuantity: data.eletricalEnergyQuantity,
        eletricalEnergyUnitValue: data.eletricalEnergyUnitValue,
        eletricalEnergyTotalValue: data.eletricalEnergyTotalValue,
        GDIEnergyQuantity: data.GDIEnergyQuantity,
        GDIEnergyUnitValue: data.GDIEnergyUnitValue,
        GDIEnergyTotalValue: data.GDIEnergyTotalValue,
        SCEEEnergyQuantity: data.SCEEEnergyQuantity,
        SCEEEnergyUnitValue: data.SCEEEnergyUnitValue,
        SCEEEnergyTotalValue: data.SCEEEnergyTotalValue,
        publicLightingContribution: data.publicLightingContribution,
        damageCompensation: data.damageCompensation,
        billBarCode: data.billBarCode,
        raw: data.raw,
      },
      include: {
        document: true,
        client: true,
      },
    });
  }

  public async countEnergyBills(
    where: Prisma.EnergyBillWhereInput
  ): Promise<number> {
    return await this.prisma.energyBill.count({
      where,
    });
  }

  public async deleteEnergyBill(energyBillId: string): Promise<void> {
    await this.prisma.energyBill.delete({
      where: {
        id: energyBillId,
      },
    });
  }
}
