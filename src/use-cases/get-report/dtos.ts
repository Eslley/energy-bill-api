import { EnergyBillReport } from '@services/report/service';

export type GetReportInput = boolean;

export type GetReportOutput = {
  report: EnergyBillReport;
};
