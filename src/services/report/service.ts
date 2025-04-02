export interface EnergyBillReport {
  numberOfClients: number;
  numberOfInstallations: number;
  numberOfBills: number;
  totalBillsPrice: number;
  monthlyBillsEvolution: {
    [monthYear: string]: MonthlyBillsAggregation;
  };
  totalEletricalEnergyConsume: number;
  totalEletricalEnergyPrice: number;
  totalGDIEnergyConsume: number;
  totalGDIEnergyPrice: number;
  totalEletricalEnergyPriceWithoutGD: number;
  totalPublicLightingContributionPrice: number;
  totalDamageCompensationPrice: number;
  monthlyEletricalAndGDIConsume: {
    [monthYear: string]: MonthlyEletricalAndGDIConsumeAggregation;
  };
  monthlyEletricalConsumeWithoutGDAndGDIPrice: {
    [monthYear: string]: MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation;
  };
}

export interface MonthlyBillsAggregation {
  numberOfBills: number;
  totalBillsPrice: number;
  totalEletricalEnergyConsume: number;
  totalEletricalEnergyPrice: number;
  totalGDIEnergyConsume: number;
  totalGDIEnergyPrice: number;
  totalEletricalEnergyPriceWithoutGD: number;
  totalPublicLightingContributionPrice: number;
  totalDamageCompensationPrice: number;
}

export type TotalBillsAggregation = MonthlyBillsAggregation;

export interface MonthlyEletricalAndGDIConsumeAggregation {
  totalEletricalEnergyConsume: number;
  totalGDIEnergyConsume: number;
}

export interface MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation {
  totalEletricalEnergyPriceWithoutGD: number;
  totalGDIEnergyPrice: number;
}
