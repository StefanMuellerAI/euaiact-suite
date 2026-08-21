# EU AI Act Suite

Interne Sammlung kleiner Web-Werkzeuge rund um den EU AI Act:

- **Bild-Kennzeichnung** – legt die offiziellen EU-Icons für KI-generierte
  Inhalte auf ein Bild.
- **Risikoklassifizierung** – Fragebogen, der Rolle und Risikoklasse eines
  KI-Systems bestimmt und den passenden Pflichtenkatalog ausgibt.

Alles läuft vollständig im Browser: Bildverarbeitung über die Canvas-API, die
Einstufung über einen festen Entscheidungsbaum. Es gibt keinen Upload-Endpunkt,
keine Datenbank und keine KI-Anbindung.

## Stack

- Next.js 15 (App Router, React 19, TypeScript)
- Tailwind CSS 4
- Deployment: Vercel (alle Routen werden statisch vorgerendert)

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Produktionsbuild
npm run typecheck
npm run lint
```

## Rechtliche Angaben

`content/legal.ts` bündelt Impressum- und Datenschutzangaben an einer Stelle;
`app/impressum` und `app/datenschutz` lesen ausschließlich von dort. Der
Abschnitt zur EU-Plattform für Online-Streitbeilegung lässt sich über
`showOdrSection` ausblenden.

## Aufbau

```
app/
  page.tsx                      Übersicht aller Werkzeuge
  tools/ki-kennzeichnung/       Werkzeug: Bild-Kennzeichnung
  tools/risikoklassifizierung/  Werkzeug: Risikoklassifizierung
  impressum/, datenschutz/      Rechtstexte
components/
  labeler/                      Dropzone, Bedienfeld, Vorschau
  risk-check/                   Fragebogen und Ergebnisdarstellung
  ui/controls.tsx               Formular-Bausteine
content/
  site.ts                       Werkzeug-Registry und Metadaten
  legal.ts                      Rechtliche Angaben (siehe oben)
lib/
  eu-icons.ts                   Icon-Katalog inkl. Artwork-Bounding-Boxen
  labeling.ts                   Regeln und Geometrie (frei von DOM)
  image-io.ts                   Datei einlesen, EXIF-Orientierung
  render.ts                     Canvas-Komposition und Export
  risk-classification.ts        Fragenkatalog und Entscheidungsbaum (frei von DOM)
public/eu-icons/                Original-SVGs der Europäischen Kommission
```

### Ein neues Werkzeug ergänzen

1. Eintrag in `content/site.ts` (`tools`) anlegen.
2. Route unter `app/tools/<slug>/page.tsx` erstellen.

Die Startseite liest die Registry und zeigt neue Einträge automatisch an; die
Kopfnavigation übernimmt alle Einträge mit `status: "live"`. Werkzeuge mit
`status: "geplant"` erscheinen als nicht klickbare Vorschau.

## Zur Risikoklassifizierung

`lib/risk-classification.ts` enthält den vollständigen Fragenkatalog und die
Auswertung. Beides ist bewusst regelbasiert statt KI-gestützt: Der Fragebogen
ist ein Entscheidungsbaum, derselbe Antwortsatz ergibt immer dieselbe
Einstufung, und das Modul ist frei von DOM- und Netzwerkzugriffen.

- `STEPS` – bis zu elf Fragen; `when` blendet Fragen aus, die nach den
  bisherigen Antworten entfallen (etwa Art. 6 Abs. 3 ohne Anhang-III-Bereich).
- `classify(answers)` – prüft in dieser Reihenfolge: KI-System (Art. 3 Nr. 1),
  Ausnahmen vom Anwendungsbereich (Art. 2), Verbote (Art. 5), Anhang I mit
  Drittbewertung (Art. 6 Abs. 1), Anhang III mit Ausnahmefilter (Art. 6 Abs. 2
  und 3) und schließlich Art. 50. Rolle (Art. 3, Art. 25) und
  GPAI-Pflichten (Kapitel V) laufen als eigene Achse mit.
- `resultAsText(...)` – Ergebnis samt Begründung und Antwortsatz als Klartext
  für die eigene Akte.

Fristen und Pflichtenkataloge stehen im Modul beziehungsweise auf der
Werkzeugseite; bei Änderungen an der Verordnung sind beide Stellen anzupassen.

## Zu den EU-Icons

Die Dateien in `public/eu-icons/` sind unveränderte Originale der Europäischen
Kommission. Sie dürfen frei und ohne Namensnennung verwendet werden.
Quelle: <https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content>

Die Original-SVGs haben rundum transparenten Rand. `lib/eu-icons.ts` hinterlegt
deshalb pro Icon die Bounding-Box der sichtbaren Grafik; beim Rendern wird die
viewBox darauf gesetzt. Nur so entspricht eine Angabe wie „Icon-Höhe 40 px“ der
tatsächlich sichtbaren Höhe.

### Umgesetzte Vorgaben

| Vorgabe | Umsetzung |
| --- | --- |
| Label auf dem Inhalt selbst, sichtbar beim Weiterteilen | Icon wird in die exportierte Datei eingebrannt |
| „clearly visible size“ | Größe proportional zur kürzeren Bildkante, Untergrenze 24 px Icon-Höhe |
| Ausreichender Kontrast | Helligkeitsmessung unter dem Icon, automatische Wahl heller/dunkler Variante |
| Freie Fläche um das Label | Randabstand mit erzwungenem Mindest-Schutzraum (0,35 × Icon-Höhe) |
| Textvariante bevorzugen | `AI GENERATED` ist Voreinstellung, `AI` nur als Ausweichoption |
| Barrierefreiheit | Vorschau trägt `role="img"` mit beschreibendem Label; empfohlener Alt-Text ist dokumentiert |

Nicht abgedeckt: die maschinenlesbare Markierung nach Art. 50 Abs. 2 AI Act
(Wasserzeichen, C2PA-Metadaten). Das Werkzeug erzeugt ausschließlich die
sichtbare Kennzeichnung.
