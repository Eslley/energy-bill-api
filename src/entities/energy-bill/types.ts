export interface EnergyBillEntity {
  id: string;
  clientId: string;
  installationId: string;

  referenceDate: Date;
  dueDate: Date;
  emissionDate: Date;

  receiptNumber: string;
  totalValue: number;

  eletricalEnergyQuantity: number;
  eletricalEnergyUnitValue: number;
  eletricalEnergyTotalValue: number;

  GDIEnergyQuantity: number;
  GDIEnergyUnitValue: number;
  GDIEnergyTotalValue: number;

  SCEEEnergyQuantity: number;
  SCEEEnergyUnitValue: number;
  SCEEEnergyTotalValue: number;

  publicLightingContribution: number;
  damageCompensation?: number;

  billBarCode: string;
  raw: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewEnergyBillEntity {
  client: {
    number: string;
    name: string;
  };
  installation: {
    number: string;
  };

  referenceDate: Date;
  dueDate: Date;
  emissionDate: Date;

  receiptNumber: string;
  totalValue: number;

  eletricalEnergyQuantity: number;
  eletricalEnergyUnitValue: number;
  eletricalEnergyTotalValue: number;

  GDIEnergyQuantity: number;
  GDIEnergyUnitValue: number;
  GDIEnergyTotalValue: number;

  SCEEEnergyQuantity: number;
  SCEEEnergyUnitValue: number;
  SCEEEnergyTotalValue: number;

  publicLightingContribution: number;
  damageCompensation?: number;

  billBarCode: string;
  raw: string;
}
