import {
  SKIS,
  SkiModel,
  type SkiCategory,
  type SkiDesign,
  type SkiUseType,
} from "../data/skis";

export type QuizAnswers = {
  terrain: "piste" | "mixed" | "powder";
  priority: "stability" | "playful";
  level: 1 | 2 | 3 | 4 | 5;
  speed: "slow" | "medium" | "fast";
};

/** Svar fra eldre/alternativ lagring (session/localStorage). */
export type AlpineAnswers = {
  design?: string;
  skill?: string;
  terrain?: string;
  speed?: string;
  turns?: string;
  about?: {
    name?: string;
    age?: number;
    heightCm?: number;
    weightKg?: number;
  };
};

/** Lagret format fra skivelgeren_quiz_v1 (spørreundersøkelsen). */
export type QuizV1 = {
  discipline?: string;
  type?: string;
  design?: string;
  level?: number | string;
  terrain?: string;
  style?: string;
  turns?: string;
  directSkiId?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreSki(ski: SkiModel, a: QuizAnswers) {
  const wStability = a.priority === "stability" ? 1.4 : 0.9;
  const wPlayful = a.priority === "playful" ? 1.4 : 0.9;

  const terrainWeights =
    a.terrain === "piste"
      ? { carving: 1.5, float: 0.5, stability: 1.1, playful: 0.9 }
      : a.terrain === "mixed"
        ? { carving: 1.1, float: 1.1, stability: 1.1, playful: 1.1 }
        : { carving: 0.6, float: 1.6, stability: 1.1, playful: 1.0 };

  const speedWeights =
    a.speed === "slow"
      ? { stability: 0.9, playful: 1.1 }
      : a.speed === "medium"
        ? { stability: 1.0, playful: 1.0 }
        : { stability: 1.2, playful: 0.9 };

  const levelDiff = ski.level - a.level;
  const levelPenalty = levelDiff > 0 ? levelDiff * 1.2 : 0;

  let total =
    ski.stability * wStability * terrainWeights.stability * speedWeights.stability +
    ski.playful * wPlayful * terrainWeights.playful * speedWeights.playful +
    ski.carvingGrip * terrainWeights.carving +
    ski.floatPow * terrainWeights.float;

  total -= levelPenalty * 2.0;

  if (a.terrain === "piste") {
    total += clamp(100 - ski.waistMm, 0, 30) * 0.05;
  } else if (a.terrain === "powder") {
    total += clamp(ski.waistMm - 95, 0, 30) * 0.05;
  }

  return total;
}

export function recommend(answers: QuizAnswers, season: string) {
  const pool = SKIS.filter((s) => s.season.replaceAll("–", "-") === season);

  const scored = pool
    .map((ski) => ({ ski, score: scoreSki(ski, answers) }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0]?.ski ?? null;
  const alternatives = scored.slice(1, 4).map((x) => x.ski);

  return { top, alternatives };
}

export function explainWhy(ski: SkiModel, a: QuizAnswers) {
  const reasons: string[] = [];

  if (a.priority === "stability") {
    reasons.push(`Du prioriterte stabilitet → denne har stabilitet ${ski.stability}/10.`);
  } else {
    reasons.push(`Du prioriterte lekenhet → denne har lekenhet ${ski.playful}/10.`);
  }

  if (a.terrain === "piste") {
    reasons.push(`Du valgte mest piste → godt kantgrep (${ski.carvingGrip}/10).`);
  } else if (a.terrain === "powder") {
    reasons.push(`Du valgte mest løssnø → bra flyt (${ski.floatPow}/10).`);
  } else {
    reasons.push(
      `Du valgte variert bruk → balansert profil (kantgrep ${ski.carvingGrip}/10, flyt ${ski.floatPow}/10).`
    );
  }

  reasons.push(`Passer omtrent nivå ${ski.level} (din input: ${a.level}).`);

  return reasons.slice(0, 4);
}

// —— Survey-based ranking (én kilde til sannhet) ——

type Preferences = {
  stability: number;
  playful: number;
  carvingGrip: number;
  floatPow: number;
  waistMm: number;
  radiusM: number;
  level: undefined | 1 | 2 | 3 | 4 | 5;
  category: undefined | SkiCategory;
  /** Fra spørsmål «Design»: all | women | men | junior */
  design: undefined | string;
  /** Fra spørsmål «Type alpinski»: piste | park | touring | allmountain (kartlagt fra bakke/park/topptur/allmountain) */
  useType: undefined | SkiUseType;
};

function normalizeLevel(x: unknown): 1 | 2 | 3 | 4 | 5 | undefined {
  if (x == null) return undefined;
  if (typeof x === "number") {
    if (x >= 1 && x <= 5) return x as 1 | 2 | 3 | 4 | 5;
    return undefined;
  }
  const s = String(x).toLowerCase();
  if (s.includes("nybegynner") || s.includes("beginner")) return 1;
  if (s.includes("middels") || s.includes("intermediate")) return 3;
  if (s.includes("avansert") || s.includes("advanced")) return 4;
  if (s.includes("ekspert") || s.includes("expert")) return 5;
  if (s.includes("svindal")) return 5;
  return undefined;
}

function preferencesFromAnswers(
  answers: AlpineAnswers | null,
  quiz: QuizV1 | null
): Preferences {
  const base: Preferences = {
    stability: 6,
    playful: 6,
    carvingGrip: 6,
    floatPow: 6,
    waistMm: 95,
    radiusM: 18,
    level: undefined,
    category: undefined,
    design: undefined,
    useType: undefined,
  };

  const designRaw = (quiz?.design ?? answers?.design ?? "").toString().toLowerCase();
  if (designRaw && designRaw !== "all") {
    if (designRaw.includes("women") || designRaw === "dame") base.design = "women";
    else if (designRaw.includes("men") || designRaw === "herre") base.design = "men";
    else if (designRaw.includes("junior")) base.design = "junior";
  }

  const typeRaw = (quiz?.type ?? "").toString().toLowerCase();
  if (typeRaw) {
    if (typeRaw === "bakke") base.useType = "piste";
    else if (typeRaw === "park") base.useType = "park";
    else if (typeRaw === "topptur") base.useType = "touring";
    else if (typeRaw === "allmountain") base.useType = "allmountain";
  }

  const quizLevel = normalizeLevel(quiz?.level);
  const ansLevel = normalizeLevel(answers?.skill);
  const level = quizLevel ?? ansLevel;
  if (level) base.level = level;

  const terrain = (quiz?.terrain ?? answers?.terrain ?? "").toString();

  if (terrain.includes("preparert") || terrain.includes("piste_only")) {
    base.category = "piste";
    base.floatPow = 2;
    base.carvingGrip = 9;
    base.stability = 8;
    base.waistMm = 86;
    base.radiusM = 15;
  } else if (terrain.includes("mest i bakke") || terrain.includes("mostly_piste")) {
    base.category = "all-mountain";
    base.floatPow = 5;
    base.carvingGrip = 7;
    base.stability = 7;
    base.waistMm = 92;
    base.radiusM = 17;
  } else if (terrain.includes("mest i pudder") || terrain.includes("mostly_pow")) {
    base.category = "all-mountain";
    base.floatPow = 7;
    base.carvingGrip = 6;
    base.stability = 7;
    base.waistMm = 100;
    base.radiusM = 18;
  } else if (terrain.includes("bare pudder") || terrain.includes("pow_only")) {
    base.category = "freeride";
    base.floatPow = 9;
    base.carvingGrip = 4;
    base.stability = 7;
    base.waistMm = 108;
    base.radiusM = 19;
  }

  const style = (quiz?.style ?? answers?.speed ?? "").toString();
  if (style.includes("avslappet") || style.includes("relaxed")) {
    base.stability = Math.max(base.stability - 1, 1);
    base.playful = Math.min(base.playful + 1, 10);
  } else if (style.includes("hardt") || style.includes("hard")) {
    base.stability = Math.min(base.stability + 2, 10);
    base.playful = Math.max(base.playful - 2, 0);
    base.carvingGrip = Math.min(base.carvingGrip + 1, 10);
  }

  const turns = (quiz?.turns ?? answers?.turns ?? "").toString();
  if (turns.includes("korte") || turns.includes("short")) {
    base.radiusM = Math.max(13, base.radiusM - 3);
    base.carvingGrip = Math.min(base.carvingGrip + 1, 10);
  } else if (turns.includes("lange") || turns.includes("long")) {
    base.radiusM = Math.min(22, base.radiusM + 3);
    base.stability = Math.min(base.stability + 1, 10);
  }

  return base;
}

function scoreSkiFromPreferences(ski: SkiModel, pref: Preferences): number {
  let score = 0;

  score += 10 - Math.abs(ski.stability - pref.stability);
  score += 10 - Math.abs(ski.playful - pref.playful);
  score += 10 - Math.abs(ski.carvingGrip - pref.carvingGrip);
  score += 10 - Math.abs(ski.floatPow - pref.floatPow);

  score += 5 - Math.min(5, Math.abs(ski.waistMm - pref.waistMm) / 10);
  score += 5 - Math.min(5, Math.abs(ski.radiusM - pref.radiusM) / 5);

  if (pref.level != null) {
    const diff = ski.level - pref.level;
    if (diff <= 0) score += 4;
    else score -= diff * 4;
  }

  if (pref.category && ski.category === pref.category) score += 6;

  if (pref.design && pref.design !== "all") {
    const want = pref.design as SkiDesign;
    if (ski.design === want || ski.design === "unisex") score += 5;
    else if (
      (want === "women" && ski.design === "men") ||
      (want === "men" && ski.design === "women")
    )
      score -= 8;
    else if (want === "junior" && ski.design !== "junior" && ski.design !== "unisex")
      score -= 5;
  }

  if (pref.useType && ski.useTypes.includes(pref.useType)) score += 6;

  return score;
}

export type RankedSki = { ski: SkiModel; score: number };

/**
 * Anbefaling basert på spørreundersøkelsen (AlpineAnswers + QuizV1).
 * Returnerer rangert liste med score per ski (for match-% på resultatsiden).
 */
export function recommendFromSurvey(
  answers: AlpineAnswers | null,
  quiz: QuizV1 | null,
  season: string
): { top: SkiModel | null; ranked: RankedSki[] } {
  const pool = SKIS.filter((s) => s.season.replaceAll("–", "-") === season);
  const pref = preferencesFromAnswers(answers, quiz);

  const ranked = pool
    .map((s) => ({ ski: s, score: scoreSkiFromPreferences(s, pref) }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0]?.ski ?? null;

  return { top, ranked };
}

/**
 * Konverter score til match-prosent: beste ski = 100 %, dårligste = 0 %.
 * Bruk scores fra hele ranked-listen for konsistent skala.
 */
export function scoreToMatchPercent(score: number, ranked: RankedSki[]): number {
  if (ranked.length === 0) return 0;
  const min = Math.min(...ranked.map((r) => r.score));
  const max = Math.max(...ranked.map((r) => r.score));
  if (max === min) return 100;
  return Math.round(100 * (score - min) / (max - min));
}
