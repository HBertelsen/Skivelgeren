"use client";

import { useRouter } from "next/navigation";

export default function FinnPage() {
  const router = useRouter();

  function goToFrontpage() {
    router.push("/");
  }

  function chooseAlpin() {
    router.push("/sporreundersokelse/alpin");
  }

  function chooseLangrenn() {
    router.push("/sporreundersokelse/langrenn");
  }

  return (
    <main className="min-h-screen bg-white px-6 flex flex-col">
      <div className="mx-auto max-w-5xl flex-1 w-full">
        {/* Side-tittel – høyt oppe */}
        <div className="pt-12 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-black">
            Finn riktig ski
          </h1>
          <p className="mt-3 text-base text-black/70">
            Start med å velge type ski du er på jakt etter.
          </p>
        </div>

        {/* Kort – litt lenger ned */}
        <div className="mt-20 flex justify-center gap-8">
          {/* Alpin */}
          <button
            onClick={chooseAlpin}
            className="relative w-56 sm:w-64 aspect-[3/4]
                       rounded-2xl overflow-hidden group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/alpin.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
            <div className="relative z-10 flex items-start justify-center h-full pt-16">
              <span className="text-3xl font-medium text-white">Alpin</span>
            </div>
          </button>

          {/* Langrenn */}
          <button
            onClick={chooseLangrenn}
            className="relative w-56 sm:w-64 aspect-[3/4]
                       rounded-2xl overflow-hidden group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/langrenn.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
            <div className="relative z-10 flex items-start justify-center h-full pt-16">
              <span className="text-3xl font-medium text-white">Langrenn</span>
            </div>
          </button>
        </div>
      </div>

      {/* Nederste knapp */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={goToFrontpage}
          className="rounded-full border border-black/20 px-6 py-2 text-sm text-black hover:border-black transition"
        >
          Til forside
        </button>
      </div>
    </main>
  );
}
