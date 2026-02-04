export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replaceAll("–", "-")
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
    .replaceAll("--", "-");
}

export function skiSlug(brand: string, model: string, season: string) {
  return toSlug(`${brand}-${model}-${season}`);
}
