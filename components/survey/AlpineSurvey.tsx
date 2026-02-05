"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ALPINE_SURVEY_V1, type AlpineQuestion } from "@/data/survey-alpine";

const STORAGE_KEY = "skivelgeren_quiz_v1";

function safeReadStorage(): any {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") ?? {};
  } catch {
    return {};
  }
}

function safeWriteStorage(next: any) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export default function AlpineSurvey() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type"); // kommer fra AlpineTypePage
  const [step, setStep] = React.useState(0);

  const q: AlpineQuestion | undefined = ALPINE_SURVEY_V1[step];

  // Sørg for at discipline/type finnes i storage (uten å endre design/flyt)
  React.useEffect(() => {
    const existing = safeReadStorage();

    const merged = {
      ...existing,
      discipline: existing.discipline ?? "alpin",
      ...(type ? { type } : {}),
    };

    // normaliser svindal hvis den allerede skulle ligge der
    if (merged.level === "svindal") merged.level = "expert";

    safeWriteStorage(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function choose(questionId: AlpineQuestion["id"], value: string) {
  const existing = safeReadStorage();

  // 🚀 Svindal = hopp direkte til FIS
  if (questionId === "level" && value === "svindal") {
  safeWriteStorage({
    ...existing,
    level: 5,
    directSkiId: "head-wcr-e-gs-rebel-fis-25-26",
  });

  router.push("/results");
  return;
}

  const normalizedValue =
    questionId === "level" && value === "svindal" ? "expert" : value;

  safeWriteStorage({
    ...existing,
    [questionId]: normalizedValue,
  });

  const nextStep = step + 1;
  if (nextStep < ALPINE_SURVEY_V1.length) {
    setStep(nextStep);
  } else {
    router.push("/results");
  }
}

  function back() {
    if (step === 0) router.back();
    else setStep((s) => Math.max(0, s - 1));
  }

  if (!q) return null;

  return (
    <main className="min-h-screen bg-white px-6 flex flex-col">
      <div className="mx-auto max-w-5xl flex-1 w-full">
        {/* Tittel */}
        <div className="pt-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black">
            {q.title}
          </h1>
          <p className="mt-3 text-base text-black/70">
            {q.subtitle ?? "Velg det som passer best."}
          </p>
        </div>

        {/* Kort */}
        <div className="mt-20 flex justify-center gap-6 flex-wrap">
          {q.options.map((opt) => (
            <Card
              key={opt.value}
              label={opt.label}
              description={opt.description}
              onClick={() => choose(q.id, opt.value)}
            />
          ))}
        </div>

        {/* Tilbake */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={back}
            className="text-sm text-black/60 hover:text-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 rounded"
          >
            Tilbake
          </button>
        </div>
      </div>

      <div className="pb-10 flex justify-center">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border border-black/20 px-6 py-2 text-sm text-black hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
        >
          Til forside
        </button>
      </div>
    </main>
  );
}

function Card({
  label,
  description,
  onClick,
}: {
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-44 sm:w-52 aspect-[3/4]
                 rounded-2xl border border-black/20
                 flex items-start justify-center
                 hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
    >
      <div className="flex flex-col items-center w-full h-full pt-16 px-4 text-center">
        <span className="text-2xl font-medium text-black">{label}</span>

        {/* Kun nivå-kortene får description, siden bare de har det i data */}
        {description ? (
          <span className="mt-3 text-sm text-black/60 leading-snug">
            {description}
          </span>
        ) : null}
      </div>
    </button>
  );
}
