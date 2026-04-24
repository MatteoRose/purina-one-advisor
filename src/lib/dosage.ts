import { DosageResult } from '@/types';

// Dog dosage anchors (weight in kg -> grams of dry food)
const DOG_DOSAGE_ANCHORS: Record<string, Record<number, number>> = {
  junior_chicken: { 1.0: 35, 5.0: 110, 10.0: 110 },
  weight_turkey:  { 1.0: 30, 5.0: 90,  10.0: 120 },
  senior_chicken: { 1.0: 20, 5.0: 65,  10.0: 90  },
  default:        { 1.0: 25, 5.0: 75,  10.0: 105 },
};

// Cat dosage anchors — cats eat less than dogs
// Typical cat: 2-6kg, eating 30-70g dry food per day
const CAT_DOSAGE_ANCHORS: Record<string, Record<number, number>> = {
  cat_junior_chicken:    { 2.0: 30, 4.0: 50, 6.0: 65, 10.0: 80 },
  cat_senior_chicken:    { 2.0: 20, 4.0: 35, 6.0: 50, 10.0: 60 },
  cat_sterilcat_turkey:  { 2.0: 20, 4.0: 35, 6.0: 50, 10.0: 60 },
  cat_indoor_turkey:     { 2.0: 20, 4.0: 35, 6.0: 50, 10.0: 60 },
  cat_default:           { 2.0: 25, 4.0: 40, 6.0: 55, 10.0: 70 },
};

function interpolateDosage(table: Record<number, number>, weightKg: number): number {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (weightKg <= keys[0]) return table[keys[0]];
  if (weightKg >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

  // Find the two surrounding anchors
  for (let i = 0; i < keys.length - 1; i++) {
    if (weightKg >= keys[i] && weightKg <= keys[i + 1]) {
      const low = keys[i];
      const high = keys[i + 1];
      const ratio = (weightKg - low) / (high - low);
      return table[low] + ratio * (table[high] - table[low]);
    }
  }
  return table[keys[0]];
}

export function calculateDosage(productId: string, weightKg: number): DosageResult {
  const isCat = productId.startsWith('cat_');

  if (isCat) {
    const table = CAT_DOSAGE_ANCHORS[productId] ?? CAT_DOSAGE_ANCHORS.cat_default;
    const base = interpolateDosage(table, weightKg);
    const gLow = Math.round(base * 0.9);
    const gHigh = Math.round(base * 1.1);
    const pouches = "1 pouch (85g)";
    return { dry: `${gLow}\u2013${gHigh}g`, wet: pouches };
  }

  // Dog dosage (original logic)
  const table = DOG_DOSAGE_ANCHORS[productId] ?? DOG_DOSAGE_ANCHORS.default;
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
