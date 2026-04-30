/**
 * Color palettes for the share-story card.
 *
 * Each palette is an ordered triplet of Tailwind gradient class strings,
 * one per stat card. The card overlays a `bg` color behind the stack to
 * make the palette feel like a unified scene, not 3 floating chips.
 *
 * Initial palette = hash(pet name) % palettes.length, so the same pet
 * always opens with the same vibe. "Regenerate" cycles forward.
 */

export interface Palette {
  id: string;
  /** Background tint behind the stat stack. Hex or short rgba. */
  bg: string;
  /** 3 gradient class strings, one per stat card. */
  cards: [string, string, string];
}

export const PALETTES: Palette[] = [
  // 0 — Purina classic (red / violet / orange)
  {
    id: "purina-classic",
    bg: "linear-gradient(180deg, #1a0a0c 0%, #0a0a0a 100%)",
    cards: [
      "from-purina-red via-rose-500 to-orange-500",
      "from-violet-500 via-purple-500 to-fuchsia-600",
      "from-amber-500 via-orange-500 to-red-600",
    ],
  },

  // 1 — Aurora (cyan / violet / pink)
  {
    id: "aurora",
    bg: "linear-gradient(180deg, #0a0a1a 0%, #0a0a0a 100%)",
    cards: [
      "from-cyan-500 via-blue-500 to-indigo-600",
      "from-violet-500 via-purple-500 to-pink-500",
      "from-rose-500 via-pink-500 to-fuchsia-600",
    ],
  },

  // 2 — Sunset (orange / fuchsia / amber)
  {
    id: "sunset",
    bg: "linear-gradient(180deg, #1a0d0a 0%, #0a0a0a 100%)",
    cards: [
      "from-amber-400 via-orange-500 to-red-600",
      "from-fuchsia-500 via-pink-500 to-rose-500",
      "from-yellow-400 via-amber-500 to-orange-500",
    ],
  },

  // 3 — Forest (emerald / lime / teal)
  {
    id: "forest",
    bg: "linear-gradient(180deg, #0a1a14 0%, #0a0a0a 100%)",
    cards: [
      "from-emerald-500 via-teal-500 to-cyan-600",
      "from-lime-500 via-green-500 to-emerald-600",
      "from-teal-500 via-cyan-500 to-blue-500",
    ],
  },

  // 4 — Berry (purple / pink / red)
  {
    id: "berry",
    bg: "linear-gradient(180deg, #14081a 0%, #0a0a0a 100%)",
    cards: [
      "from-purple-600 via-fuchsia-600 to-pink-600",
      "from-rose-500 via-red-500 to-orange-500",
      "from-indigo-600 via-purple-600 to-fuchsia-600",
    ],
  },

  // 5 — Ocean (deep blue / cyan / teal)
  {
    id: "ocean",
    bg: "linear-gradient(180deg, #0a1322 0%, #0a0a0a 100%)",
    cards: [
      "from-blue-600 via-cyan-500 to-teal-500",
      "from-indigo-600 via-blue-500 to-sky-500",
      "from-cyan-400 via-teal-500 to-emerald-600",
    ],
  },

  // 6 — Candy (pink / sky / lime)
  {
    id: "candy",
    bg: "linear-gradient(180deg, #1a0a14 0%, #0a0a0a 100%)",
    cards: [
      "from-pink-500 via-rose-400 to-orange-400",
      "from-sky-400 via-cyan-400 to-teal-400",
      "from-lime-400 via-yellow-400 to-amber-500",
    ],
  },

  // 7 — Mono red (Purina-pure escalating reds)
  {
    id: "mono-red",
    bg: "linear-gradient(180deg, #1a0a0c 0%, #0a0a0a 100%)",
    cards: [
      "from-red-700 via-red-500 to-red-400",
      "from-rose-700 via-rose-500 to-pink-400",
      "from-orange-700 via-red-500 to-rose-400",
    ],
  },
];

/**
 * Lightweight string hash → integer (no crypto needed; just stable).
 * Identical input always produces identical output.
 */
export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0; // force 32-bit int
  }
  return Math.abs(h);
}

/** Pick a starting palette index from a string seed (e.g. pet name). */
export function paletteIndexFor(seed: string): number {
  return hashString(seed) % PALETTES.length;
}
