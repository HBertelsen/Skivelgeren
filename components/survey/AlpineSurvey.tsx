"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALPINE_QUESTIONS,
  AlpineAnswers,
  AlpineQuestion,
} from "../../data/survey-alpine";

const LS_KEY = "skivelgeren_alpine_answers_v1";

// Starter uten forhåndsvalg
const EMPTY_ALPINE_ANSWERS: AlpineAnswers = {
  // @ts-expect-error – fylles etter hvert, men starter tomt for UX
  design: undefined,
  // @ts-expect-error
  skill: undefined,
  // @ts-expect-error
  terrain: undefined,
  // @ts-expect-error
  speed: undefined,
  // @ts-expect-error
  turns: undefined,
  about: {},
};

function clampNum(x: number, min?: number, max?: number) {
  if (Number.isNaN(x)) return undefined;
  if (min != null && x < min) return min;
  if (max != null && x > max) return max;
  return x;
}

export default function AlpineSurvey() {
  const router = useRouter();

  const questions = useMemo(() => ALPINE_QUESTIONS, []);
  const total = questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AlpineAnswers>(EMPTY_ALPINE_ANSWERS);

  // ✅ Draft-strings for inputfeltene (så vi kan skrive fritt uten clamping)
  const [aboutDraft, setAboutDraft] = useState<Record<string, string>>({});

  // ✅ Nullstill hver gang du kommer inn i surveyen (ingen forhåndsmarkering)
  useEffect(() => {
    setStep(0);
    setAnswers(EMPTY_ALPINE_ANSWERS);
    setAboutDraft({});
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }, []);

  // ✅ lagre underveis (valgfritt)
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  const q = questions[step] as AlpineQuestion;

  function goBack() {
    if (step <= 0) {
      router.back();
      return;
    }
    setStep((s) => s - 1);
  }

  function finish(nextAnswers?: AlpineAnswers) {
    const payload = nextAnswers ?? answers;
    try {
      sessionStorage.setItem(
        "skivelgeren_alpine_answers_session",
        JSON.stringify(payload)
      );
    } catch {}
    router.push("/resultat?type=alpin");
  }

  function goNext() {
    if (step >= total - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }

  const selectedValue =
    q.type === "single"
      ? ((answers as any)[q.id] as string | undefined)
      : undefined;

  const showNextButton = q.type === "about";

  return (
    <main className="min-h-screen bg-white px-6 flex flex-col">
      <div className="mx-auto max-w-5xl flex-1 w-full">
        {/* Tittel / progresjon */}
        <div className="pt-12 text-center">
          <div className="text-sm text-black/60">
            {step + 1} / {total}
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
            {q.title}
          </h1>

          {q.description ? (
            <p className="mt-3 text-base text-black/70">{q.description}</p>
          ) : (
            <p className="mt-3 text-base text-black/70">&nbsp;</p>
          )}
        </div>

        {/* Innhold */}
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-5xl">
            {q.type === "single" ? (
              <div className="flex justify-center gap-6 flex-wrap">
                {q.options.map((opt) => {
                  const isSelected = selectedValue === opt.value;

                  return (
                    <SelectionCard
                      key={opt.value}
                      label={opt.label}
                      selected={isSelected}
                      onClick={() => {
                        const nextAnswers = {
                          ...answers,
                          [q.id]: opt.value,
                        } as AlpineAnswers;

                        setAnswers(nextAnswers);

                        // ✅ Auto-advance
                        const isLast = step >= total - 1;
                        if (isLast) {
                          setTimeout(() => finish(nextAnswers), 0);
                        } else {
                          setTimeout(() => setStep((s) => s + 1), 0);
                        }
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-xl grid gap-4">
                {q.fields.map((f) => {
                  const key = f.key as string;
                  const isText = key === "name";
                  const min = (f as any).min as number | undefined;
                  const max = (f as any).max as number | undefined;

                  // ✅ Vis draft hvis vi har det, ellers vis lagret verdi
                  const stored = (answers.about as any)[key];
                  const value =
                    aboutDraft[key] ??
                    (stored == null ? "" : String(stored));

                  return (
                    <div key={key} className="grid gap-2">
                      <label className="text-sm font-medium text-black">
                        {f.label}
                      </label>

                      <input
                        value={value}
                        onChange={(e) => {
                          // ✅ La brukeren skrive fritt uten clamping
                          setAboutDraft((d) => ({ ...d, [key]: e.target.value }));
                        }}
                        onBlur={() => {
                          // ✅ Clamp først når brukeren er ferdig med feltet
                          const raw = (aboutDraft[key] ?? "").trim();

                          if (isText) {
                            const nextVal = raw ? raw : undefined;

                            setAnswers((prev) => ({
                              ...prev,
                              about: { ...prev.about, [key]: nextVal },
                            }));

                            // synk draft til trimmet tekst (eller tomt)
                            setAboutDraft((d) => ({
                              ...d,
                              [key]: nextVal ?? "",
                            }));
                            return;
                          }

                          if (raw === "") {
                            // tomt -> undefined
                            setAnswers((prev) => ({
                              ...prev,
                              about: { ...prev.about, [key]: undefined },
                            }));
                            setAboutDraft((d) => ({ ...d, [key]: "" }));
                            return;
                          }

                          const n = Number(raw.replace(",", "."));
                          const clamped = clampNum(n, min, max);

                          setAnswers((prev) => ({
                            ...prev,
                            about: { ...prev.about, [key]: clamped },
                          }));

                          // ✅ Oppdater feltet til clamped verdi (uten “hopping” mens man skriver)
                          setAboutDraft((d) => ({
                            ...d,
                            [key]: clamped == null ? "" : String(clamped),
                          }));
                        }}
                        inputMode={isText ? "text" : "numeric"}
                        className="rounded-2xl border border-black/20 px-5 py-4 text-black outline-none focus:border-black transition"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Kontroller under */}
        <div className="mt-14 flex justify-center gap-6">
          <button
            onClick={goBack}
            className="text-sm text-black/60 hover:text-black transition"
          >
            Tilbake
          </button>

          {showNextButton && (
            <button
              onClick={goNext}
              className="rounded-full px-6 py-2 text-sm transition border border-black/20 text-black hover:border-black"
            >
              {step === total - 1 ? "Se resultater" : "Neste"}
            </button>
          )}
        </div>
      </div>

      {/* Til forside */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-black/20 px-6 py-2 text-sm text-black hover:border-black transition"
        >
          Til forside
        </button>
      </div>
    </main>
  );
}

function SelectionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative w-44 sm:w-52 aspect-[3/4] rounded-2xl",
        "border transition",
        selected ? "border-2 border-black" : "border-black/20 hover:border-black",
        "flex items-start justify-center",
      ].join(" ")}
    >
      <div className="flex items-start justify-center w-full h-full pt-16">
        <span className="text-2xl font-medium text-black">{label}</span>
      </div>
    </button>
  );
}
