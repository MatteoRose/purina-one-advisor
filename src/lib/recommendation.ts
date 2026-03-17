import { DogProfile, Product, RecommendationResult, ScoredRecommendation, MatchExplanation } from '@/types';
import { PRODUCTS, PRODUCTS_MAP } from './products';
import { calculateDosage } from './dosage';

/** Critical health-to-product mappings that get a priority boost */
const PRIORITY_HEALTH_MAP: Record<string, string> = {
  'Intolleranze': 'monoprotein_turkey',
  'Controllo del peso': 'weight_turkey',
  'Pelle & Pelo': 'delicate_salmon',
};

/** Reason templates keyed by match type */
const REASON_TEMPLATES: Record<string, { en: string; it: string }> = {
  lifestage_junior: {
    en: 'Supports healthy growth in puppies',
    it: 'Supporta una crescita sana nei cuccioli',
  },
  lifestage_adult: {
    en: 'Balanced nutrition for adult dogs',
    it: 'Nutrizione bilanciata per cani adulti',
  },
  lifestage_senior: {
    en: 'Supports cardiac function and joints',
    it: 'Supporta la funzione cardiaca e le articolazioni',
  },
  activity_high: {
    en: 'High energy for active dogs',
    it: 'Energia elevata per cani attivi',
  },
  activity_low: {
    en: 'Moderate calories for less active dogs',
    it: 'Calorie moderate per cani meno attivi',
  },
  health_digestione: {
    en: 'Highly digestible formula',
    it: 'Formula altamente digeribile',
  },
  health_pelle: {
    en: 'Omega 3 for healthy skin & coat',
    it: 'Omega 3 per pelle e pelo sani',
  },
  health_peso: {
    en: '40% less fat for weight control',
    it: '40% di grassi in meno per il peso forma',
  },
  health_appetito: {
    en: 'Tasty formula for picky eaters',
    it: 'Formula gustosa per appetiti difficili',
  },
  health_intolleranze: {
    en: 'Single protein, grain-free',
    it: 'Monoproteico, senza cereali',
  },
  health_nessuno: {
    en: 'Complete everyday nutrition',
    it: 'Nutrizione completa quotidiana',
  },
};

/** Match explanation labels (concise) */
const EXPLANATION_LABELS = {
  lifestage: { en: 'Life stage', it: 'Fase di vita' },
  activity: { en: 'Activity level', it: 'Livello attività' },
  health: { en: 'Health needs', it: 'Esigenze salute' },
  weight: { en: 'Weight-optimized', it: 'Ottimizzato peso' },
};

interface ScoredProduct {
  product: Product;
  score: number;
  maxScore: number;
  reasons: string[];
  reasonsIt: string[];
  explanations: MatchExplanation[];
}

