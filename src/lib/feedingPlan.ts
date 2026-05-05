/**
 * Feeding-plan calculator — single source of truth for daily grams.
 *
 * All three views (Daily Nutrition Table, Weekly Feeding Plan, and the
 * Print Plan on the confirmation page) read from the same FeedingPlan
 * object so the numbers can never disagree.
 *
 * Formulas
 * ────────
 *  RER (Resting Energy Requirement) = 70 × BW^0.75   kcal/day
 *      Source: NRC 2006 — Nutrient Requirements of Dogs and Cats;
 *              FEDIAF 2024 nutritional guidelines for pet food.
 *      The 0.75 exponent (Kleiber's law) reflects the sublinear
 *      scaling of metabolic rate with body mass.
 *
 *  MER (Maintenance Energy Requirement) = RER × activity factor
 *      Activity factors below are taken from NRC 2006 tables:
 *      kittens/puppies sit at 2.0–2.5×, sedentary neutered adults at
 *      1.0–1.4×, working dogs up to 2.5×.
 *
 *  Dry food grams = (MER − wet kcal) ÷ caloric density
 *      Caloric densities are estimated from Purina ONE published ME
 *      values per product line. We expose a ±10% range to account for
 *      individual metabolic variation, treats, and seasonal needs.
 */

import type { DogProfile, Product } from "@/types";

export interface FeedingPlan {
  /** Resting Energy Requirement (NRC 2006: 70 × BW^0.75) in kcal/day. */
  rerKcal: number;
  /** Activity multiplier applied to RER. */
  activityFactor: number;
  /** Maintenance Energy Requirement = RER × activityFactor (kcal/day). */
  merKcal: number;
  /** Caloric density of the recommended dry food (kcal/g). */
  dryKcalPerG: number;
  /** Caloric density of the recommended wet food (kcal/g, 0 if none). */
  wetKcalPerG: number;
  /** Number of 85 g wet pouches per day (0 if no wet food in plan). */
  wetPouches: number;
  /** Total wet food grams per day = wetPouches × 85. */
  wetGrams: number;
  /** Calories from wet food per day. */
  wetKcal: number;
  /** Calories the dry food must supply per day = MER − wetKcal. */
  dryKcal: number;
  /** Daily dry-food range, ±10% around the calorie target. */
  dryGramsLow: number;
  dryGramsHigh: number;
  /** Per-meal split assuming 2 meals/day. */
  dryGramsPerMealLow: number;
  dryGramsPerMealHigh: number;
  /** Human-readable formula breakdown for tooltips / print. */
  formula: string;
}

/**
 * Estimated metabolizable energy (kcal/g) per Purina ONE product ID.
 * Values are derived from published Purina ONE ME labels (kcal/kg ÷ 1000).
 * Snacks and oral-care products are intentionally excluded — they are
 * not part of the daily calorie budget.
 */
const KCAL_PER_G: Record<string, number> = {
  // ── DOG DRY ──
  junior_chicken: 3.85, // Mini Junior — higher fat for growth
  adult_beef: 3.75,
  active_chicken: 4.00, // Mini Active — energy-dense
  weight_turkey: 3.30, // Mini Weight Control — 40% less fat
  delicate_salmon: 3.80,
  monoprotein_turkey: 3.75,
  senior_chicken: 3.55,
  // ── DOG WET ──
  adult_wet: 0.90,
  active_wet: 0.95,
  senior_wet: 0.85,
  // ── CAT DRY ──
  cat_adult_chicken: 3.90,
  cat_junior_chicken: 4.10,
  cat_senior_chicken: 3.75,
  cat_sterilcat_turkey: 3.55,
  cat_indoor_turkey: 3.55,
  cat_delicate_turkey: 3.80,
  // ── CAT WET ──
  cat_adult_wet: 0.85,
  cat_senior_wet: 0.80,
};

function kcalPerG(p: Product | null): number {
  if (!p) return 0;
  if (KCAL_PER_G[p.id] !== undefined) return KCAL_PER_G[p.id];
  // Sensible defaults if a future product lands without an entry.
  return p.type === "wet" ? 0.85 : 3.75;
}

