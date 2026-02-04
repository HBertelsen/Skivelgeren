import Link from "next/link";

export default function HomePage() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* IDENTITET */}
        <h1 className="mb-6 text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900">
          Skivelgeren <span className="text-gray-400">25/26</span>
        </h1>

        <p className="mb-16 text-base text-gray-600">
          Ski uten synsing.
        </p>

        {/* HANDLINGER */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Primær */}
          <Link
            href="/finn"
            className="inline-flex items-center justify-center rounded-full
                       bg-gray-900 px-10 py-4 text-base font-medium text-white
                       transition hover:bg-gray-800"
          >
            Finn riktig ski til deg
          </Link>

          {/* Sekundær */}
          <Link
            href="/katalog/2025-2026"
            className="inline-flex items-center justify-center rounded-full
                       bg-white px-10 py-4 text-base font-medium text-gray-900
                       ring-1 ring-black/15 transition hover:ring-black/30"
          >
            Bla i katalog
          </Link>
        </div>
      </div>
    </section>
  );
}
