// data/survey-alpine.ts

export type AlpineDesignPreference = "womens" | "any" | "junior";
export type AlpineSkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert"
  | "svindal";
export type AlpineTerrain =
  | "piste_only"
  | "mostly_piste_some_pow"
  | "mostly_pow_some_piste"
  | "pow_only";
export type AlpineSpeed = "relaxed" | "medium" | "fast";
export type AlpineTurnRadius =
  | "short"
  | "mostly_short"
  | "mostly_long"
  | "long";

export type AlpineAbout = {
  name?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
};

export type AlpineAnswers = {
  design: AlpineDesignPreference;
  skill: AlpineSkillLevel;
  terrain: AlpineTerrain;
  speed: AlpineSpeed;
  turns: AlpineTurnRadius;
  about: AlpineAbout;
};

export type SurveyOption<T extends string> = {
  value: T;
  label: string;
};

export type SurveyQuestionBase = {
  id: string;
  title: string;
  description?: string;
};

export type SingleSelectQuestion<T extends string> = SurveyQuestionBase & {
  type: "single";
  options: SurveyOption<T>[];
};

export type AboutQuestion = SurveyQuestionBase & {
  type: "about";
  fields: Array<
    | { key: "name"; label: string; placeholder?: string; optional?: boolean }
    | {
        key: "age" | "heightCm" | "weightKg";
        label: string;
        placeholder?: string;
        optional?: boolean;
        min?: number;
        max?: number;
      }
  >;
};

export type AlpineQuestion =
  | SingleSelectQuestion<AlpineDesignPreference>
  | SingleSelectQuestion<AlpineSkillLevel>
  | SingleSelectQuestion<AlpineTerrain>
  | SingleSelectQuestion<AlpineSpeed>
  | SingleSelectQuestion<AlpineTurnRadius>
  | AboutQuestion;

export const ALPINE_QUESTIONS: AlpineQuestion[] = [
  {
    id: "design",
    type: "single",
    title: "Hvilket design foretrekker du?",
    description:
      "Dette påvirker kun hvilke modeller du får se – ikke hvordan skiene fungerer.",
    options: [
      { value: "womens", label: "Damemodeller" },
      { value: "any", label: "Alle design (ingen preferanse)" },
      { value: "junior", label: "Junior" },
    ],
  },
  {
    id: "skill",
    type: "single",
    title: "Hvordan vil du beskrive nivået ditt på alpint?",
    options: [
      { value: "beginner", label: "Nybegynner" },
      { value: "intermediate", label: "Viderekommen" },
      { value: "advanced", label: "Avansert" },
      { value: "expert", label: "Ekspert" },
      { value: "svindal", label: "Jeg er Aksel Lund Svindal 😎" },
    ],
  },
  {
    id: "terrain",
    type: "single",
    title: "Hvor på fjellet kjører du mest?",
    options: [
      { value: "piste_only", label: "Bare i bakken" },
      { value: "mostly_piste_some_pow", label: "Mest i bakken, men litt pudder" },
      { value: "mostly_pow_some_piste", label: "Mest i pudder, men litt i bakken" },
      { value: "pow_only", label: "Bare i pudder" },
    ],
  },
  {
    id: "speed",
    type: "single",
    title: "Hvilken fart trives du best i?",
    options: [
      { value: "relaxed", label: "Avslappet" },
      { value: "medium", label: "Middels" },
      { value: "fast", label: "Rask" },
    ],
  },
  {
    id: "turns",
    type: "single",
    title: "Hvilken type svinger liker du best?",
    options: [
      { value: "short", label: "Korte svinger" },
      { value: "mostly_short", label: "Mest korte svinger" },
      { value: "mostly_long", label: "Mest lange svinger" },
      { value: "long", label: "Lange svinger" },
    ],
  },
  {
    id: "about",
    type: "about",
    title: "Fortell oss litt om deg",
    description:
      "Valgfritt, men hjelper oss å foreslå bedre skilengde og mer presise anbefalinger.",
    fields: [
      { key: "name", label: "Navn", placeholder: "Valgfritt", optional: true },
      { key: "age", label: "Alder (år)", placeholder: "F.eks. 24", optional: true, min: 3, max: 99 },
      { key: "heightCm", label: "Høyde (cm)", placeholder: "F.eks. 182", optional: true, min: 80, max: 230 },
      { key: "weightKg", label: "Vekt (kg)", placeholder: "F.eks. 85", optional: true, min: 15, max: 200 },
    ],
  },
];

export const DEFAULT_ALPINE_ANSWERS: AlpineAnswers = {
  design: "any",
  skill: "intermediate",
  terrain: "mostly_piste_some_pow",
  speed: "medium",
  turns: "mostly_long",
  about: {},
};
