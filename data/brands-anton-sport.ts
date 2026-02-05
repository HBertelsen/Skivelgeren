/**
 * Skimerker som Anton Sport fører.
 * Kun merker som leverer ski (alpin, freeride, all-mountain og/eller langrenn/touring).
 * Brukes som oversikt over hvilke merker vi skal legge inn modeller for etterhvert.
 *
 * Kilde: Anton Sport sin merkeliste (filtrert til skiprodusenter).
 */

export type SkiBrandFocus = "alpine" | "nordic" | "both";

export type AntonSkiBrand = {
  name: string;
  /** Hovedfokus: alpine (bakke/freeride), nordic (langrenn/touring), eller begge */
  focus: SkiBrandFocus;
  /** Merker vi allerede har modeller for i data/skis.ts */
  hasModelsInCatalog?: boolean;
};

/** Alle skimerker hos Anton Sport – sortert alfabetisk. */
export const ANTON_SKI_BRANDS: AntonSkiBrand[] = [
  { name: "Alpina", focus: "nordic", hasModelsInCatalog: true },
  { name: "Armada", focus: "alpine" },
  { name: "Atomic", focus: "both", hasModelsInCatalog: true },
  { name: "Black Crows", focus: "alpine" },
  { name: "Candide", focus: "alpine" },
  { name: "DPS", focus: "alpine" },
  { name: "Dynafit", focus: "alpine" }, // touring
  { name: "Faction", focus: "alpine" },
  { name: "Fischer", focus: "both", hasModelsInCatalog: false },
  { name: "G3", focus: "alpine" }, // touring
  { name: "Head", focus: "alpine", hasModelsInCatalog: true },
  { name: "K2", focus: "alpine", hasModelsInCatalog: true },
  { name: "Kästle", focus: "alpine" },
  { name: "Line", focus: "alpine", hasModelsInCatalog: true },
  { name: "Madshus", focus: "nordic" },
  { name: "Nordica", focus: "alpine" },
  { name: "Rossignol", focus: "both", hasModelsInCatalog: true },
  { name: "Salomon", focus: "both", hasModelsInCatalog: true },
  { name: "Scott", focus: "alpine" },
  { name: "SGNskis", focus: "alpine" },
  { name: "Stereo Skis", focus: "alpine" },
  { name: "Stöckli", focus: "alpine" },
  { name: "Van Deer", focus: "alpine" },
  { name: "Völkl", focus: "alpine", hasModelsInCatalog: true },
  { name: "Åsnes", focus: "nordic" },
];

/** Kun merkenavn (for enkel bruk i lister/dropdown). */
export const ANTON_SKI_BRAND_NAMES = ANTON_SKI_BRANDS.map((b) => b.name);

/** Merker vi ennå ikke har modeller for. */
export const BRANDS_WITHOUT_MODELS = ANTON_SKI_BRANDS.filter(
  (b) => !b.hasModelsInCatalog
).map((b) => b.name);

/** Merker vi allerede har minst én modell for. */
export const BRANDS_WITH_MODELS = ANTON_SKI_BRANDS.filter(
  (b) => b.hasModelsInCatalog
).map((b) => b.name);
