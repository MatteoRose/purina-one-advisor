import { DosageResult } from '@/types';

const DOSAGE_ANCHORS: Record<string, Record<number, number>> = {
  junior_chicken: { 1.0: 35, 5.0: 110, 10.0: 110 },
  weight_turkey:  { 1.0: 30, 5.0: 90,  10.0: 120 },
  senior_chicken: { 1.0: 20, 5.0: 65,  10.0: 90  },
  default:        { 1.0: 25, 5.0: 75,  10.0: 105 },
};

export function calculateDosage(productId: string, weightKg: number): DosageResult {
  const table = DOSAGE_ANCHORS[productId] ?? DOSAGE_ANCHORS.default;
  let base: number;

  if (weightKg <= 1.0) base = table[1.0];
  else if (weightKg >= 10.0) base = table[10.0];
  else if (weightKg <= 5.0) base = table[1.0] + (weightKg - 1.0) * ((table[5.0] - table[1.0]) / 4.0);
  else base = table[5.0] + (weightKg - 5.0) * ((table[10.0] - table[5.0]) / 5.0);

  const gLow = Math.round(base * 0.9);
  const gHigh = Math.round(base * 1.1);
  const pouches = weightKg <= 5 ? "1 pouch (85g)" : "2 pouches (85g)";

  return { dry: `${gLow}\u2013${gHigh}g`, wet: pouches };
}
