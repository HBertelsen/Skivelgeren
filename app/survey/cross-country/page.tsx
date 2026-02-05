import Link from "next/link";

export default function CrossCountryComingSoonPage() {
  return (
    <main className="min-h-screen bg-white px-6 flex flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Langrenn kommer snart
        </h1>
        <p className="text-base text-black/70">
          Vi jobber med spørreundersøkelsen og anbefalinger for langrennski.
          Sjekk gjerne vår alpinguide i mellomtiden.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/survey/alpine"
            className="rounded-full bg-gray-900 px-6 py-3 text-base font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          >
            Finn alpinski
          </Link>
          <Link
            href="/"
            className="rounded-full border border-black/20 px-6 py-3 text-sm text-black hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
