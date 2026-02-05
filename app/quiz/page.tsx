"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Discipline = "alpin" | "langrenn" | null;
type AlpineType = "topptur" | "bakkeski" | "frikjoring" | "parkski";
type NordicType = "felleski" | "klassiskski" | "skoyteski" | "fjellski";

const SESSION_KEY = "skivelgeren_quiz_v1";

export default function QuizPage() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<Discipline>(null);

  function reset() {
    setDiscipline(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  }

  function goAlpine(type: AlpineType) {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ discipline: "alpin", type })
      );
    } catch {}

    // ✅ direkte videre – ingen "perfekt"-steg
    router.push(`/survey/alpine?type=${type}`);
  }

  function goNordic(type: NordicType) {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ discipline: "langrenn", type })
      );
    } catch {}

    router.push(`/survey/cross-country?type=${type}`);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-5xl font-semibold tracking-tight">Finn riktig ski</h1>
        <p className="mt-3 text-black/60">
          Start med å velge type ski du er på jakt etter.
        </p>

        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          {!discipline && (
            <>
              <div className="text-lg font-semibold">Hva ser du etter?</div>

              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => setDiscipline("alpin")}
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-left hover:border-black/40 transition"
                >
                  Alpin
                </button>
                <button
                  onClick={() => setDiscipline("langrenn")}
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-left hover:border-black/40 transition"
                >
                  Langrenn
                </button>
              </div>
            </>
          )}

          {discipline === "alpin" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div className="text-lg font-semibold">Hvilken type alpinski?</div>
                <button
                  onClick={reset}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm hover:border-black/40 transition"
                >
                  Tilbake
                </button>
              </div>

              <div className="grid gap-3">
                <Opt label="Topptur" onClick={() => goAlpine("topptur")} />
                <Opt label="Bakkeski" onClick={() => goAlpine("bakkeski")} />
                <Opt label="Frikjøringsski" onClick={() => goAlpine("frikjoring")} />
                <Opt label="Parkski" onClick={() => goAlpine("parkski")} />
              </div>

              <p className="mt-5 text-xs text-black/45">
                Du blir sendt videre automatisk når du velger.
              </p>
            </>
          )}

          {discipline === "langrenn" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div className="text-lg font-semibold">Hvilken type langrennsski?</div>
                <button
                  onClick={reset}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm hover:border-black/40 transition"
                >
                  Tilbake
                </button>
              </div>

              <div className="grid gap-3">
                <Opt label="Felleski" onClick={() => goNordic("felleski")} />
                <Opt label="Klassiskski" onClick={() => goNordic("klassiskski")} />
                <Opt label="Skøyteski" onClick={() => goNordic("skoyteski")} />
                <Opt label="Fjellski" onClick={() => goNordic("skoyteski")} />
              </div>

              <p className="mt-5 text-xs text-black/45">
                Du blir sendt videre automatisk når du velger.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Opt({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-black/15 px-4 py-3 text-left hover:border-black/40 transition"
    >
      {label}
    </button>
  );
}
