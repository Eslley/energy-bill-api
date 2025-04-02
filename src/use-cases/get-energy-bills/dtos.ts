export type GetEnergyBillsInput = {
  clientNumber?: string;
  year?: number;
};

export type GetEnergyBillsOutput = {
  filteredEnergyBills: {
    clientNumber: string;
    clientName: string;
    monthlyBills: {
      [month: string]: { filePath: string };
    };
  }[];
};
