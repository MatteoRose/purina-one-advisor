import { create } from 'zustand';
import { DogProfile, CartItem, HealthConcern, Lifestage, Activity, PetType } from '@/types';

interface AdvisorState {
  // Profile
  profile: DogProfile;
  currentStep: number;
  setPetType: (pt: PetType) => void;
  setName: (name: string) => void;
  setLifestage: (ls: Lifestage) => void;
  setActivity: (act: Activity) => void;
  toggleHealth: (h: HealthConcern) => void;
  setWeight: (w: number) => void;
  setSterilized: (v: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string) => void;
  addBundleToCart: (productIds: string[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  lastAdded: string | null;
  lastAddedAt: number;
  lastAddedBatch: string[];

  // Discount — global, applies ONLY to the first recommended product
  discountUnlocked: boolean;
  primaryProductId: string | null;
  unlockDiscount: (productId: string) => void;

  // Language
  locale: 'en' | 'it';
  setLocale: (l: 'en' | 'it') => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Reset
  reset: () => void;
}

const initialProfile: DogProfile = {
  petType: 'dog',
  name: '',
  lifestage: null,
  activity: null,
  health: [],
  weight: 5.0,
};

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  profile: { ...initialProfile },
  currentStep: 0,

  setPetType: (petType) => set((s) => ({ profile: { ...s.profile, petType } })),
  setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
  setLifestage: (lifestage) => set((s) => ({ profile: { ...s.profile, lifestage } })),
  setActivity: (activity) => set((s) => ({ profile: { ...s.profile, activity } })),
  toggleHealth: (h) => set((s) => {
    const current = s.profile.health;
    if (h === 'Nessuno') return { profile: { ...s.profile, health: ['Nessuno'] } };
    const filtered = current.filter(c => c !== 'Nessuno');
    const exists = filtered.includes(h);
    return {
      profile: {
        ...s.profile,
        health: exists ? filtered.filter(c => c !== h) : [...filtered, h],
      },
    };
  }),
  setWeight: (weight) => set((s) => ({ profile: { ...s.profile, weight } })),
  setSterilized: (sterilized) => set((s) => ({ profile: { ...s.profile, sterilized } })),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  goToStep: (step) => set({ currentStep: step }),

  // Cart
  cart: [],
  lastAdded: null,
  lastAddedAt: 0,
  lastAddedBatch: [],
  addToCart: (productId) => set((s) => {
    const existing = s.cart.find(item => item.productId === productId);
    const newCart = existing
      ? s.cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
      : [...s.cart, { productId, quantity: 1 }];
    return { cart: newCart, lastAdded: productId, lastAddedAt: Date.now(), lastAddedBatch: [productId] };
  }),
  addBundleToCart: (productIds) => set((s) => {
    const unique = Array.from(new Set(productIds));
    let newCart = [...s.cart];
    for (const pid of unique) {
      const existing = newCart.find(item => item.productId === pid);
      newCart = existing
        ? newCart.map(item => item.productId === pid ? { ...item, quantity: item.quantity + 1 } : item)
        : [...newCart, { productId: pid, quantity: 1 }];
    }
    return {
      cart: newCart,
      lastAdded: unique[unique.length - 1] ?? null,
      lastAddedAt: Date.now(),
      lastAddedBatch: unique,
    };
  }),
  removeFromCart: (productId) => set((s) => ({
    cart: s.cart.filter(item => item.productId !== productId),
  })),
  updateQuantity: (productId, delta) => set((s) => {
    const newCart = s.cart
      .map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0);
    return { cart: newCart };
  }),
  clearCart: () => set({ cart: [] }),

  // Discount
  discountUnlocked: false,
  primaryProductId: null,
  unlockDiscount: (productId) => set({ discountUnlocked: true, primaryProductId: productId }),

  // Language
  locale: 'en',
  setLocale: (locale) => set({ locale }),

  // Theme
  theme: 'dark',
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', next === 'light');
    }
    return { theme: next };
  }),

  // Reset
  reset: () => set({
    profile: { ...initialProfile },
    currentStep: 0,
    cart: [],
    lastAdded: null,
    lastAddedAt: 0,
    lastAddedBatch: [],
    discountUnlocked: false,
    primaryProductId: null,
  }),
}));
