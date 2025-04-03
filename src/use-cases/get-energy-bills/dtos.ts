import { DocumentEntity } from '@entities/document/types';

export type GetEnergyBillsInput = {
  clientNumber?: string;
  year?: string;
};

export interface EnergyBillWithMonthlyDocument {
  clientNumber: string;
  clientName: string;
  monthlyBills: {
    [month: string]: { filePath: string };
  };
}

export type GetEnergyBillsOutput = {
  filteredEnergyBills: EnergyBillWithMonthlyDocument[];
};

export type ClientEnergyBillMap = Map<
  string,
  {
    clientName: string;
    billDocuments: { document: DocumentEntity; month: string }[];
  }
>;
