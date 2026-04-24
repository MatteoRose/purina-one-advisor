export type Lifestage = 'Junior' | 'Adult' | 'Senior';
export type Activity = 'Sedentario' | 'Normale' | 'Attivo' | 'Molto Attivo';
export type HealthConcern = 'Nessuno' | 'Digestione sensibile' | 'Pelle & Pelo' | 'Controllo del peso' | 'Appetito difficile' | 'Intolleranze';

export interface ProductCriteria {
  lifestage: Lifestage;
  activity?: Activity[];
  health?: string[];
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  type: 'dry' | 'wet' | 'care' | 'snack';
  desc: string;
  descEn: string;
  img: string;
  price: number;
  criteria?: ProductCriteria;
  pairing?: string;
}

export type PetType = 'dog' | 'cat';

export interface DogProfile {
  petType: PetType;
  name: string;
  lifestage: Lifestage | null;
  activity: Activity | null;
  health: HealthConcern[];
  weight: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DosageResult {
  dry: string;
  wet: string;
}

export interface MatchExplanation {
  label: string;
  labelIt: string;
  matched: boolean;
}

export interface ScoredRecommendation {
  product: Product;
  matchScore: number;
  reasons: string[];
  reasonsIt: string[];
  matchExplanations: MatchExplanation[];
  wet: Product | null;
  dosage: DosageResult;
}

export interface RecommendationResult {
  recommendations: ScoredRecommendation[];
  crossSell: Product[];
}
