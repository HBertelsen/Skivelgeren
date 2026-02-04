"use client";

import { useRouter } from "next/navigation";

export default function AlpineTypePage() {
  const router = useRouter();

  function choose(type: "bakke" | "park" | "topptur" | "allmountain") {
    try {
      sessionStorage.setItem(
        "skivelgeren_quiz_v1",
        JSON.stringify({ discipline: "alpin", type })
      );
    } catch {}

    router.push(`/sporreundersokelse/alpin/sporsmal?type=${type}`);
  }

  return (
    <main className="min-h-screen bg-white px-6 flex flex-col">
      <div className="mx-auto max-w-5xl flex-1 w-full">
        {/* Tittel */}
        <div className="pt-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black">
            Hvilken type alpinski?
          </h1>
          <p className="mt-3 text-base text-black/70">
            Velg det som passer best.
          </p>
        </div>

        {/* Kort – litt lenger ned */}
        <div className="mt-20 flex justify-center gap-6 flex-wrap">
          <Card label="Bakke" onClick={() => choose("bakke")} />
          <Card label="Park" onClick={() => choose("park")} />
          <Card label="Topptur" onClick={() => choose("topptur")} />
          <Card label="Allmountain" onClick={() => choose("allmountain")} />
        </div>

        {/* Tilbake – mer luft */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-black/60 hover:text-black transition"
          >
            Tilbake
          </button>
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

function Card({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-44 sm:w-52 aspect-[3/4]
                 rounded-2xl border border-black/20
                 flex items-start justify-center
                 hover:border-black transition"
    >
      <div className="flex items-start justify-center w-full h-full pt-16">
        <span className="text-2xl font-medium text-black">{label}</span>
      </div>
    </button>
  );
}
