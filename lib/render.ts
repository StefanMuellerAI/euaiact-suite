/**
 * Canvas-Rendering: Icon rastern, Bild + Label zusammensetzen, exportieren.
 * Läuft vollständig im Browser des Nutzers.
 */

import {
  EU_ICONS,
  iconAssetPath,
  type IconStyle,
  type IconTone,
} from "./eu-icons";
import {
  mimeTypeFor,
  type LabelSettings,
  type Layout,
} from "./labeling";

type Drawable = ImageBitmap | HTMLImageElement;

const svgSourceCache = new Map<string, Promise<string>>();
const rasterCache = new Map<string, Promise<HTMLImageElement>>();

function styleKey(style: IconStyle): string {
  return `${style.kind}|${style.tone}|${style.backdrop}`;
}

async function loadSvgSource(style: IconStyle): Promise<string> {
  const key = styleKey(style);
  let pending = svgSourceCache.get(key);
  if (!pending) {
    pending = fetch(iconAssetPath(style))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Icon konnte nicht geladen werden (${response.status}).`);
        }
        return response.text();
      })
      .catch((error) => {
        svgSourceCache.delete(key);
        throw error;
      });
    svgSourceCache.set(key, pending);
  }
  return pending;
}

/**
 * Setzt die viewBox auf die Bounding-Box der sichtbaren Grafik und schreibt
 * feste Pixelmaße in das SVG. Ohne width/height rastern manche Browser SVGs
 * ohne intrinsische Größe auf 300 × 150 px.
 */
function normalizeSvg(
  source: string,
  style: IconStyle,
  width: number,
  height: number,
): string {
  const { artwork } = EU_ICONS[style.kind];
  const viewBox = `${artwork.x} ${artwork.y} ${artwork.width} ${artwork.height}`;
  return source.replace(/<svg\b[^>]*>/, (openingTag) => {
    let tag = openingTag;
    tag = tag.replace(/\s(?:width|height|viewBox)="[^"]*"/g, "");
    return tag.replace(
      /<svg\b/,
      `<svg width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"`,
    );
  });
}

/** Rastert ein Icon in der gewünschten Pixelgröße (mit Cache). */
export async function rasterizeIcon(
  style: IconStyle,
  width: number,
  height: number,
): Promise<HTMLImageElement> {
  const key = `${styleKey(style)}|${width}x${height}`;
  let pending = rasterCache.get(key);
  if (pending) return pending;

  pending = (async () => {
    const source = await loadSvgSource(style);
    const svg = normalizeSvg(source, style, width, height);
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const image = new Image();
      image.decoding = "async";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Icon konnte nicht gerastert werden."));
        image.src = url;
      });
      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  })();

  rasterCache.set(key, pending);
  pending.catch(() => rasterCache.delete(key));
  return pending;
}

/**
 * Misst die mittlere Helligkeit unter dem Icon und liefert die Variante mit dem
 * besseren Kontrast: helle Fläche → schwarzes Label, dunkle Fläche → weißes.
 */
export function pickToneForRegion(
  context: CanvasRenderingContext2D,
  layout: Layout,
): IconTone {
  const x = Math.max(0, Math.floor(layout.iconX));
  const y = Math.max(0, Math.floor(layout.iconY));
  const width = Math.max(1, Math.min(Math.ceil(layout.iconWidth), layout.canvasWidth - x));
  const height = Math.max(1, Math.min(Math.ceil(layout.iconHeight), layout.canvasHeight - y));

  let data: Uint8ClampedArray;
  try {
    data = context.getImageData(x, y, width, height).data;
  } catch {
    return "white";
  }

  // Bei großen Flächen genügt eine Stichprobe.
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 4000));
  let luminanceSum = 0;
  let samples = 0;

  for (let index = 0; index < pixelCount; index += step) {
    const offset = index * 4;
    const alpha = data[offset + 3] / 255;
    // Transparente Bereiche liegen später auf weißem Hintergrund.
    const r = data[offset] * alpha + 255 * (1 - alpha);
    const g = data[offset + 1] * alpha + 255 * (1 - alpha);
    const b = data[offset + 2] * alpha + 255 * (1 - alpha);
    luminanceSum += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    samples += 1;
  }

  const meanLuminance = samples > 0 ? luminanceSum / samples : 1;
  return meanLuminance > 0.5 ? "black" : "white";
}

export type RenderResult = {
  canvas: HTMLCanvasElement;
  /** Tatsächlich verwendete Farbvariante (relevant bei Auto-Kontrast). */
  tone: IconTone;
};

/** Zeichnet Bild und Kennzeichnung in ein neues Canvas. */
export async function renderLabeledImage(
  source: Drawable,
  layout: Layout,
  settings: LabelSettings,
): Promise<RenderResult> {
  const canvas = document.createElement("canvas");
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas wird von diesem Browser nicht unterstützt.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  if (layout.barHeight > 0) {
    context.fillStyle = settings.barColor === "light" ? "#ffffff" : "#1d1d1b";
    context.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);
  }

  context.drawImage(
    source,
    layout.imageX,
    layout.imageY,
    layout.imageWidth,
    layout.imageHeight,
  );

  const tone =
    settings.autoContrast && layout.barHeight === 0
      ? pickToneForRegion(context, layout)
      : settings.autoContrast
        ? settings.barColor === "light"
          ? "black"
          : "white"
        : settings.tone;

  const icon = await rasterizeIcon(
    { kind: settings.kind, tone, backdrop: settings.backdrop },
    layout.iconWidth,
    layout.iconHeight,
  );

  context.globalAlpha = settings.opacity;
  context.drawImage(
    icon,
    layout.iconX,
    layout.iconY,
    layout.iconWidth,
    layout.iconHeight,
  );
  context.globalAlpha = 1;

  return { canvas, tone };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  settings: LabelSettings,
): Promise<Blob> {
  const type = mimeTypeFor(settings.exportFormat);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Der Export ist fehlgeschlagen."));
      },
      type,
      settings.exportFormat === "png" ? undefined : settings.quality,
    );
  });
}

/**
 * JPEG kennt keine Transparenz – ohne weißen Grund werden transparente
 * Bereiche schwarz. Deshalb vor dem Export unterlegen.
 */
export function flattenForJpeg(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const flattened = document.createElement("canvas");
  flattened.width = canvas.width;
  flattened.height = canvas.height;
  const context = flattened.getContext("2d");
  if (!context) return canvas;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, flattened.width, flattened.height);
  context.drawImage(canvas, 0, 0);
  return flattened;
}

export function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Der Download-Start ist asynchron; kurz warten, bevor die URL fällt.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