/**
 * Activity factor — multiplier applied to RER to produce MER.
 * NRC 2006 / FEDIAF derived. Sterilization and lifestage take precedence
 * over the activity slider, mirroring how vets prioritize them.
 */
function activityFactor(profile: DogProfile): number {
  const isCat = profile.petType === "cat";
  const ls = profile.lifestage;
  const act = profile.activity;
  const sterilized = profile.sterilized === true;

  // ────────── CATS ──────────
  if (isCat) {
    if (ls === "Junior") return 2.5; // kitten growth
    if (ls === "Senior") return 1.2;
    // Adult cats — sterilization and activity drive the factor
    if (sterilized) return 1.2;
    if (act === "Sedentario") return 1.0;
    if (act === "Attivo" || act === "Molto Attivo") return 1.6;
    return 1.4; // Normale / unsterilized average
  }

  // ────────── DOGS ──────────
  if (ls === "Junior") {
    return act === "Attivo" || act === "Molto Attivo" ? 2.5 : 2.0;
  }
  if (ls === "Senior") {
    if (act === "Sedentario") return 1.2;
    if (act === "Attivo" || act === "Molto Attivo") return 1.5;
    return 1.4;
  }
  // Adult
  if (act === "Sedentario") return 1.4;
  if (act === "Attivo") return 1.8;
  if (act === "Molto Attivo") return 2.5;
  return 1.6; // Normale
}

/** How many 85-g wet pouches/day. Small pets get 1; larger pets get 2. */
function pouchesPerDay(weightKg: number, hasWet: boolean): number {
  if (!hasWet) return 0;
  return weightKg <= 5 ? 1 : 2;
}

/**
 * Compute the daily feeding plan for this pet + product pair.
 * Pure function — same inputs always produce the same plan.
 */
export function computeFeedingPlan(
  profile: DogProfile,
  dryProduct: Product,
  wetProduct: Product | null
): FeedingPlan {
  const w = Math.max(0.5, profile.weight); // guard against 0kg edge case
  const rer = 70 * Math.pow(w, 0.75);
  const factor = activityFactor(profile);
  const mer = rer * factor;

  const dryKcalPerG = kcalPerG(dryProduct);
  const wetKcalPerG = kcalPerG(wetProduct);

  const wetPouches = pouchesPerDay(w, !!wetProduct);
  const wetGrams = wetPouches * 85;
  const wetKcal = wetGrams * wetKcalPerG;

  // Dry food fills the calorie gap; floor at 50 kcal so we never report 0g.
  const dryKcal = Math.max(50, mer - wetKcal);
  const dryGramsTarget = dryKcal / dryKcalPerG;

  // ±10% range for individual metabolic variation, then split per meal.
  const dryGramsLow = Math.round(dryGramsTarget * 0.9);
  const dryGramsHigh = Math.round(dryGramsTarget * 1.1);

  return {
    rerKcal: Math.round(rer),
    activityFactor: factor,
    merKcal: Math.round(mer),
    dryKcalPerG,
    wetKcalPerG,
    wetPouches,
    wetGrams,
    wetKcal: Math.round(wetKcal),
    dryKcal: Math.round(dryKcal),
    dryGramsLow,
    dryGramsHigh,
    dryGramsPerMealLow: Math.round(dryGramsLow / 2),
    dryGramsPerMealHigh: Math.round(dryGramsHigh / 2),
    formula:
      `RER = 70 × ${w.toFixed(1)}^0.75 = ${Math.round(rer)} kcal · ` +
      `MER = RER × ${factor.toFixed(2)} = ${Math.round(mer)} kcal/day`,
  };
}

/** Stringify a plan into the legacy DosageResult shape (used by some views). */
export function feedingPlanToDosage(plan: FeedingPlan): {
  dry: string;
  wet: string;
} {
  const dry =
    plan.dryGramsLow === plan.dryGramsHigh
      ? `${plan.dryGramsLow}g`
      : `${plan.dryGramsLow}–${plan.dryGramsHigh}g`;
  const wet =
    plan.wetPouches === 0
      ? "0g"
      : plan.wetPouches === 1
        ? "1 pouch (85g)"
        : `${plan.wetPouches} pouches (85g)`;
  return { dry, wet };
}
