"use client";

import { useRouter } from "next/navigation";

export default function FindPage() {
  const router = useRouter();

  function goToFrontpage() {
    router.push("/");
  }

  function chooseAlpin() {
    router.push("/survey/alpine");
  }

  function chooseLangrenn() {
    router.push("/survey/cross-country");
  }

  return (
    <main className="min-h-screen bg-white px-6 flex flex-col">
      <div className="mx-auto max-w-5xl flex-1 w-full">
        <div className="pt-12 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-black">
            Finn riktig ski
          </h1>
          <p className="mt-3 text-base text-black/70">
            Start med å velge type ski du er på jakt etter.
          </p>
        </div>

        <div className="mt-20 flex justify-center gap-8">
          <button
            type="button"
            onClick={chooseAlpin}
            className="relative w-56 sm:w-64 aspect-[3/4]
                       rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-black/40 focus:ring-offset-2"
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

          <button
            type="button"
            onClick={chooseLangrenn}
            className="relative w-56 sm:w-64 aspect-[3/4]
                       rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-black/40 focus:ring-offset-2"
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

      <div className="pb-10 flex justify-center">
        <button
          type="button"
          onClick={goToFrontpage}
          className="rounded-full border border-black/20 px-6 py-2 text-sm text-black hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
        >
          Til forside
        </button>
      </div>
    </main>
  );
}
