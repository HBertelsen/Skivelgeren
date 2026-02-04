export type Availability = "in_stock" | "out_of_stock" | "unknown";

export type OnlineOffer = {
  skiId: string; // må matche id i data/skis.ts
  shopName: string;
  url: string;
  priceNok?: number;
  availability?: Availability;
  note?: string;
};

export type StoreOffer = {
  skiId: string; // må matche id i data/skis.ts
  retailer: string;
  storeName: string;
  city: string;
  address?: string;
  mapUrl?: string;
  phone?: string;
  availability?: Availability;
  note?: string;
  stockUrl?: string;
};

export const ONLINE_OFFERS: OnlineOffer[] = [
  {
    skiId: "atomic-bent-100-25-26",
    shopName: "Nettbutikk A",
    url: "https://example.com/atomic-bent-100",
    priceNok: 6999,
    availability: "in_stock",
  },
  {
    skiId: "blizzard-rustler-10-25-26",
    shopName: "Nettbutikk B",
    url: "https://example.com/blizzard-rustler-10",
    availability: "unknown",
    note: "Sjekk lengde",
  },
];

export const STORE_OFFERS: StoreOffer[] = [
  {
    skiId: "atomic-bent-100-25-26",
    retailer: "Butikkjede X",
    storeName: "Butikk X – Stavanger",
    city: "Stavanger",
    address: "Eksempelgata 1",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Eksempelgata%201%20Stavanger",
    availability: "in_stock",
    note: "Kun enkelte lengder",
  },
  {
    skiId: "volkl-m6-mantra-25-26",
    retailer: "Butikkjede Y",
    storeName: "Butikk Y – Oslo",
    city: "Oslo",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Oslo",
    availability: "unknown",
    stockUrl: "https://example.com/lagerstatus/volkl-mantra-m6",
  },
];

export function availabilityLabel(a?: Availability) {
  if (a === "in_stock") return "På lager";
  if (a === "out_of_stock") return "Ikke på lager";
  return "Ukjent";
}
