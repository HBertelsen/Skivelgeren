import Link from "next/link";
import { notFound } from "next/navigation";
import { SKIS } from "../../../data/skis";
import { skiSlug } from "../../../lib/slug";
import { ONLINE_OFFERS, STORE_OFFERS, availabilityLabel } from "../../../data/shops";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function SkiPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);

  const ski =
    SKIS.find((s) => skiSlug(s.brand, s.model, s.season) === slug) ?? null;

  if (!ski) {
    notFound();
  }

  const online = ONLINE_OFFERS.filter((o) => o.skiId === ski.id);
  const stores = STORE_OFFERS.filter((o) => o.skiId === ski.id);

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {ski.brand} {ski.model}
        </h1>
        <div className="text-sm text-gray-600">
          Sesong {ski.season} • {ski.category}
        </div>
      </div>

      <div className="rounded-md border p-4 space-y-2">
        <div className="font-medium">Spesifikasjoner</div>
        <ul className="text-gray-700">
          <li>Midtbredde: {ski.waistMm} mm</li>
          <li>Radius: {ski.radiusM} m</li>
          <li>Anbefalt nivå: {ski.level}/5</li>
        </ul>
      </div>

      <div className="rounded-md border p-4 space-y-2">
        <div className="font-medium">Profil (0–10)</div>
        <ul className="text-gray-700">
          <li>Stabilitet: {ski.stability}</li>
          <li>Lekenhet: {ski.playful}</li>
          <li>Kantgrep: {ski.carvingGrip}</li>
          <li>Flyt i løssnø: {ski.floatPow}</li>
        </ul>
      </div>

      {/* ✅ KJØP HER */}
      <div className="rounded-md border p-4 space-y-4">
        <div className="font-medium text-lg">Kjøp her</div>

        <div className="space-y-2">
          <div className="font-medium">Nettbutikker</div>

          {online.length === 0 ? (
            <p className="text-sm text-gray-700">
              Ingen nettbutikker registrert ennå for denne skien.
            </p>
          ) : (
            <ul className="space-y-2">
              {online.map((o) => (
                <li key={o.url} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline"
                    >
                      {o.shopName}
                    </a>
                    <div className="text-sm text-gray-600">
                      {availabilityLabel(o.availability)}
                      {typeof o.priceNok === "number" ? ` • ${o.priceNok} kr` : ""}
                    </div>
                  </div>
                  {o.note && <div className="text-sm text-gray-700 mt-1">{o.note}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <div className="font-medium">Fysiske butikker</div>

          {stores.length === 0 ? (
            <p className="text-sm text-gray-700">
              Ingen fysiske butikker registrert ennå for denne skien.
            </p>
          ) : (
            <ul className="space-y-2">
              {stores.map((s, idx) => (
                <li key={`${s.retailer}-${s.storeName}-${idx}`} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {s.retailer} — {s.storeName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {s.city}
                        {s.address ? ` • ${s.address}` : ""}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {availabilityLabel(s.availability)}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    {s.mapUrl && (
                      <a href={s.mapUrl} target="_blank" rel="noreferrer" className="underline">
                        Åpne i kart
                      </a>
                    )}
                    {s.stockUrl && (
                      <a href={s.stockUrl} target="_blank" rel="noreferrer" className="underline">
                        Sjekk lagerstatus
                      </a>
                    )}
                    {s.phone && <span className="text-gray-700">Tlf: {s.phone}</span>}
                  </div>

                  {s.note && <div className="text-sm text-gray-700 mt-2">{s.note}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-gray-600">
          Lagerstatus er manuell/demo foreløpig. Senere kan vi koble dette mot feed/partner/affiliate.
        </p>
      </div>

      <div className="flex gap-3">
        <Link href={`/katalog/${ski.season}`} className="rounded-md border px-4 py-2">
          Tilbake til katalog
        </Link>
        <Link href="/quiz" className="rounded-md bg-black px-4 py-2 text-white">
          Ta quiz
        </Link>
      </div>
    </section>
  );
}