function scoreProduct(product: Product, profile: DogProfile): ScoredProduct {
  const criteria = product.criteria;
  if (!criteria) return { product, score: 0, maxScore: 0, reasons: [], reasonsIt: [], explanations: [] };

  let score = 0;
  let maxScore = 0;
  const reasons: string[] = [];
  const reasonsIt: string[] = [];
  const explanations: MatchExplanation[] = [];

  // --- Lifestage match: +10 ---
  maxScore += 10;
  const lifestageMatched = !!(profile.lifestage && criteria.lifestage === profile.lifestage);
  if (lifestageMatched) {
    score += 10;
    const key = `lifestage_${profile.lifestage!.toLowerCase()}`;
    const tmpl = REASON_TEMPLATES[key];
    if (tmpl) {
      reasons.push(tmpl.en);
      reasonsIt.push(tmpl.it);
    }
  }
  explanations.push({
    label: EXPLANATION_LABELS.lifestage.en,
    labelIt: EXPLANATION_LABELS.lifestage.it,
    matched: lifestageMatched,
  });

  // --- Activity match: +5 ---
  let activityMatched = false;
  if (criteria.activity && criteria.activity.length > 0) {
    maxScore += 5;
    activityMatched = !!(profile.activity && criteria.activity.includes(profile.activity));
    if (activityMatched) {
      score += 5;
      const isHigh = profile.activity === 'Attivo' || profile.activity === 'Molto Attivo';
      const key = isHigh ? 'activity_high' : 'activity_low';
      const tmpl = REASON_TEMPLATES[key];
      if (tmpl) {
        reasons.push(tmpl.en);
        reasonsIt.push(tmpl.it);
      }
    }
    explanations.push({
      label: EXPLANATION_LABELS.activity.en,
      labelIt: EXPLANATION_LABELS.activity.it,
      matched: activityMatched,
    });
  }

  // --- Health match: +15 per match + priority boost ---
  const profileHealth = profile.health.length > 0 ? profile.health : ['Nessuno'];
  const criteriaHealth = criteria.health ?? [];

  let healthMatched = false;
  if (criteriaHealth.length > 0) {
    maxScore += 15;
    const matchedHealth = profileHealth.filter(h => criteriaHealth.includes(h));

    if (matchedHealth.length > 0) {
      healthMatched = true;
      score += 15;

      for (const h of matchedHealth) {
        const reasonKey = getHealthReasonKey(h);
        const tmpl = REASON_TEMPLATES[reasonKey];
        if (tmpl) {
          reasons.push(tmpl.en);
          reasonsIt.push(tmpl.it);
        }
      }

      // Priority boost for critical health matches
      for (const h of matchedHealth) {
        const priorityProductId = PRIORITY_HEALTH_MAP[h];
        if (priorityProductId && product.id === priorityProductId) {
          score += 20;
          maxScore += 20;
        }
      }
    }
    explanations.push({
      label: EXPLANATION_LABELS.health.en,
      labelIt: EXPLANATION_LABELS.health.it,
      matched: healthMatched,
    });
  }

  return { product, score, maxScore, reasons, reasonsIt, explanations };
}

function getHealthReasonKey(health: string): string {
  const map: Record<string, string> = {
    'Digestione sensibile': 'health_digestione',
    'Pelle & Pelo': 'health_pelle',
    'Controllo del peso': 'health_peso',
    'Appetito difficile': 'health_appetito',
    'Intolleranze': 'health_intolleranze',
    'Nessuno': 'health_nessuno',
  };
  return map[health] ?? 'health_nessuno';
}

/**
 * Map raw scoring ratio to a display range, differentiated by rank.
 * Rank 0 (best):   88–98%
 * Rank 1 (second):  75–90%
 * Rank 2 (third):   65–82%
 */
function toDisplayScore(rawRatio: number, rank: number): number {
  if (rank === 0) {
    return Math.min(98, Math.max(88, 88 + Math.round(rawRatio * 10)));
  }
  if (rank === 1) {
    return Math.min(90, Math.max(75, 75 + Math.round(rawRatio * 15)));
  }
  return Math.min(82, Math.max(65, 65 + Math.round(rawRatio * 17)));
}

export function getRecommendation(profile: DogProfile): RecommendationResult {
  const dryProducts = PRODUCTS.filter(p => p.type === 'dry');
  const scored = dryProducts.map(product => scoreProduct(product, profile));
  scored.sort((a, b) => b.score - a.score);

  // Take top 3
  const top3 = scored.slice(0, 3);

  const recommendations: ScoredRecommendation[] = top3.map((entry, rank) => {
    const rawRatio = entry.maxScore > 0 ? entry.score / entry.maxScore : 0;
    const matchScore = toDisplayScore(rawRatio, rank);

    const matchExplanations: MatchExplanation[] = [
      ...entry.explanations,
      {
        label: EXPLANATION_LABELS.weight.en,
        labelIt: EXPLANATION_LABELS.weight.it,
        matched: true,
      },
    ];

    let wetProduct: Product | null = null;
    if (entry.product.pairing) {
      wetProduct = PRODUCTS_MAP[entry.product.pairing] ?? null;
    }

    const dosage = calculateDosage(entry.product.id, profile.weight);

    return {
      product: entry.product,
      matchScore,
      reasons: entry.reasons,
      reasonsIt: entry.reasonsIt,
      matchExplanations,
      wet: wetProduct,
      dosage,
    };
  });

  // Cross-sell products
  const crossSell: Product[] = [];
  if (profile.weight >= 7) {
    const dentalife = PRODUCTS_MAP['dentalife_small'];
    if (dentalife) crossSell.push(dentalife);
  }
  const adventuros = PRODUCTS_MAP['adventuros_nuggets'];
  if (adventuros) crossSell.push(adventuros);

  return { recommendations, crossSell };
}
