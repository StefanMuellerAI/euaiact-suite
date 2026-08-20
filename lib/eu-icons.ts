/**
 * Katalog der offiziellen EU-Icons zur Kennzeichnung KI-generierter Inhalte.
 *
 * Quelle der Assets: Europäische Kommission, "EU Icons for labelling
 * AI-generated content" (Bestandteil von Abschnitt 2 des Code of Practice on
 * marking and labelling of AI-generated content).
 * https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content
 *
 * Die Icons dürfen frei und ohne Namensnennung verwendet werden. Die Dateien in
 * `public/eu-icons/` sind unveränderte Originale.
 *
 * `artwork` beschreibt die exakte Bounding-Box der sichtbaren Grafik innerhalb
 * der SVG-viewBox. Die Original-SVGs haben rundum transparenten Rand; ohne diese
 * Angabe wäre eine Größenangabe wie "Icon-Höhe = 40 px" nicht die tatsächlich
 * sichtbare Höhe. Beim Rendern wird die viewBox auf diese Box gesetzt.
 */

export const ICON_TONES = ["black", "white"] as const;
export type IconTone = (typeof ICON_TONES)[number];

export const ICON_BACKDROPS = ["solid", "transparent"] as const;
/** `solid` = deckende Fläche, `transparent` = Fläche mit 50 % Deckkraft. */
export type IconBackdrop = (typeof ICON_BACKDROPS)[number];

export const ICON_KINDS = ["ai", "ai-generated", "ai-modified"] as const;
export type IconKind = (typeof ICON_KINDS)[number];

export type ArtworkBox = {
  /** viewBox-Einheiten */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EuIcon = {
  kind: IconKind;
  label: string;
  short: string;
  description: string;
  /** Empfohlener Einsatz laut Code of Practice. */
  useWhen: string;
  /** Bounding-Box der sichtbaren Grafik in der Original-viewBox. */
  artwork: ArtworkBox;
  /** Breite / Höhe der sichtbaren Grafik. */
  aspectRatio: number;
};

function withRatio(icon: Omit<EuIcon, "aspectRatio">): EuIcon {
  return { ...icon, aspectRatio: icon.artwork.width / icon.artwork.height };
}

export const EU_ICONS: Record<IconKind, EuIcon> = {
  "ai-generated": withRatio({
    kind: "ai-generated",
    label: "AI GENERATED",
    short: "AI GENERATED",
    description:
      "Der Inhalt wurde vollständig von einem KI-System erzeugt.",
    useWhen:
      "Bild wurde komplett von einem generativen KI-System erstellt (z. B. Text-to-Image).",
    artwork: { x: 207.3, y: 144.37, width: 1384.24, height: 266.4 },
  }),
  "ai-modified": withRatio({
    kind: "ai-modified",
    label: "AI MODIFIED",
    short: "AI MODIFIED",
    description:
      "Ein bestehender Inhalt wurde mit KI verändert oder erweitert.",
    useWhen:
      "Reales Foto, das mit KI bearbeitet wurde (Retusche, Generative Fill, Upscaling, Objekte entfernt/ergänzt).",
    artwork: { x: 231.11, y: 144.37, width: 1230.56, height: 266.4 },
  }),
  ai: withRatio({
    kind: "ai",
    label: "AI",
    short: "AI",
    description:
      "Kompaktes Zeichen ohne Zusatztext – für sehr kleine Darstellungen.",
    useWhen:
      "Nur wenn der Platz für die Textvariante nicht reicht. Nutzertests zeigen: Varianten mit Text werden deutlich besser verstanden.",
    artwork: { x: 89.29, y: 100.73, width: 365.48, height: 365.48 },
  }),
};

export const ICON_ORDER: IconKind[] = ["ai-generated", "ai-modified", "ai"];

export type IconStyle = {
  kind: IconKind;
  tone: IconTone;
  backdrop: IconBackdrop;
};

/** Pfad der SVG-Datei unter `public/`. */
export function iconAssetPath({ kind, tone, backdrop }: IconStyle): string {
  const suffix = backdrop === "transparent" ? `${tone}-transparent` : tone;
  return `/eu-icons/${kind}--${suffix}.svg`;
}

export function iconAltText(kind: IconKind, locale: "de" | "en" = "de"): string {
  if (locale === "en") {
    return kind === "ai-modified"
      ? "EU label: content modified with artificial intelligence"
      : "EU label: content generated with artificial intelligence";
  }
  return kind === "ai-modified"
    ? "EU-Kennzeichnung: Inhalt wurde mit künstlicher Intelligenz verändert"
    : "EU-Kennzeichnung: Inhalt wurde mit künstlicher Intelligenz erzeugt";
}
