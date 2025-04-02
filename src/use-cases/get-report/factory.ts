import { prisma } from '@modules/database';
import { GetReportUseCase } from './use-case';
import { EnergyBillReportService } from '@services/report/report-implementation';

export function buildUseCase(): GetReportUseCase {
  const reportService = new EnergyBillReportService(prisma);

  return new GetReportUseCase(reportService);
}
