import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import { Prisma } from '@prisma/client';
import { ClientService } from '@entities/client/client-service';
import { InstallationService } from '@entities/installation/installation-service';
import logger from '@modules/logger';
import {
  EnergyBillReport,
  MonthlyBillsAggregation,
  MonthlyBillsAggregationMap,
  MonthlyEletricalAndGDIConsumeAggregation,
  MonthlyEletricalAndGDIConsumeAggregationMap,
  TotalBillsAggregation,
} from './service';
import { EnergyBillEntity } from '@entities/energy-bill/types';
import { abbreviateReferenceDate } from './utils';

export class EnergyBillReportService {
  private energyBillService: EnergyBillService;
  private clientService: ClientService;
  private installationService: InstallationService;

  constructor(private readonly prisma: Prisma.TransactionClient) {
    this.energyBillService = new EnergyBillService(prisma);
    this.clientService = new ClientService(prisma);
    this.installationService = new InstallationService(prisma);
  }

  public async generateReport(): Promise<EnergyBillReport | void> {
    try {
      const numberOfClients = await this.clientService.countClients({});
      const numberOfInstallations =
        await this.installationService.countInstallations({});

      const allBills = await this.energyBillService.getEnergyBills({});

      const monthlyBillsEvolution =
        this.aggregateMonthlyBillsEvolution(allBills);

      const totalValues = this.aggregateTotalValues(allBills);

      const monthlyEletricalAndGDIConsume =
        this.aggregateMonthlyEletricalEnergyAndGDIEnergyConsume(allBills);

      return {
        numberOfClients,
        numberOfInstallations,
        monthlyBillsEvolution,
        monthlyEletricalAndGDIConsume,
        ...totalValues,
      };
    } catch (error) {
      logger.error({ error }, 'Error generating energy bills report');
    }
  }

  private aggregateTotalValues(
    bills: EnergyBillEntity[]
  ): TotalBillsAggregation {
    const aggregation: TotalBillsAggregation = {
      numberOfBills: 0,
      totalBillsPrice: 0,
      totalEletricalEnergyConsume: 0,
      totalEletricalEnergyPrice: 0,
      totalGDIEnergyConsume: 0,
      totalGDIEnergyPrice: 0,
      totalEletricalEnergyPriceWithoutGD: 0,
      totalPublicLightingContributionPrice: 0,
      totalDamageCompensationPrice: 0,
    };

    bills.forEach((bill) => {
      aggregation.numberOfBills += 1;
      aggregation.totalBillsPrice += bill.totalValue;
      aggregation.totalEletricalEnergyConsume +=
        bill.eletricalEnergyQuantity + bill.SCEEEnergyQuantity;
      aggregation.totalEletricalEnergyPrice +=
        bill.eletricalEnergyTotalValue + bill.SCEEEnergyTotalValue;
      aggregation.totalGDIEnergyConsume += bill.GDIEnergyQuantity;
      aggregation.totalGDIEnergyPrice += bill.GDIEnergyTotalValue;
      aggregation.totalEletricalEnergyPriceWithoutGD +=
        bill.eletricalEnergyTotalValue +
        bill.SCEEEnergyTotalValue +
        bill.publicLightingContribution;
      aggregation.totalPublicLightingContributionPrice +=
        bill.publicLightingContribution;

      if (bill.damageCompensation) {
        aggregation.totalDamageCompensationPrice += bill.damageCompensation;
      }
    });

    return aggregation;
  }

  private aggregateMonthlyBillsEvolution(
    bills: EnergyBillEntity[]
  ): MonthlyBillsAggregation[] {
    const monthlyAggregationMap: MonthlyBillsAggregationMap = new Map();

    bills.forEach((bill) => {
      const abbreviatedMonthYear = abbreviateReferenceDate(bill.referenceDate);

      if (!monthlyAggregationMap.has(abbreviatedMonthYear)) {
        monthlyAggregationMap.set(abbreviatedMonthYear, {
          numberOfBills: 0,
          totalBillsPrice: 0,
          totalEletricalEnergyConsume: 0,
          totalEletricalEnergyPrice: 0,
          totalGDIEnergyConsume: 0,
          totalGDIEnergyPrice: 0,
          totalEletricalEnergyPriceWithoutGD: 0,
          totalPublicLightingContributionPrice: 0,
          totalDamageCompensationPrice: 0,
        });
      }

      const aggreggation = monthlyAggregationMap.get(abbreviatedMonthYear)!;

      aggreggation.numberOfBills += 1;
      aggreggation.totalBillsPrice += bill.totalValue;
      aggreggation.totalEletricalEnergyConsume +=
        bill.eletricalEnergyQuantity + bill.SCEEEnergyQuantity;
      aggreggation.totalEletricalEnergyPrice +=
        bill.eletricalEnergyTotalValue + bill.SCEEEnergyTotalValue;
      aggreggation.totalGDIEnergyConsume += bill.GDIEnergyQuantity;
      aggreggation.totalGDIEnergyPrice += bill.GDIEnergyTotalValue;
      aggreggation.totalEletricalEnergyPriceWithoutGD +=
        bill.eletricalEnergyTotalValue +
        bill.SCEEEnergyTotalValue +
        bill.publicLightingContribution;
      aggreggation.totalPublicLightingContributionPrice +=
        bill.publicLightingContribution;
      aggreggation.totalDamageCompensationPrice +=
        bill?.damageCompensation || 0;
    });

    return Array.from(monthlyAggregationMap.entries()).map(
      ([monthYear, value]) => ({
        monthYear,
        ...value,
      })
    );
  }

  private aggregateMonthlyEletricalEnergyAndGDIEnergyConsume(
    bills: EnergyBillEntity[]
  ): MonthlyEletricalAndGDIConsumeAggregation[] {
    const monthlyAggregationMap: MonthlyEletricalAndGDIConsumeAggregationMap =
      new Map();

    bills.forEach((bill) => {
      const abbreviatedMonthYear = abbreviateReferenceDate(bill.referenceDate);

      if (!monthlyAggregationMap.has(abbreviatedMonthYear)) {
        monthlyAggregationMap.set(abbreviatedMonthYear, {
          totalEletricalEnergyConsume: 0,
          totalGDIEnergyConsume: 0,
        });
      }

      const aggregation = monthlyAggregationMap.get(abbreviatedMonthYear)!;

      aggregation.totalEletricalEnergyConsume +=
        bill.eletricalEnergyQuantity + bill.SCEEEnergyQuantity;
      aggregation.totalGDIEnergyConsume += bill.GDIEnergyQuantity;
    });

    return Array.from(monthlyAggregationMap.entries()).map(
      ([monthYear, value]) => ({
        monthYear,
        ...value,
      })
    );
  }
}
