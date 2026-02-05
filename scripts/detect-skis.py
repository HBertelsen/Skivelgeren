#!/usr/bin/env python3
"""
Automatisk ski-gjenkjenning og bildeekstraksjon fra PDF
Bruker OpenCV for å detektere ski-former automatisk
"""

import cv2
import numpy as np
from pathlib import Path
import os
from PIL import Image
import subprocess
import shutil

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
PDF_PATH = PROJECT_ROOT / "docs" / "Alpina_Catalogue_WINTER_25-26_spreads.pdf"
OUT_DIR = PROJECT_ROOT / "public" / "images" / "skis"
TEMP_DIR = PROJECT_ROOT / ".temp-ski-detect"
MAGICK_PATH = r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"

# Ski-modeller i rekkefølge
SKI_MODELS = [
    "Pioneer 80E",
    "Discovery 68",
    "Discovery 68E",
    "Control 60",
    "Energy",
    "Control 60E",
    "Control 64E",
    "Energy JR",
]

def convert_pdf_to_png():
    """Konverter PDF sidene 23-24 til PNG"""
    print("Konverterer PDF sidene 23-24 til PNG bilder...")
    
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    
    # ImageMagick: convert pages 23-24 (index 22-23)
    cmd = [MAGICK_PATH, "-density", "200", f"{PDF_PATH}[22-23]", str(TEMP_DIR / "page.png")]
    subprocess.run(cmd, check=False)
    print("✓ PDF konvertert\n")

def detect_skis_in_image(image_path):
    """
    Detekterer ski-former i bildet ved å søke etter lange, horisontale objekter
    """
    img = cv2.imread(str(image_path))
    if img is None:
        print(f"Kunne ikke lese bilde: {image_path}")
        return [], img
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Threshold for mørkere områder (ski har mørkere striper/design)
    _, thresh = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY_INV)
    
    # Morphological operations - prøv to horisontale closings for å slå sammen
    # brutte/skillede deler av en ski (kort + langt kernel)
    kernel_short = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 3))
    kernel_long = cv2.getStructuringElement(cv2.MORPH_RECT, (200, 5))
    closed_short = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel_short)
    closed_long = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel_long)

    # Kombiner maskene og litt dilatation for å koble sammen strekk
    combined = cv2.bitwise_or(closed_short, closed_long)
    combined = cv2.dilate(combined, cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3)), iterations=1)

    # Finn konturer i kombinert maske
    contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    skis = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = cv2.contourArea(contour)
        aspect_ratio = w / max(h, 1)  # HORISONTALT: bredde/høyde

        # Kriterier for HORISONTALE ski:
        # - Aspekt ratio: minst 3.0 (skiene er lange)
        # - Høyde: 15-220px (tolerant for ulike oppløsninger)
        # - Bredde: minst 180px
        # Vi filtrerer røde overskrifter senere når vi har cropet
        if (aspect_ratio >= 3.0 and
            h >= 15 and h <= 220 and
            w >= 180):
            skis.append((x, y, w, h))
    
    # Sorter på x-posisjon (fra venstre til høyre)
    skis.sort(key=lambda s: s[0])
    
    return skis, img

def extract_and_save_skis():
    """Ekstraher og lagre ski-bilder"""
    print("Detekterer ski-former...")
    
    # Konverter PDF
    convert_pdf_to_png()
    
    # Finn alle PNG-filer
    png_files = sorted(TEMP_DIR.glob("page-*.png"))
    
    if not png_files:
        print("❌ Ingen PNG-filer funnet fra PDF-konvertering")
        return
    
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    detected_count = 0
    
    # Behandle hver side
    for png_file in png_files:
        print(f"\nAnalyserer {png_file.name}...")
        
        skis, img = detect_skis_in_image(png_file)
        
        if not skis:
            print("  ⚠ Ingen ski detektert på denne siden")
            continue
        
        print(f"  Fant {len(skis)} ski-kandidater")
        
        # Lagre hver detektert ski
        for idx, (x, y, w, h) in enumerate(skis):
            # Expand området for å få med hele skien (prosent-basert)
            pad_w = int(w * 0.12) + 10
            pad_h = int(h * 0.25) + 10
            expand_x = max(0, x - pad_w)
            expand_w = min(img.shape[1] - expand_x, w + pad_w * 2)
            expand_y = max(0, y - pad_h)
            expand_h = min(img.shape[0] - expand_y, h + pad_h * 2)

            # Crop fra originalbilde
            crop_img = img[expand_y:expand_y + expand_h, expand_x:expand_x + expand_w]

            # Filtrer røde overskrifter: sjekk andel røde piksler i crop
            hsv = cv2.cvtColor(crop_img, cv2.COLOR_BGR2HSV)
            h_chan = hsv[:, :, 0]
            s_chan = hsv[:, :, 1]
            v_chan = hsv[:, :, 2]
            # Rødt: hue < 10 eller hue > 170, med rimelig metning og lyshet
            red_mask1 = (h_chan < 10) & (s_chan > 80) & (v_chan > 50)
            red_mask2 = (h_chan > 170) & (s_chan > 80) & (v_chan > 50)
            red_mask = red_mask1 | red_mask2
            red_prop = np.count_nonzero(red_mask) / (crop_img.shape[0] * crop_img.shape[1] + 1e-9)

            if red_prop > 0.22:
                # Trolig bare en rød overskrift - hopp over
                print(f"  Skipper kandidat pga. høy andel rødt: {red_prop:.2f}")
                continue

            # Lagr som WebP
            if detected_count < len(SKI_MODELS):
                model = SKI_MODELS[detected_count]
                filename = f"alpina-{model.lower().replace(' ', '-')}-2025-2026.webp"
                output_path = OUT_DIR / filename

                # Konverter BGR til RGB
                crop_img_rgb = cv2.cvtColor(crop_img, cv2.COLOR_BGR2RGB)
                pil_img = Image.fromarray(crop_img_rgb)

                # ROTÉR 90 grader (horisontale ski skal vises vertikalt)
                pil_img = pil_img.rotate(90, expand=True)

                # Resize til standard høyde (nå høyde fordi vi roterte)
                ratio = 600 / pil_img.height if pil_img.height > 0 else 1
                new_width = int(pil_img.width * ratio)
                pil_img = pil_img.resize((new_width, 600), Image.Resampling.LANCZOS)

                # Legg på hvit padding rundt hele bildet
                pad_px = 20
                padded_w = pil_img.width + pad_px * 2
                padded_h = pil_img.height + pad_px * 2
                final_img = Image.new('RGB', (padded_w, padded_h), (255, 255, 255))
                final_img.paste(pil_img, (pad_px, pad_px))

                final_img.save(output_path, 'WEBP', quality=85)

                print(f"  ✓ {model} (red_prop={red_prop:.2f})")
                detected_count += 1
            
            if detected_count >= len(SKI_MODELS):
                break
        
        if detected_count >= len(SKI_MODELS):
            break
    
    # Rydd opp
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    
    print(f"\n✓ Ferdig! {detected_count} ski-bilder ekstraert og lagret i {OUT_DIR}")

if __name__ == "__main__":
    extract_and_save_skis()
