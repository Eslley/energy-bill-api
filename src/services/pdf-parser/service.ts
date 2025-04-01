import { Either } from '@core/either';
import { EnergyBillParserError } from './errors';

export interface PdfParserService {
  parse(
    buffer: Buffer
  ): Promise<Either<EnergyBillParserError, ParsedEnergyBill>>;
}

export interface ParsedEnergyValue {
  unitValue: number;
  quantity: number;
  totalValue: number;
}

export interface ParsedEnergyBill {
  clientName: string;
  clientNumber: string;
  installationNumber: string;
  referenceDate: Date;
  emissionDate: Date;
  dueDate: Date;
  totalValue: number;
  receiptNumber: string;
  eletricalEnergy: ParsedEnergyValue;
  SCEEEnergy: ParsedEnergyValue;
  GDIEnergy: ParsedEnergyValue;
  publicLightingContribution: number;
  damageCompensation?: number;
  billBarCode: string;
  rawText: string;
}
