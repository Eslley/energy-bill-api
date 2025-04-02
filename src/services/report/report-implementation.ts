import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import { Prisma } from '@prisma/client';
import { ClientService } from '@entities/client/client-service';
import { InstallationService } from '@entities/installation/installation-service';
import logger from '@modules/logger';
import {
  EnergyBillReport,
  MonthlyBillsAggregation,
  MonthlyEletricalAndGDIConsumeAggregation,
  MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation,
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

      const monthlyEletricalConsumeWithoutGDAndGDIPrice =
        this.aggregateMonthlEletricalConsumeWithoutGDAndGDIPrice(allBills);

      return {
        numberOfClients,
        numberOfInstallations,
        monthlyBillsEvolution,
        monthlyEletricalAndGDIConsume,
        monthlyEletricalConsumeWithoutGDAndGDIPrice,
        ...totalValues,
      };
    } catch (error) {
      logger.error({ error }, 'Error generating energy bills report');
    }
  }

  private aggregateMonthlyBillsEvolution(bills: EnergyBillEntity[]): {
    [monthYear: string]: MonthlyBillsAggregation;
  } {
    const monthlyAggregation: { [key: string]: MonthlyBillsAggregation } = {};

    bills.forEach((bill) => {
      const abbreviatedMonthYear = abbreviateReferenceDate(bill.referenceDate);

      if (!monthlyAggregation[abbreviatedMonthYear]) {
        monthlyAggregation[abbreviatedMonthYear] = {
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
      }

      monthlyAggregation[abbreviatedMonthYear].numberOfBills += 1;
      monthlyAggregation[abbreviatedMonthYear].totalBillsPrice +=
        bill.totalValue;
      monthlyAggregation[abbreviatedMonthYear].totalEletricalEnergyConsume +=
        bill.eletricalEnergyQuantity + bill.SCEEEnergyQuantity;
      monthlyAggregation[abbreviatedMonthYear].totalEletricalEnergyPrice +=
        bill.eletricalEnergyTotalValue + bill.SCEEEnergyTotalValue;
      monthlyAggregation[abbreviatedMonthYear].totalGDIEnergyConsume +=
        bill.GDIEnergyQuantity;
      monthlyAggregation[abbreviatedMonthYear].totalGDIEnergyPrice +=
        bill.GDIEnergyTotalValue;
      monthlyAggregation[
        abbreviatedMonthYear
      ].totalEletricalEnergyPriceWithoutGD +=
        bill.eletricalEnergyTotalValue +
        bill.SCEEEnergyTotalValue +
        bill.publicLightingContribution;
      monthlyAggregation[
        abbreviatedMonthYear
      ].totalPublicLightingContributionPrice += bill.publicLightingContribution;
      monthlyAggregation[abbreviatedMonthYear].totalDamageCompensationPrice +=
        bill?.damageCompensation || 0;
    });

    return monthlyAggregation;
  }

  private aggregateTotalValues(
    bills: EnergyBillEntity[]
  ): TotalBillsAggregation {
    const aggregation: MonthlyBillsAggregation = {
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

  private aggregateMonthlyEletricalEnergyAndGDIEnergyConsume(
    bills: EnergyBillEntity[]
  ): {
    [monthYear: string]: MonthlyEletricalAndGDIConsumeAggregation;
  } {
    const monthlyAggregation: {
      [monthYear: string]: MonthlyEletricalAndGDIConsumeAggregation;
    } = {};

    bills.forEach((bill) => {
      const abbreviatedMonthYear = abbreviateReferenceDate(bill.referenceDate);

      if (!monthlyAggregation[abbreviatedMonthYear]) {
        monthlyAggregation[abbreviatedMonthYear] = {
          totalEletricalEnergyConsume: 0,
          totalGDIEnergyConsume: 0,
        };
      }

      monthlyAggregation[abbreviatedMonthYear].totalEletricalEnergyConsume +=
        bill.eletricalEnergyQuantity + bill.SCEEEnergyQuantity;
      monthlyAggregation[abbreviatedMonthYear].totalGDIEnergyConsume +=
        bill.GDIEnergyQuantity;
    });

    return monthlyAggregation;
  }

  public aggregateMonthlEletricalConsumeWithoutGDAndGDIPrice(
    bills: EnergyBillEntity[]
  ): {
    [monthYear: string]: MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation;
  } {
    const monthlyAggregation: {
      [
        monthYear: string
      ]: MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation;
    } = {};

    bills.forEach((bill) => {
      const abbreviatedMonthYear = abbreviateReferenceDate(bill.referenceDate);

      if (!monthlyAggregation[abbreviatedMonthYear]) {
        monthlyAggregation[abbreviatedMonthYear] = {
          totalEletricalEnergyPriceWithoutGD: 0,
          totalGDIEnergyPrice: 0,
        };
      }

      monthlyAggregation[
        abbreviatedMonthYear
      ].totalEletricalEnergyPriceWithoutGD +=
        bill.eletricalEnergyQuantity +
        bill.SCEEEnergyQuantity +
        bill.publicLightingContribution;
      monthlyAggregation[abbreviatedMonthYear].totalGDIEnergyPrice +=
        bill.GDIEnergyTotalValue;
    });

    return monthlyAggregation;
  }
}
