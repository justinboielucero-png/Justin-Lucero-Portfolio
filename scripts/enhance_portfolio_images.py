#!/usr/bin/env python3
"""Create non-lossy display copies of Justin's source portfolio photos.

The 2026 originals are low-bitrate WebP. This script does not invent details or
change the identity/content of the photos: it upscales gently and exports PNG.
Source WebP files are preserved byte-for-byte for provenance and reversibility.
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import re

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "assets" / "portfolio"
CONFIG = {
    "pc-build-dark": (1.08, 1.10, 1.05),
    "pc-build-rgb": (1.04, 1.09, 1.03),
    "blender-scene": (1.02, 1.04, 1.01),
    "jru-pubmat": (1.01, 1.045, 1.01),
}
TARGET_SCALE = 4

def enhance(source: Path, destination: Path, adjustments) -> tuple[int, int]:
    with Image.open(source) as source_image:
        image = source_image.convert("RGB")
    brightness, contrast, saturation = adjustments
    if brightness != 1:
        image = ImageEnhance.Brightness(image).enhance(brightness)
    if contrast != 1:
        image = ImageEnhance.Contrast(image).enhance(contrast)
    if saturation != 1:
        image = ImageEnhance.Color(image).enhance(saturation)
    # Multi-pass resize avoids rough pixel stepping while honoring composition.
    width, height = image.size
    image = image.resize((width * 2, height * 2), Image.Resampling.LANCZOS)
    image = image.resize((width * TARGET_SCALE, height * TARGET_SCALE), Image.Resampling.LANCZOS)
    # Conservative luminance edge sharpening rather than AI-invented details.
    image = image.filter(ImageFilter.UnsharpMask(radius=1.05, percent=95, threshold=3))
    destination.parent.mkdir(parents=True, exist_ok=True)
    # 0 means NO DEFLATE compression. PNG remains a lossless pixel format.
    image.save(destination, "PNG", compress_level=0)
    return image.size

def main() -> None:
    index = ROOT / "index.html"
    html = index.read_text(encoding="utf-8")
    for name, adjustments in CONFIG.items():
        src = DIR / f"{name}.webp"
        if not src.is_file():
            raise FileNotFoundError(src)
        dest = DIR / f"{name}-hq.png"
        size = enhance(src, dest, adjustments)
        html = html.replace(f"assets/portfolio/{name}.webp", f"assets/portfolio/{name}-hq.png")
        # Update declared dimensions while keeping the aspect ratio.
        marker = f'src="assets/portfolio/{name}-hq.png"'
        pattern = re.compile(r'(<img\s+[^>]*' + re.escape(marker) + r'[^>]*?)\s+width="\d+"\s+height="\d+"')
        html = pattern.sub(lambda m: m.group(1) + f' width="{size[0]}" height="{size[1]}"', html)
        print(f"{src.relative_to(ROOT)} -> {dest.relative_to(ROOT)} | {size[0]}x{size[1]} | {dest.stat().st_size:,} bytes")
    index.write_text(html, encoding="utf-8")

if __name__ == "__main__":
    main()
