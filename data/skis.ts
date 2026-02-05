export type SkiCategory = "all-mountain" | "freeride" | "piste";

/** Målgruppe for design (herre/dame/junior). */
export type SkiDesign = "unisex" | "men" | "women" | "junior";

/** Typer bruk skien er laget for (fra spørsmål «Type alpinski»). */
export type SkiUseType = "piste" | "park" | "touring" | "allmountain";

export type SkiModel = {
  id: string;
  brand: string;
  model: string;
  season: string; // "2025-2026"
  category: SkiCategory;

  image: string;

  /** Målgruppe – brukes ved design-valg (all/herre/dame/junior). */
  design: SkiDesign;
  /** Typer bruk (bakke/park/topptur/allmountain) – brukes ved type-valg. */
  useTypes: SkiUseType[];
  /** Tilgjengelige lengder (cm) – for lengdeanbefaling ved høyde/vekt. */
  lengthsCm?: number[];

  waistMm: number;
  radiusM: number;
  level: 1 | 2 | 3 | 4 | 5;

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
    design: "unisex",
    useTypes: ["allmountain"],
    lengthsCm: [164, 172, 180, 188],
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
    design: "unisex",
    useTypes: ["piste", "allmountain"],
    lengthsCm: [164, 172, 180, 188],
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
    design: "unisex",
    useTypes: ["allmountain", "touring"],
    lengthsCm: [162, 170, 178, 186],
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
    design: "unisex",
    useTypes: ["piste", "allmountain"],
    lengthsCm: [163, 170, 177, 184, 191],
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
    design: "unisex",
    useTypes: ["piste"],
    lengthsCm: [160, 168, 176, 184],
    waistMm: 86,
    radiusM: 15,
    level: 3,
    stability: 7,
    playful: 6,
    carvingGrip: 8,
    floatPow: 3,
  },
  {
    id: "head-wcr-e-gs-rebel-fis-25-26",
    brand: "HEAD",
    model: "WCR e-GS Rebel FIS",
    season: "2025-2026",
    category: "piste",
    image: "/images/skis/head-wcr-e-gs-rebel-fis-25-26.webp",
    design: "unisex",
    useTypes: ["piste"],
    waistMm: 68,
    radiusM: 27,
    level: 5,
    stability: 10,
    playful: 1,
    carvingGrip: 10,
    floatPow: 0,
  },
  {
    id: "k2-disruption-78c-25-26",
    brand: "K2",
    model: "Disruption 78C",
    season: "2025-2026",
    category: "piste",
    image: "/images/skis/rossignol-experience-86-ti-25-26.webp",
    design: "women",
    useTypes: ["piste"],
    lengthsCm: [149, 156, 163, 170],
    waistMm: 78,
    radiusM: 14,
    level: 2,
    stability: 6,
    playful: 7,
    carvingGrip: 7,
    floatPow: 2,
  },
  {
    id: "line-sir-francis-bacon-25-26",
    brand: "Line",
    model: "Sir Francis Bacon",
    season: "2025-2026",
    category: "freeride",
    image: "/images/skis/atomic-bent-100-25-26.webp",
    design: "unisex",
    useTypes: ["park", "allmountain"],
    lengthsCm: [172, 180, 188, 196],
    waistMm: 104,
    radiusM: 20,
    level: 4,
    stability: 6,
    playful: 9,
    carvingGrip: 5,
    floatPow: 9,
  },
];
