#!/usr/bin/env python3
"""
Debug script for å visualisere hva som detekteres
"""

import cv2
import numpy as np
from pathlib import Path
import subprocess
import shutil

PROJECT_ROOT = Path(__file__).parent.parent
PDF_PATH = PROJECT_ROOT / "docs" / "Alpina_Catalogue_WINTER_25-26_spreads.pdf"
TEMP_DIR = PROJECT_ROOT / ".temp-ski-detect"
MAGICK_PATH = r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"

def convert_pdf():
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    
    cmd = [MAGICK_PATH, "-density", "200", f"{PDF_PATH}[22-23]", str(TEMP_DIR / "page.png")]
    subprocess.run(cmd, check=False)

def analyze_image(image_path):
    """Analyser bildet for å forstå strukturen"""
    img = cv2.imread(str(image_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    print(f"\n{'='*60}")
    print(f"Analyserer: {image_path.name}")
    print(f"Bildestørrelse: {img.shape[1]}x{img.shape[0]}")
    print(f"{'='*60}")
    
    # Statistikk om gråtoner
    print(f"\nGråtone-statistikk:")
    print(f"  Min: {gray.min()}, Max: {gray.max()}, Mean: {gray.mean():.1f}")
    
    # Test med lavere threshold på sentrale områder (hvor skiene skal være)
    # Skiene er vanligvis i midten av siden
    h, w = gray.shape
    center_left = int(w * 0.1)
    center_right = int(w * 0.9)
    top = int(h * 0.05)
    bottom = int(h * 0.95)
    
    roi = gray[top:bottom, center_left:center_right]
    
    print(f"\nSentral område (ROI) fra x={center_left} til x={center_right}:")
    print(f"  Min: {roi.min()}, Max: {roi.max()}, Mean: {roi.mean():.1f}")
    
    # Test ulike thresholds på hele bildet
    for threshold_val in [100, 120, 140, 160]:
        _, thresh = cv2.threshold(gray, threshold_val, 255, cv2.THRESH_BINARY_INV)
        
        # Kernel for å jobbe med lange former
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 40))
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(processed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        print(f"\nThreshold {threshold_val} + morphology:")
        print(f"  Fant {len(contours)} konturer")
        
        valid = []
        for contour in contours:
            x, y, w_c, h_c = cv2.boundingRect(contour)
            aspect = h_c / max(w_c, 1)
            area = cv2.contourArea(contour)
            
            # Ski-like (minst 4:1 ratio, rimelig størrelse)
            if w_c > 8 and h_c > 200 and aspect > 4 and area > 500:
                valid.append((x, y, w_c, h_c, aspect, area))
        
        print(f"  Gyldig ski-kandidater (aspect > 4): {len(valid)}")
        for i, (x, y, w_c, h_c, aspect, area) in enumerate(sorted(valid, key=lambda v: v[0])[:5]):
            print(f"    {i+1}. pos({x},{y}) size({w_c}x{h_c}) aspect({aspect:.1f}) area({area:.0f})")

if __name__ == "__main__":
    print("Konverterer PDF...")
    convert_pdf()
    
    png_files = sorted(TEMP_DIR.glob("page-*.png"))
    for png_file in png_files:
        analyze_image(png_file)
