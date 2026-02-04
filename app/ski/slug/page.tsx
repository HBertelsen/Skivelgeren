import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default function SkiPage({ params }: Props) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Skimodell</h1>
      <p className="text-gray-700">
        Slug: <span className="font-mono">{params.slug}</span>
      </p>

      <div className="rounded-md border p-4">
        <p className="font-medium">Her kommer:</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Spesifikasjoner</li>
          <li>Hvem den passer for</li>
          <li>Kjøpslenker (nettbutikk + fysisk)</li>
          <li>Alternativer</li>
        </ul>
      </div>

      <Link
        href="/katalog/2025-2026"
        className="inline-block rounded-md border px-4 py-2"
      >
        Tilbake til katalog
      </Link>
    </section>
  );
}
