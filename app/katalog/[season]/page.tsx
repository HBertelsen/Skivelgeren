"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SKIS } from "../../../data/skis";
import { skiSlug } from "../../../lib/slug";

const norm = (x: string) => x.replaceAll("–", "-").trim();

function brandKey(brand: string) {
  return brand
    .toLowerCase()
    .replaceAll("ö", "o")
    .replaceAll("ø", "o")
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ü", "u")
    .replaceAll("é", "e")
    .replaceAll(" ", "-")
    .replaceAll(".", "")
    .trim();
}

function brandLogoSrc(brand: string) {
  return `/images/brands/${brandKey(brand)}.png`;
}

export default function CatalogSeasonPage() {
  const params = useParams<{ season: string }>();
  const season = typeof params?.season === "string" ? params.season : "";
  const seasonShort = season.replace("-", "/");

  const seasonNorm = norm(season);
  const skis = useMemo(
    () => SKIS.filter((s) => norm(s.season) === seasonNorm),
    [seasonNorm]
  );

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const s of skis) set.add(s.brand);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [skis]);

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(
    () => new Set()
  );

  const filteredSkis = useMemo(() => {
    if (selectedBrands.size === 0) return skis;
    return skis.filter((s) => selectedBrands.has(s.brand));
  }, [skis, selectedBrands]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* HEADER-RAD */}
        <div className="relative mb-16 flex items-center justify-center">
          {/* TIL FORSIDE – HELT TIL VENSTRE */}
          <Link
            href="/"
            aria-label="Til forsiden"
            title="Til forsiden"
            className="absolute left-0 inline-flex h-12 w-12 items-center justify-center
                       rounded-full bg-white ring-1 ring-black/10 transition hover:ring-black/25"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v7H4a1 1 0 0 1-1-1v-10.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* SENTRERT TITTEL + MERKER */}
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Alle ski <span className="text-gray-400">{seasonShort}</span>
            </h1>

            {brands.length > 0 && (
              <div className="overflow-x-auto">
                <div className="flex items-center gap-4 py-2 px-2">
                  {brands.map((brand) => {
                    const selected = selectedBrands.has(brand);

                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={[
                          "shrink-0 rounded-full bg-white transition-all",
                          "flex items-center justify-center",
                          "h-14 w-14",
                          selected
                            ? "ring-2 ring-black/40 shadow-md"
                            : "ring-1 ring-black/10 hover:ring-black/25",
                        ].join(" ")}
                        aria-pressed={selected}
                        aria-label={`Filtrer på ${brand}`}
                        title={brand}
                      >
                        <img
                          src={brandLogoSrc(brand)}
                          alt={brand}
                          className={[
                            "h-6 w-auto transition-opacity",
                            selected ? "opacity-100" : "opacity-70",
                          ].join(" ")}
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KATALOG */}
        {skis.length === 0 ? (
          <p className="text-gray-600">Ingen ski funnet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {filteredSkis.map((ski) => {
              const slug = skiSlug(ski.brand, ski.model, ski.season);

              return (
                <li key={ski.id}>
                  <Link href={`/ski/${slug}`} className="group block h-full">
                    <article className="h-full rounded-[32px] bg-white ring-1 ring-black/5 shadow-md transition hover:shadow-xl">
                      <div className="relative aspect-[1/3] w-full overflow-hidden rounded-[32px] bg-white flex items-start justify-center pt-6">
                        <img
                          src={ski.image}
                          alt={`${ski.brand} ${ski.model}`}
                          className="h-full w-full object-contain px-8 transition-transform duration-300 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
                      </div>

                      <div className="px-6 py-6">
                        <h2 className="text-lg font-medium text-gray-900 text-center">
                          {ski.brand} {ski.model}
                        </h2>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
