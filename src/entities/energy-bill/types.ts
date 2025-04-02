import { DocumentEntity } from '@entities/document/types';

export interface EnergyBillEntity {
  id: string;
  clientId: string;
  installationId: string;
  documentId: string;

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

  document: DocumentEntity;

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
