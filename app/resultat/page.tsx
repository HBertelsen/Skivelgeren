"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "skivelgeren_alpine_answers_session";
const LS_KEY = "skivelgeren_alpine_answers_v1";

type AlpineAnswers = {
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

export default function ResultatPage() {
  const [answers, setAnswers] = useState<AlpineAnswers | null>(null);

  useEffect(() => {
    try {
      const raw =
        sessionStorage.getItem(SESSION_KEY) ??
        localStorage.getItem(LS_KEY);

      setAnswers(raw ? JSON.parse(raw) : null);
    } catch {
      setAnswers(null);
    }
  }, []);

  if (!answers) {
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
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">
            Dine svar
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Disse brukes til å finne skiene som passer deg best.
          </p>

          <div className="mt-6 grid gap-3">
            <Row label="Design" value={answers.design} />
            <Row label="Nivå" value={answers.skill} />
            <Row label="Terreng" value={answers.terrain} />
            <Row label="Fart" value={answers.speed} />
            <Row label="Svinger" value={answers.turns} />
            <Row label="Navn" value={answers.about?.name} />
            <Row label="Alder" value={answers.about?.age} />
            <Row label="Høyde (cm)" value={answers.about?.heightCm} />
            <Row label="Vekt (kg)" value={answers.about?.weightKg} />
          </div>

          {/* Midlertidig debug – fjernes når ski-matching er klar */}
          <pre className="mt-6 rounded-xl border border-black/10 bg-black/[0.03] p-4 text-xs overflow-auto">
{JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between rounded-xl border border-black/10 px-4 py-3">
      <span className="text-sm text-black/60">{label}</span>
      <span className="text-sm font-medium">
        {value ?? "—"}
      </span>
    </div>
  );
}
