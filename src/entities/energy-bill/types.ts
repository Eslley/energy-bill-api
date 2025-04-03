import { ClientEntity } from '@entities/client/types';
import { DocumentEntity } from '@entities/document/types';
import { Client, Document, EnergyBill } from '@prisma/client';

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

  client: ClientEntity;
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

export type EnergyBillQueryResult = EnergyBill & {
  client: Client;
  document: Document;
};
