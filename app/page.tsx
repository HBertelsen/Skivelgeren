import Link from "next/link";
import { CURRENT_SEASON } from "@/data/constants";

const [y1, y2] = CURRENT_SEASON.split("-");
const seasonShort = `${y1.slice(-2)}/${y2.slice(-2)}`;

export default function HomePage() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="mb-6 text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900">
          Skivelgeren <span className="text-gray-400">{seasonShort}</span>
        </h1>

        <p className="mb-16 text-base text-gray-600">
          Ski uten synsing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/find"
            className="inline-flex items-center justify-center rounded-full
                       bg-gray-900 px-10 py-4 text-base font-medium text-white
                       transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          >
            Finn riktig ski til deg
          </Link>

          <Link
            href={`/catalog/${CURRENT_SEASON}`}
            className="inline-flex items-center justify-center rounded-full
                       bg-white px-10 py-4 text-base font-medium text-gray-900
                       ring-1 ring-black/15 transition hover:ring-black/30 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Bla i katalog
          </Link>
        </div>
      </div>
    </section>
  );
}
