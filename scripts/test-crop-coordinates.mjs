#!/usr/bin/env node
/**
 * Test script for å finne riktige crop-koordinater
 * Genererer flere varianter av samme ski for testing
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
const outDir = path.join(projectRoot, ".test-crops");
const tempDir = path.join(projectRoot, ".temp-pdf-test");
const magickPath = "C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe";

async function testCropCoordinates() {
  console.log("Genererer test-bilder fra side 23 og 24...\n");

  try {
    if (!existsSync(magickPath)) {
      throw new Error(`ImageMagick ikke funnet på ${magickPath}`);
    }

    if (existsSync(outDir)) {
      await rm(outDir, { recursive: true, force: true });
    }
    if (existsSync(tempDir)) {
      await rm(tempDir, { recursive: true, force: true });
    }

    await mkdir(tempDir, { recursive: true });
    await mkdir(outDir, { recursive: true });

    // Konverter PDF-sidene 23-24 til PNG
    console.log("Konverterer PDF sidene 23-24 til PNG...");
    const convertCmd = `"${magickPath}" -density 150 "${pdfPath}[22-23]" "${path.join(tempDir, "page.png")}"`;
    execSync(convertCmd, { stdio: "inherit" });
    console.log("✓ Konvertert\n");

    // Test ulike crop-områder
    const testCrops = [
      { name: "test1-left25", x: 0.05, y: 0.1, w: 0.35, h: 0.8 },
      { name: "test2-left30", x: 0.08, y: 0.1, w: 0.3, h: 0.8 },
      { name: "test3-left40", x: 0.12, y: 0.1, w: 0.35, h: 0.8 },
      { name: "test4-center", x: 0.25, y: 0.1, w: 0.5, h: 0.8 },
      { name: "test5-right60", x: 0.55, y: 0.1, w: 0.35, h: 0.8 },
      { name: "test6-right50", x: 0.45, y: 0.1, w: 0.4, h: 0.8 },
      { name: "test7-wider", x: 0.1, y: 0.05, w: 0.8, h: 0.9 },
      { name: "test8-tighter", x: 0.2, y: 0.15, w: 0.3, h: 0.7 },
    ];

    for (const crop of testCrops) {
      try {
        const pngFile = path.join(tempDir, "page-22.png");

        const image = sharp(pngFile);
        const metadata = await image.metadata();

        const cropX = Math.round(metadata.width * crop.x);
        const cropY = Math.round(metadata.height * crop.y);
        const cropW = Math.round(metadata.width * crop.w);
        const cropH = Math.round(metadata.height * crop.h);

        const filename = `${crop.name}.webp`;
        const filepath = path.join(outDir, filename);

        await sharp(pngFile)
          .extract({
            left: cropX,
            top: cropY,
            width: cropW,
            height: cropH,
          })
          .resize(300, 600, { fit: "contain" })
          .webp({ quality: 85 })
          .toFile(filepath);

        console.log(`✓ ${crop.name} (x=${crop.x}, y=${crop.y}, w=${crop.w}, h=${crop.h})`);
      } catch (err) {
        console.error(`✗ ${crop.name}: ${err.message}`);
      }
    }

    // Rydd opp
    await rm(tempDir, { recursive: true, force: true });

    console.log(`\nTest-bilder lagret i: ${outDir}`);
    console.log("\nÅpne bildene og fortell hvilken varianter som viser skiene riktig!");
  } catch (err) {
    console.error("Feil:", err.message);
    process.exit(1);
  }
}

testCropCoordinates();
