/**
 * Langrennski (Nordic) – egen datastruktur siden parametre er andre enn for alpinski.
 * Modelliste hentet fra Alpina katalog 2025–2026 (alpinasports.com + PDF-katalog).
 */

import { CURRENT_SEASON } from "./constants";
import { skiSlug } from "@/lib/slug";

export type NordicSkiCategory = "touring" | "backcountry" | "racing" | "classic" | "skate" | "junior";

export type NordicSkiModel = {
  id: string;
  brand: string;
  model: string;
  season: string;
  category: NordicSkiCategory;
  /** Wax (klister/paraffin) eller waxless (fiskeskjell / no wax) */
  waxType: "wax" | "waxless";
  /** Tilgjengelige lengder (cm). */
  lengthsCm: number[];
  image: string;
};

const SEASON = CURRENT_SEASON;
const BRAND = "Alpina";
const PLACEHOLDER_IMAGE = "/images/skis/placeholder-nordic.webp";

function nordicSkiImage(brand: string, model: string, season: string): string {
  // Naming convention: brand-model-season.webp (lowercase, spaces to hyphens)
  const modelLower = model
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const brandLower = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
  const seasonNorm = season.replace("-", "-");
  const filename = `${brandLower}-${modelLower}-${seasonNorm}.webp`;
  // Return placeholder for now - will use actual image if file exists
  return `/images/skis/${filename}`;
}

export const NORDIC_SKIS: NordicSkiModel[] = [
  // Backcountry skis
  {
    id: skiSlug(BRAND, "Pioneer 80E", SEASON),
    brand: BRAND,
    model: "Pioneer 80E",
    season: SEASON,
    category: "backcountry",
    waxType: "waxless",
    lengthsCm: [175, 186, 197, 208],
    image: nordicSkiImage(BRAND, "Pioneer 80E", SEASON),
  },
  {
    id: skiSlug(BRAND, "Discovery 68", SEASON),
    brand: BRAND,
    model: "Discovery 68",
    season: SEASON,
    category: "backcountry",
    waxType: "waxless",
    lengthsCm: [170, 180, 190, 200, 210],
    image: nordicSkiImage(BRAND, "Discovery 68", SEASON),
  },

  // Touring skis
  {
    id: skiSlug(BRAND, "Discovery 68E", SEASON),
    brand: BRAND,
    model: "Discovery 68E",
    season: SEASON,
    category: "touring",
    waxType: "waxless",
    lengthsCm: [170, 180, 190, 200, 210],
    image: nordicSkiImage(BRAND, "Discovery 68E", SEASON),
  },
  {
    id: skiSlug(BRAND, "Control 60", SEASON),
    brand: BRAND,
    model: "Control 60",
    season: SEASON,
    category: "classic",
    waxType: "waxless",
    lengthsCm: [170, 180, 190, 200],
    image: nordicSkiImage(BRAND, "Control 60", SEASON),
  },
  {
    id: skiSlug(BRAND, "Energy", SEASON),
    brand: BRAND,
    model: "Energy",
    season: SEASON,
    category: "touring",
    waxType: "waxless",
    lengthsCm: [186, 191, 196, 201, 206],
    image: nordicSkiImage(BRAND, "Energy", SEASON),
  },
  {
    id: skiSlug(BRAND, "Control 60E", SEASON),
    brand: BRAND,
    model: "Control 60E",
    season: SEASON,
    category: "touring",
    waxType: "waxless",
    lengthsCm: [180, 190, 200, 210],
    image: nordicSkiImage(BRAND, "Control 60E", SEASON),
  },
  {
    id: skiSlug(BRAND, "Control 64E", SEASON),
    brand: BRAND,
    model: "Control 64E",
    season: SEASON,
    category: "touring",
    waxType: "waxless",
    lengthsCm: [175, 185, 195, 205],
    image: nordicSkiImage(BRAND, "Control 64E", SEASON),
  },

  // Junior skis
  {
    id: skiSlug(BRAND, "Energy JR", SEASON),
    brand: BRAND,
    model: "Energy JR",
    season: SEASON,
    category: "junior",
    waxType: "waxless",
    lengthsCm: [90, 100, 110, 120, 130, 140, 150, 160, 170],
    image: nordicSkiImage(BRAND, "Energy JR", SEASON),
  },
];
