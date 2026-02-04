export type SkiCategory = "all-mountain" | "freeride" | "piste";

export type SkiModel = {
  id: string;
  brand: string;
  model: string;
  season: string; // "2025-2026"
  category: SkiCategory;

  image: string; // ✅ path til bilde i /public

  waistMm: number;    // midtbredde
  radiusM: number;    // svingradius-ish
  level: 1 | 2 | 3 | 4 | 5; // 1=nybegynner, 5=ekspert

  // Profil-scorer 0–10 (for rangering)
  stability: number;
  playful: number;
  carvingGrip: number;
  floatPow: number;
};

export const SKIS: SkiModel[] = [
  {
    id: "atomic-bent-100-25-26",
    brand: "Atomic",
    model: "Bent 100",
    season: "2025-2026",
    category: "freeride",
    image: "/images/skis/atomic-bent-100-25-26.webp",
    waistMm: 100,
    radiusM: 19,
    level: 3,
    stability: 6,
    playful: 9,
    carvingGrip: 6,
    floatPow: 8,
  },
  {
    id: "blizzard-rustler-10-25-26",
    brand: "Blizzard",
    model: "Rustler 10",
    season: "2025-2026",
    category: "all-mountain",
    image: "/images/skis/blizzard-rustler-10-25-26.webp",
    waistMm: 102,
    radiusM: 18,
    level: 4,
    stability: 8,
    playful: 7,
    carvingGrip: 7,
    floatPow: 8,
  },
  {
    id: "salomon-qst-98-25-26",
    brand: "Salomon",
    model: "QST 98",
    season: "2025-2026",
    category: "all-mountain",
    image: "/images/skis/salomon-qst-98-25-26.webp",
    waistMm: 98,
    radiusM: 17,
    level: 3,
    stability: 7,
    playful: 7,
    carvingGrip: 7,
    floatPow: 7,
  },
  {
    id: "volkl-m6-mantra-25-26",
    brand: "Völkl",
    model: "Mantra M6",
    season: "2025-2026",
    category: "all-mountain",
    image: "/images/skis/volkl-m6-mantra-25-26.webp",
    waistMm: 96,
    radiusM: 19,
    level: 5,
    stability: 9,
    playful: 5,
    carvingGrip: 9,
    floatPow: 6,
  },
  {
    id: "rossignol-experience-86-ti-25-26",
    brand: "Rossignol",
    model: "Experience 86 Ti",
    season: "2025-2026",
    category: "piste",
    image: "/images/skis/rossignol-experience-86-ti-25-26.webp",
    waistMm: 86,
    radiusM: 15,
    level: 3,
    stability: 7,
    playful: 6,
    carvingGrip: 8,
    floatPow: 3,
  },
];
