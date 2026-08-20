export const site = {
  name: "EU AI Act Suite",
  tagline: "Werkzeuge für die praktische Umsetzung des EU AI Act",
  description:
    "Kleine, fokussierte Web-Werkzeuge rund um den EU AI Act. Alle Bildverarbeitung läuft direkt im Browser – es werden keine Dateien hochgeladen.",
  operator: "StefanAI – Research & Development",
  contactEmail: "info@stefanai.de",
  locale: "de-DE",
} as const;

export type ToolStatus = "live" | "geplant";

export type Tool = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  /** Bezug zum Rechtsrahmen, z. B. "Art. 50 AI Act". */
  legalBasis: string;
  status: ToolStatus;
  icon: "label" | "checklist" | "book" | "shield";
};

/**
 * Registry aller Werkzeuge. Neue Tools bekommen einen Eintrag hier und eine
 * Route unter `app/tools/<slug>/` – die Startseite aktualisiert sich von selbst.
 */
export const tools: Tool[] = [
  {
    slug: "ki-kennzeichnung",
    href: "/tools/ki-kennzeichnung",
    title: "Bild-Kennzeichnung",
    summary:
      "Offizielles EU-Icon für KI-generierte Inhalte auf ein Bild legen – mit regelkonformer Größe, Platzierung und Kontrastprüfung.",
    legalBasis: "Art. 50 AI Act · EU Code of Practice, Abschnitt 2",
    status: "live",
    icon: "label",
  },
  {
    slug: "rollen-check",
    href: "#",
    title: "Rollen-Check",
    summary:
      "Klärt, ob eine Organisation im konkreten Fall Anbieter, Betreiber, Importeur oder Händler ist.",
    legalBasis: "Art. 2, Art. 3, Art. 25 AI Act",
    status: "geplant",
    icon: "checklist",
  },
  {
    slug: "transparenzhinweise",
    href: "#",
    title: "Transparenzhinweise",
    summary:
      "Textbausteine für Chatbots, Emotionserkennung und synthetische Inhalte – als Vorlage zum Übernehmen.",
    legalBasis: "Art. 50 AI Act",
    status: "geplant",
    icon: "book",
  },
  {
    slug: "risikoklassen",
    href: "#",
    title: "Risikoklassifizierung",
    summary:
      "Ordnet ein KI-System einer Risikoklasse zu und listet die daraus folgenden Pflichten auf.",
    legalBasis: "Art. 5, Art. 6, Anhang III AI Act",
    status: "geplant",
    icon: "shield",
  },
];

export function liveTools(): Tool[] {
  return tools.filter((tool) => tool.status === "live");
}
