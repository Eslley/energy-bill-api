export interface EnergyBillReport {
  numberOfClients: number;
  numberOfInstallations: number;
  numberOfBills: number;
  totalBillsPrice: number;
  totalEletricalEnergyConsume: number;
  totalEletricalEnergyPrice: number;
  totalGDIEnergyConsume: number;
  totalGDIEnergyPrice: number;
  totalEletricalEnergyPriceWithoutGD: number;
  totalPublicLightingContributionPrice: number;
  totalDamageCompensationPrice: number;
  monthlyBillsEvolution: MonthlyBillsAggregation[];
  monthlyEletricalAndGDIConsume: MonthlyEletricalAndGDIConsumeAggregation[];
  monthlyEletricalConsumeWithoutGDAndGDIPrice: MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation[];
}

export interface MonthlyBillsAggregation {
  monthYear: string;
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

export interface MonthlyEletricalAndGDIConsumeAggregation {
  monthYear: string;
  totalEletricalEnergyConsume: number;
  totalGDIEnergyConsume: number;
}

export interface MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation {
  monthYear: string;
  totalEletricalEnergyPriceWithoutGD: number;
  totalGDIEnergyPrice: number;
}

export type OmittedMonthYear<T> = Omit<T, 'monthYear'>;
export type TotalBillsAggregation = OmittedMonthYear<MonthlyBillsAggregation>;

export type MonthlyBillsAggregationMap = Map<
  string,
  OmittedMonthYear<MonthlyBillsAggregation>
>;
export type MonthlyEletricalAndGDIConsumeAggregationMap = Map<
  string,
  OmittedMonthYear<MonthlyEletricalAndGDIConsumeAggregation>
>;
export type MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregationMap = Map<
  string,
  OmittedMonthYear<MonthlyEletricalConsumeWithoutGDAndGDIPriceAggregation>
>;
