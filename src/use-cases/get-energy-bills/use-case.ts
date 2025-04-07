import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type {
  ClientEnergyBillMap,
  GetEnergyBillsInput,
  GetEnergyBillsOutput,
} from './dtos';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';
import { EnergyBillEntity } from '@entities/energy-bill/types';
import { monthNumberMap } from '@services/pdf-parser/utils';
import { DocumentEntity } from '@entities/document/types';

export type Input = GetEnergyBillsInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = GetEnergyBillsOutput;

export class GetEnergyBillsUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(private readonly energyBillService: EnergyBillService) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (!input) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const { clientNumber, year } = input;

    const yearQuery = this.buildYearQuery(year);

    const filteredBills = await this.energyBillService.getEnergyBills({
      clientId: clientNumber ?? undefined,
      ...yearQuery,
    });

    return right(this.mapFilteredBillsToOutput(filteredBills));
  }

  private mapFilteredBillsToOutput(
    energyBills: EnergyBillEntity[]
  ): GetEnergyBillsOutput {
    const clientEnergyBillMap: ClientEnergyBillMap = energyBills.reduce(
      (map, bill) => {
        const clientNumber = bill.clientId;
        const month = monthNumberMap[bill.referenceDate.getMonth()];

        if (!map.has(clientNumber)) {
          map.set(clientNumber, {
            clientName: bill.client.name,
            billDocuments: [],
          });
        }

        map.get(clientNumber)?.billDocuments.push({
          document: bill.document,
          month,
        });

        return map;
      },
      new Map<
        string,
        {
          clientName: string;
          billDocuments: { document: DocumentEntity; month: string }[];
        }
      >()
    );

    return {
      filteredEnergyBills: Array.from(clientEnergyBillMap.entries()).map(
        ([clientNumber, value]) => ({
          clientNumber,
          clientName: value.clientName,
          monthlyBills: this.buildMonthlyBills(value.billDocuments),
        })
      ),
    };
  }

  private buildMonthlyBills(
    billDocuments: { document: DocumentEntity; month: string }[]
  ): { [month: string]: { filePath: string; fileName: string } } {
    return billDocuments.reduce((monthMap, { document, month }) => {
      monthMap[month] = {
        filePath: document.path,
        fileName: document.fileName,
      };
      return monthMap;
    }, {} as { [month: string]: { filePath: string; fileName: string } });
  }

  private buildYearQuery(year?: string): {
    referenceDate: {
      gte: Date;
      lt: Date;
    };
  } | void {
    if (!year) return undefined;

    const parsedYear = Number(year);

    return {
      referenceDate: {
        gte: new Date(parsedYear, 0, 1),
        lt: new Date(parsedYear + 1, 0, 1),
      },
    };
  }
}
