/**
 * Reine Geometrie- und Regel-Logik für das Aufbringen der EU-Kennzeichnung.
 * Bewusst frei von DOM/Canvas, damit sie testbar und wiederverwendbar bleibt.
 */

import { EU_ICONS, type IconBackdrop, type IconKind, type IconTone } from "./eu-icons";

/**
 * Mindestkantenlänge des Icons in Pixeln. Der Code of Practice verlangt eine
 * "clearly visible size"; die begleitende Praxisempfehlung nennt 24–48 px für
 * kleine Darstellungen. 24 px ist damit die Untergrenze, unter die wir nicht
 * gehen – auch nicht bei sehr kleinen Bildern.
 */
export const MIN_ICON_HEIGHT_PX = 24;

/** Empfohlene Icon-Höhe in Prozent der kürzeren Bildkante. */
export const DEFAULT_SIZE_PERCENT = 5;
export const SIZE_PERCENT_RANGE = { min: 2, max: 20 } as const;

/** Empfohlener Randabstand in Prozent der kürzeren Bildkante. */
export const DEFAULT_MARGIN_PERCENT = 3;
export const MARGIN_PERCENT_RANGE = { min: 0, max: 15 } as const;

/**
 * Schutzraum: Mindestabstand zum Bildrand, gemessen an der Icon-Höhe. Ohne
 * Schutzraum "klebt" das Label an der Kante und wird von Plattform-Overlays
 * (Play-Button, Zeitstempel, abgerundete Ecken) leicht verdeckt.
 */
export const MIN_CLEAR_SPACE_FACTOR = 0.35;

/** Anteil der Bildbreite, den ein Label maximal einnehmen soll. */
export const MAX_ICON_WIDTH_RATIO = 0.8;

export type Placement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export const PLACEMENTS: { value: Placement; label: string }[] = [
  { value: "bottom-right", label: "Unten rechts" },
  { value: "bottom-left", label: "Unten links" },
  { value: "bottom-center", label: "Unten mittig" },
  { value: "top-right", label: "Oben rechts" },
  { value: "top-left", label: "Oben links" },
  { value: "top-center", label: "Oben mittig" },
];

/**
 * `overlay` legt das Label direkt auf das Bild (Regelfall laut Code of
 * Practice). `bar` hängt einen Balken an das Bild an – nützlich, wenn der
 * Bildinhalt nicht verdeckt werden darf. Das Label bleibt in beiden Fällen Teil
 * der exportierten Datei und damit auch beim Weiterteilen sichtbar.
 */
export type LabelMode = "overlay" | "bar";

export type ExportFormat = "png" | "jpeg" | "webp";

export type LabelSettings = {
  kind: IconKind;
  tone: IconTone;
  backdrop: IconBackdrop;
  /** Helligkeit im Zielbereich messen und Schwarz/Weiß automatisch wählen. */
  autoContrast: boolean;
  mode: LabelMode;
  placement: Placement;
  /** Icon-Höhe in Prozent der kürzeren Bildkante. */
  sizePercent: number;
  /** Randabstand in Prozent der kürzeren Bildkante. */
  marginPercent: number;
  /** Deckkraft des gesamten Labels (0.2–1). */
  opacity: number;
  /** Farbe des angehängten Balkens im Modus `bar`. */
  barColor: "light" | "dark";
  exportFormat: ExportFormat;
  /** Qualität für JPEG/WebP (0.5–1). */
  quality: number;
  /** Längste Kante des Exports in Pixeln; `null` = Originalgröße. */
  maxEdge: number | null;
};

export const DEFAULT_SETTINGS: LabelSettings = {
  kind: "ai-generated",
  tone: "white",
  backdrop: "solid",
  autoContrast: true,
  mode: "overlay",
  placement: "bottom-right",
  sizePercent: DEFAULT_SIZE_PERCENT,
  marginPercent: DEFAULT_MARGIN_PERCENT,
  opacity: 1,
  barColor: "dark",
  exportFormat: "png",
  quality: 0.92,
  maxEdge: null,
};

export type Layout = {
  /** Maße der Ausgabedatei. */
  canvasWidth: number;
  canvasHeight: number;
  /** Position des Ausgangsbildes auf der Ausgabefläche. */
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  /** Höhe des angehängten Balkens (0 im Overlay-Modus). */
  barHeight: number;
  /** Position und Maße des Icons auf der Ausgabefläche. */
  iconX: number;
  iconY: number;
  iconWidth: number;
  iconHeight: number;
  /** Skalierungsfaktor zwischen Original- und Ausgabegröße. */
  scale: number;
};

export type LayoutWarning = {
  id: string;
  severity: "warn" | "info";
  message: string;
};

