import { SKIS, SkiModel } from "../data/skis";

export type QuizAnswers = {
  terrain: "piste" | "mixed" | "powder";
  priority: "stability" | "playful";
  level: 1 | 2 | 3 | 4 | 5;
  speed: "slow" | "medium" | "fast";
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreSki(ski: SkiModel, a: QuizAnswers) {
  // Vekter basert på svar
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

  // Nivå-match (straff hvis ski er "for krevende")
  const levelDiff = ski.level - a.level; // positiv = skia er mer krevende
  const levelPenalty = levelDiff > 0 ? levelDiff * 1.2 : 0; // straff bare hvis for vanskelig

  // Total score
  let total =
    ski.stability * wStability * terrainWeights.stability * speedWeights.stability +
    ski.playful * wPlayful * terrainWeights.playful * speedWeights.playful +
    ski.carvingGrip * terrainWeights.carving +
    ski.floatPow * terrainWeights.float;

  total -= levelPenalty * 2.0;

  // Liten bonus hvis midtbredde passer terrengvalget
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
    reasons.push(`Du valgte variert bruk → balansert profil (kantgrep ${ski.carvingGrip}/10, flyt ${ski.floatPow}/10).`);
  }

  reasons.push(`Passer omtrent nivå ${ski.level} (din input: ${a.level}).`);

  return reasons.slice(0, 4);
}
