import pdfParse from 'pdf-parse';
import logger from '@modules/logger';
import {
  ParsedEnergyBill,
  ParsedEnergyValue,
  PdfParserService,
} from './service';
import { regexPatterns } from './regex';
import {
  convertMonthYearToDate,
  convertToCurrency,
  convertToDate,
} from './utils';
import { Either, right, wrong } from '@core/either';
import { EnergyBillParserError, EnergyBillParserFieldError } from './errors';

export class EnergyBillParserService implements PdfParserService {
  public async parse(
    buffer: Buffer
  ): Promise<Either<EnergyBillParserError, ParsedEnergyBill>> {
    try {
      const result = await pdfParse(buffer);

      const parsedBill = this.mountParsedObject(result.text);

      return right(parsedBill);
    } catch (error) {
      logger.error('Error parsing pdf', error);
      return wrong(error);
    }
  }

  public mountParsedObject(pdfText: string): ParsedEnergyBill {
    const extractField = <T = string>(
      fieldName: keyof typeof regexPatterns,
      convertFn?: (value: RegExpMatchArray) => any
    ): T => {
      const regex = regexPatterns[fieldName];
      const match = pdfText.match(regex);

      if (!match) throw new EnergyBillParserFieldError(fieldName);

      return convertFn ? convertFn(match) : (match[1].trim() as T);
    };

    const extractClientName = (): string => {
      const clientNameMatch =
        pdfText.match(regexPatterns.clientNameVariation1) ||
        pdfText.match(regexPatterns.clientNameVariation2);

      if (!clientNameMatch) throw new EnergyBillParserFieldError('clientName');

      return clientNameMatch[1].trim();
    };

    const referenceMonth = extractField('referencedDate', (match) => match[1]);
    const referencedYear = Number(
      extractField('referencedDate', (match) => match[2])
    );
    const referenceDate = convertMonthYearToDate(
      referenceMonth,
      referencedYear
    );

    const damageCompensationMatch = pdfText.match(
      regexPatterns.damageCompensation
    );
    const damageCompensation = damageCompensationMatch?.[1]
      ? convertToCurrency(damageCompensationMatch[1]) * -1
      : undefined;

    return {
      clientName: extractClientName(),
      clientNumber: extractField('clientNumber'),
      installationNumber: extractField('installationNumber'),
      referenceDate,
      dueDate: convertToDate(extractField('dueDate')),
      emissionDate: convertToDate(extractField('emissionDate')),
      receiptNumber: extractField('receiptNumber'),
      totalValue: convertToCurrency(extractField('totalValue')),
      eletricalEnergy: this.mapToParsedEnergyValue(
        extractField('eletricalEnergy', (match) => match)
      ),
      SCEEEnergy: this.mapToParsedEnergyValue(
        extractField('SCEEEnergy', (match) => match)
      ),
      GDIEnergy: this.mapToParsedEnergyValue(
        extractField('GDIEnergy', (match) => match)
      ),
      publicLightingContribution: convertToCurrency(
        extractField('publicLightingContribution')
      ),
      damageCompensation,
      billBarCode: extractField('billBarCode'),
      rawText: pdfText,
    };
  }

  private mapToParsedEnergyValue(
    regexArray: RegExpMatchArray
  ): ParsedEnergyValue {
    const totalValue = regexArray.at(3)
      ? convertToCurrency(regexArray.at(3))
      : 0;

    return {
      quantity: regexArray.at(1)
        ? Number(regexArray.at(1)?.replace('.', ''))
        : 0,
      unitValue: regexArray.at(2) ? convertToCurrency(regexArray.at(2)) : 0,
      totalValue: totalValue < 0 ? totalValue * -1 : totalValue,
    };
  }
}
