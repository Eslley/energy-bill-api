import { prisma } from '@modules/database';
import { GetEnergyBillsUseCase } from './use-case';
import { EnergyBillService } from '@entities/energy-bill/energy-bill-service';

export function buildUseCase(): GetEnergyBillsUseCase {
  const energyBillService = new EnergyBillService(prisma);

  return new GetEnergyBillsUseCase(energyBillService);
}
