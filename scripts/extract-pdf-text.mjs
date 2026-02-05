#!/usr/bin/env node
/**
 * Trekker ut ren tekst fra en PDF og skriver til en .txt-fil.
 * Bruk: node scripts/extract-pdf-text.mjs [pdf-fil] [utfil]
 *
 * Standard (uten argumenter):
 *   Leser: docs/Alpina_Catalogue_WINTER_25-26_spreads.pdf
 *   Skriver: docs/Alpina_Catalogue_WINTER_25-26_spreads-extracted.txt
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const defaultPdf = path.join(
  projectRoot,
  "docs",
  "Alpina_Catalogue_WINTER_25-26_spreads.pdf"
);
const pdfPath = process.argv[2] || defaultPdf;
const outPath =
  process.argv[3] ||
  path.join(
    projectRoot,
    "docs",
    path.basename(pdfPath, ".pdf") + "-extracted.txt"
  );

async function main() {
  console.log("Leser PDF:", pdfPath);
  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  await writeFile(outPath, result.text, "utf8");
  console.log("Uttekst skrevet til:", outPath);
  console.log("Tegn totalt:", result.text.length);
}

main().catch((err) => {
  console.error("Feil:", err.message);
  process.exit(1);
});
