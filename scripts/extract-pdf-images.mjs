#!/usr/bin/env node
/**
 * Ekstraerer bilder direkte fra Alpina PDF katalog med Ghostscript
 * Bruk: node scripts/extract-pdf-images.mjs
 */

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, rm } from "node:fs/promises";
import sharp from "sharp";
import { existsSync } from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const pdfPath = path.join(
  projectRoot,
  "docs",
  "Alpina_Catalogue_WINTER_25-26_spreads.pdf"
);
const outDir = path.join(projectRoot, "public", "images", "skis");
const tempDir = path.join(projectRoot, ".temp-pdf-extract");
const magickPath = "C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe";

// Mapping av sider til ski-modeller med crop-område
const modelConfig = [
  { model: "Pioneer 80E", page: 1, crop: { x: 0.05, y: 0.12, w: 0.28, h: 0.7 } },
  {
    model: "Discovery 68",
    page: 1,
    crop: { x: 0.5, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Discovery 68E",
    page: 2,
    crop: { x: 0.05, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Control 60",
    page: 2,
    crop: { x: 0.5, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Energy",
    page: 3,
    crop: { x: 0.05, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Control 60E",
    page: 3,
    crop: { x: 0.5, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Control 64E",
    page: 4,
    crop: { x: 0.05, y: 0.12, w: 0.28, h: 0.7 },
  },
  {
    model: "Energy JR",
    page: 4,
    crop: { x: 0.5, y: 0.12, w: 0.28, h: 0.7 },
  },
];

async function extractImages() {
  console.log("Ekstraerer bilder direkte fra Alpina PDF katalog...\n");

  try {
    // Sjekk om ImageMagick finnes
    if (!existsSync(magickPath)) {
      throw new Error(
        `ImageMagick ikke funnet på ${magickPath}. Sjekk installasjonen.`
      );
    }

    // Rydd temp-mappe hvis den finnes
    if (existsSync(tempDir)) {
      await rm(tempDir, { recursive: true, force: true });
    }

    await mkdir(tempDir, { recursive: true });
    await mkdir(outDir, { recursive: true });

    // Konverter PDF-sidene til PNG med ImageMagick + Ghostscript
    console.log("Konverterer PDF-sider til PNG bilder...");
    const convertCmd = `"${magickPath}" -density 300 -quality 95 "${pdfPath}" "${path.join(tempDir, "page.png")}"`;

    execSync(convertCmd, { stdio: "inherit" });
    console.log("✓ PDF konvertert til PNG-bilder\n");

    // Behandle hver modell
    console.log("Ekstraerer individuelle ski-modeller...\n");
    for (const config of modelConfig) {
      try {
        const pngFile = path.join(tempDir, `page-${config.page - 1}.png`);

        // Les og få metadata fra bildet
        const image = sharp(pngFile);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
          throw new Error(`Kunne ikke få dimensjoner fra ${pngFile}`);
        }

        // Beregn crop-dimensjoner basert på prosentandel
        const cropX = Math.round(metadata.width * config.crop.x);
        const cropY = Math.round(metadata.height * config.crop.y);
        const cropW = Math.round(metadata.width * config.crop.w);
        const cropH = Math.round(metadata.height * config.crop.h);

        // Lagre cropped og resized bilde som WebP
        const filename = `alpina-${config.model
          .toLowerCase()
          .replace(/\s+/g, "-")}-2025-2026.webp`;
        const filepath = path.join(outDir, filename);

        await sharp(pngFile)
          .extract({
            left: cropX,
            top: cropY,
            width: cropW,
            height: cropH,
          })
          .resize(300, 600, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .webp({ quality: 85 })
          .toFile(filepath);

        console.log(`  ✓ ${config.model} (side ${config.page})`);
      } catch (err) {
        console.error(
          `  ✗ Feil ved ${config.model} (side ${config.page}): ${err.message}`
        );
      }
    }

    // Rydd opp temp-filer
    console.log("\nRydder opp temp-filer...");
    await rm(tempDir, { recursive: true, force: true });

    console.log(
      "✓ Ferdig! Alle bilder ekstraert fra PDF og lagret i /public/images/skis/"
    );
  } catch (err) {
    console.error("Feil:", err.message);
    process.exit(1);
  }
}

extractImages();
