/**
 * Challenge persistence layer — localStorage based, independent of Zustand.
 * Stores challenge progress + the profile/product snapshot so returning
 * visitors can skip the quiz and jump straight to their results.
 */
import { DogProfile, Product } from "@/types";

export interface ChallengeChecks {
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
}

export interface ChallengeData {
  started: boolean;
  startedAt: string; // ISO date
  checks: ChallengeChecks;
  profile: DogProfile;
  productId: string;
  productName: string;
  productNameEn: string;
  productImg: string;
  matchScore: number;
  notificationsEnabled: boolean;
}

const STORAGE_KEY = "purina-3week-challenge";

const defaultChecks: ChallengeChecks = {
  week1: [false, false, false],
  week2: [false, false, false],
  week3: [false, false, false],
};

export function loadChallenge(): ChallengeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate it has the new format (profile field exists)
    if (!parsed.profile || !parsed.productId) {
      // Old format — clear it and return null
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed as ChallengeData;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveChallenge(data: ChallengeData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function startChallenge(
  profile: DogProfile,
  product: Product,
  matchScore: number
): ChallengeData {
  const data: ChallengeData = {
    started: true,
    startedAt: new Date().toISOString(),
    checks: { ...defaultChecks },
    profile,
    productId: product.id,
    productName: product.name,
    productNameEn: product.nameEn,
    productImg: product.img,
    matchScore,
    notificationsEnabled: false,
  };
  saveChallenge(data);
  return data;
}

export function clearChallenge(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getDaysSinceStart(data: ChallengeData): number {
  const start = new Date(data.startedAt);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getCurrentWeek(data: ChallengeData): number {
  const days = getDaysSinceStart(data);
  if (days < 7) return 1;
  if (days < 14) return 2;
  return 3;
}

export function getTotalChecked(checks: ChallengeChecks): number {
  return [...checks.week1, ...checks.week2, ...checks.week3].filter(Boolean).length;
}
