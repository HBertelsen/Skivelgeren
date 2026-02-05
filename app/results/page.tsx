"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SKIS, type SkiModel } from "@/data/skis";
import {
  recommendFromSurvey,
  scoreToMatchPercent,
  type AlpineAnswers,
  type QuizV1,
  type RankedSki,
} from "@/lib/recommend";
import { CURRENT_SEASON } from "@/data/constants";

const QUIZ_KEY = "skivelgeren_quiz_v1";
const SESSION_KEY = "skivelgeren_alpine_answers_session";
const LS_KEY = "skivelgeren_alpine_answers_v1";

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AlpineAnswers | null>(null);
  const [quiz, setQuiz] = useState<QuizV1 | null>(null);

  useEffect(() => {
    try {
      const raw =
        sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LS_KEY);
      setAnswers(raw ? JSON.parse(raw) : null);
    } catch {
      setAnswers(null);
    }
    try {
      const rawQuiz = sessionStorage.getItem(QUIZ_KEY);
      setQuiz(rawQuiz ? JSON.parse(rawQuiz) : null);
    } catch {
      setQuiz(null);
    }
  }, []);

  const directSki = useMemo(() => {
    if (!quiz?.directSkiId) return null;
    return SKIS.find((s) => s.id === quiz.directSkiId) ?? null;
  }, [quiz]);

  const { rankedWithScores, topMatchPercent } = useMemo(() => {
    if (directSki) {
      const single: RankedSki[] = [{ ski: directSki, score: 100 }];
      return { rankedWithScores: single, topMatchPercent: 100 };
    }
    const { ranked } = recommendFromSurvey(answers, quiz, CURRENT_SEASON);
    if (ranked.length === 0) return { rankedWithScores: [], topMatchPercent: 0 };
    const topScore = ranked[0].score;
    const topMatchPercent = scoreToMatchPercent(topScore, ranked);
    return { rankedWithScores: ranked, topMatchPercent };
  }, [answers, quiz, directSki]);

  const top = rankedWithScores[0]?.ski ?? null;
  const alternatives = rankedWithScores.slice(1, 6);

  if (!answers && !quiz) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <p className="text-sm text-black/70">
            Fant ingen svar. Gå tilbake og fullfør spørreundersøkelsen.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-8 py-16 sm:py-20 space-y-20">
        {/* Toppvalg – én rute med usynlig ramme */}
        <section className="rounded-2xl border border-transparent p-8 sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight">Toppvalg</h1>
          <p className="mt-3 text-base text-black/60 leading-relaxed">
            Den skien som matcher best med svarene dine.
          </p>

          {!top ? (
            <p className="mt-10 text-sm text-black/70 leading-relaxed">
              Fant ingen tydelig match ennå.
            </p>
          ) : (
            <div className="mt-10 flex gap-8">
              <div className="w-36 h-52 shrink-0 flex items-center justify-center rounded-xl bg-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={top.image}
                  alt={`${top.brand} ${top.model}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-black/10 px-3 py-1 text-sm font-medium text-black">
                    {topMatchPercent}% match
                  </span>
                  {quiz?.directSkiId && (
                    <span className="text-sm text-black/50">Svindal-modus</span>
                  )}
                </div>
                <div className="mt-3 text-sm text-black/60">{top.brand}</div>
                <div className="text-xl font-semibold tracking-tight">{top.model}</div>
                <div className="mt-2 text-sm text-black/70 leading-relaxed">
                  {prettyCategory(top.category)} · {top.waistMm} mm · R
                  {top.radiusM} m · Nivå {top.level}/5
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Alternativer – uten rammer */}
        {alternatives.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Flere forslag
            </h2>
            <p className="mt-3 text-base text-black/60 leading-relaxed">
              Andre gode matcher, sortert etter hvor godt de passer.
            </p>
            <ul className="mt-10 space-y-6">
              {alternatives.map(({ ski, score }) => {
                const matchPercent = scoreToMatchPercent(
                  score,
                  rankedWithScores
                );
                return (
                  <li key={ski.id}>
                    <Link
                      href={`/ski/${ski.id}`}
                      className="flex items-center gap-6 py-4 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-lg"
                    >
                      <div className="w-24 h-36 shrink-0 flex items-center justify-center rounded-lg bg-white overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ski.image}
                          alt={`${ski.brand} ${ski.model}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-black">
                          {ski.brand} {ski.model}
                        </div>
                        <div className="mt-0.5 text-sm text-black/60 leading-relaxed">
                          {ski.waistMm} mm · R{ski.radiusM} m
                        </div>
                      </div>
                      <span
                        className="shrink-0 text-base font-medium text-black/80"
                        aria-label={`${matchPercent} prosent match`}
                      >
                        {matchPercent}%
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Bunn: skriv ut + til forsiden (skjules ved utskrift) */}
        <div className="pb-16 flex flex-col items-center gap-6 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-black/20 px-6 py-3 text-sm text-black hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Skriv ut / Lagre som PDF
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full border border-black/20 px-6 py-2.5 text-sm text-black hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Til forsiden
          </button>
        </div>
      </div>
    </main>
  );
}

function prettyCategory(c: SkiModel["category"]) {
  if (c === "piste") return "Piste";
  if (c === "all-mountain") return "All-mountain";
  return "Freeride";
}
