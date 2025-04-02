import { EnergyBill, Prisma } from '@prisma/client';
import { NewEnergyBillEntity } from './types';

export class EnergyBillRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  public async getById(energyBillId: string): Promise<EnergyBill | null> {
    return await this.prisma.energyBill.findFirst({
      where: {
        id: energyBillId,
      },
    });
  }

  public async get(where: Prisma.EnergyBillWhereInput): Promise<EnergyBill[]> {
    return await this.prisma.energyBill.findMany({
      where,
    });
  }

  public async save(data: NewEnergyBillEntity): Promise<EnergyBill> {
    return await this.prisma.energyBill.create({
      data: {
        clientId: data.client.number,
        installationId: data.installation.number,
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
    });
  }

  public async deleteMedia(energyBillId: string): Promise<void> {
    await this.prisma.energyBill.delete({
      where: {
        id: energyBillId,
      },
    });
  }
}
