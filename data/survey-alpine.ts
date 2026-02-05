export type AlpineAnswerValue = string;

export type AlpineOption = {
  value: AlpineAnswerValue;
  label: string;
  description?: string; // kun for nivå
};

export type AlpineQuestion = {
  id: "design" | "level" | "terrain" | "style" | "turns";
  title: string;
  subtitle?: string;
  options: AlpineOption[];
};

export const ALPINE_SURVEY_V1: AlpineQuestion[] = [
  {
    id: "design",
    title: "Hvilket design foretrekker du?",
    subtitle: "Velg det som passer best.",
    options: [
      { value: "all", label: "Alle design" },
      { value: "women", label: "Dame" },
      { value: "men", label: "Herre" },
      { value: "junior", label: "Junior" },
    ],
  },
  {
    id: "level",
    title: "Hvor god er du på ski?",
    subtitle: "Velg det nivået som passer best.",
    options: [
      {
        value: "beginner",
        label: "Nybegynner",
        description:
          "Ny eller lite erfaring. Du kan svinge og stoppe, men føler deg usikker i fart.",
      },
      {
        value: "intermediate",
        label: "Middels",
        description:
          "Trives i blå og røde bakker. Parallelle svinger i moderat tempo og god kontroll.",
      },
      {
        value: "advanced",
        label: "Avansert",
        description:
          "Komfortabel i røde og svarte bakker. God teknikk, liker fart og krevende forhold.",
      },
      {
        value: "expert",
        label: "Ekspert",
        description:
          "Behersker alt terreng og føre. Høy fart og bratt er ikke et problem.",
      },
      {
        value: "svindal",
        label: "Mitt navn er Aksel Lund Svindal",
        description: "Du trenger egentlig ikke hjelp, men vi later som.",
      },
    ],
  },
  {
    id: "terrain",
    title: "Hvor på fjellet skal skiene brukes mest?",
    subtitle: "Velg det som passer best.",
    options: [
      { value: "piste_only", label: "Preparert bakke" },
      { value: "mostly_piste_some_pow", label: "Mest i bakke – men litt pudder" },
      { value: "mostly_pow_some_piste", label: "Mest i pudder – men litt bakke" },
      { value: "pow_only", label: "Bare pudder" },
    ],
  },
  {
    id: "style",
    title: "Hvordan er din kjørestil?",
    subtitle: "Velg det som passer best.",
    options: [
      { value: "relaxed", label: "Avslappet" },
      { value: "balanced", label: "Midt i mellom" },
      { value: "hard", label: "Kjører så hardt det går" },
    ],
  },
  {
    id: "turns",
    title: "Hvordan foretrekker du svingene?",
    subtitle: "Velg det som passer best.",
    options: [
      { value: "short", label: "Korte" },
      { value: "mostly_short", label: "Mest korte" },
      { value: "mostly_long", label: "Mest lange" },
      { value: "long", label: "Lange" },
    ],
  },
];