export type LayoutResult = {
  layout: Layout;
  warnings: LayoutWarning[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Berechnet die Ausgabegeometrie. `sourceWidth`/`sourceHeight` sind die
 * Pixelmaße des Originalbildes (bereits EXIF-korrigiert).
 */
export function computeLayout(
  sourceWidth: number,
  sourceHeight: number,
  settings: LabelSettings,
): LayoutResult {
  const warnings: LayoutWarning[] = [];
  const icon = EU_ICONS[settings.kind];

  const longestSource = Math.max(sourceWidth, sourceHeight);
  const scale =
    settings.maxEdge && settings.maxEdge < longestSource
      ? settings.maxEdge / longestSource
      : 1;

  const imageWidth = Math.max(1, Math.round(sourceWidth * scale));
  const imageHeight = Math.max(1, Math.round(sourceHeight * scale));
  const shortEdge = Math.min(imageWidth, imageHeight);

  // Icon-Höhe: Prozent der kürzeren Kante, aber nie unter der EU-Untergrenze.
  let iconHeight = (settings.sizePercent / 100) * shortEdge;
  if (iconHeight < MIN_ICON_HEIGHT_PX) {
    iconHeight = MIN_ICON_HEIGHT_PX;
    warnings.push({
      id: "min-size",
      severity: "info",
      message: `Das Icon wurde auf die Mindesthöhe von ${MIN_ICON_HEIGHT_PX} px angehoben.`,
    });
  }
  let iconWidth = iconHeight * icon.aspectRatio;

  // Bei sehr breiten Textvarianten auf schmalen Bildern herunterskalieren.
  const maxIconWidth = imageWidth * MAX_ICON_WIDTH_RATIO;
  if (iconWidth > maxIconWidth) {
    const shrunk = maxIconWidth / icon.aspectRatio;
    if (shrunk < MIN_ICON_HEIGHT_PX) {
      warnings.push({
        id: "too-narrow",
        severity: "warn",
        message:
          "Das Bild ist zu schmal für diese Icon-Variante. Nutze das kompakte „AI“-Icon oder den Balken-Modus.",
      });
    }
    iconHeight = Math.max(MIN_ICON_HEIGHT_PX, shrunk);
    iconWidth = iconHeight * icon.aspectRatio;
  }

  iconWidth = Math.round(iconWidth);
  iconHeight = Math.round(iconHeight);

  const minClearSpace = iconHeight * MIN_CLEAR_SPACE_FACTOR;
  const requestedMargin = (settings.marginPercent / 100) * shortEdge;
  const margin = Math.round(Math.max(requestedMargin, minClearSpace));
  if (requestedMargin < minClearSpace) {
    warnings.push({
      id: "clear-space",
      severity: "info",
      message:
        "Der Randabstand wurde auf den empfohlenen Schutzraum um das Icon angehoben.",
    });
  }

  const barHeight =
    settings.mode === "bar" ? Math.round(iconHeight + margin * 2) : 0;

  const canvasWidth = imageWidth;
  const canvasHeight = imageHeight + barHeight;
  const placedAtTop = settings.placement.startsWith("top");
  const imageY = settings.mode === "bar" && placedAtTop ? barHeight : 0;

  let iconX: number;
  if (settings.placement.endsWith("left")) {
    iconX = margin;
  } else if (settings.placement.endsWith("right")) {
    iconX = canvasWidth - margin - iconWidth;
  } else {
    iconX = Math.round((canvasWidth - iconWidth) / 2);
  }
  iconX = clamp(iconX, 0, Math.max(0, canvasWidth - iconWidth));

  let iconY: number;
  if (settings.mode === "bar") {
    iconY = placedAtTop
      ? Math.round((barHeight - iconHeight) / 2)
      : imageHeight + Math.round((barHeight - iconHeight) / 2);
  } else {
    iconY = placedAtTop ? margin : canvasHeight - margin - iconHeight;
  }
  iconY = clamp(iconY, 0, Math.max(0, canvasHeight - iconHeight));

  if (settings.opacity < 0.6) {
    warnings.push({
      id: "opacity",
      severity: "warn",
      message:
        "Bei geringer Deckkraft ist die Kennzeichnung womöglich nicht mehr „clearly visible“.",
    });
  }

  return {
    layout: {
      canvasWidth,
      canvasHeight,
      imageX: 0,
      imageY,
      imageWidth,
      imageHeight,
      barHeight,
      iconX,
      iconY,
      iconWidth,
      iconHeight,
      scale,
    },
    warnings,
  };
}

export function mimeTypeFor(format: ExportFormat): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

export function extensionFor(format: ExportFormat): string {
  return format === "jpeg" ? "jpg" : format;
}

/** Hängt ein Suffix an den Dateinamen an und tauscht die Endung. */
export function outputFileName(
  originalName: string,
  format: ExportFormat,
  kind: IconKind,
): string {
  const base = originalName.replace(/\.[^./\\]+$/, "") || "bild";
  const safeBase = base.slice(0, 80);
  return `${safeBase}--${kind}.${extensionFor(format)}`;
}

/**
 * Skaliert ein fertiges Layout, z. B. um dieselbe Komposition kleiner für die
 * Bildschirmvorschau zu rendern. Der Export nutzt immer den Faktor 1.
 */
export function scaleLayout(layout: Layout, factor: number): Layout {
  if (factor === 1) return layout;
  const round = (value: number) => Math.max(0, Math.round(value * factor));
  return {
    canvasWidth: Math.max(1, round(layout.canvasWidth)),
    canvasHeight: Math.max(1, round(layout.canvasHeight)),
    imageX: round(layout.imageX),
    imageY: round(layout.imageY),
    imageWidth: Math.max(1, round(layout.imageWidth)),
    imageHeight: Math.max(1, round(layout.imageHeight)),
    barHeight: round(layout.barHeight),
    iconX: round(layout.iconX),
    iconY: round(layout.iconY),
    iconWidth: Math.max(1, round(layout.iconWidth)),
    iconHeight: Math.max(1, round(layout.iconHeight)),
    scale: layout.scale * factor,
  };
}
