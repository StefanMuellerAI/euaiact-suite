# EU AI Act Suite

Interne Sammlung kleiner Web-Werkzeuge rund um den EU AI Act. Erstes Werkzeug:
**Bild-Kennzeichnung** – legt die offiziellen EU-Icons für KI-generierte Inhalte
auf ein Bild.

Die Bildverarbeitung läuft vollständig im Browser (Canvas-API). Es gibt keinen
Upload-Endpunkt, keine Datenbank und keine KI-Anbindung.

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

## Vor dem ersten Deployment ausfüllen

`content/legal.ts` enthält alle rechtlichen Angaben an einer Stelle. Die mit
`TODO` markierten Felder müssen aus stefanai.de/impressum bzw.
/datenschutzerklaerung übernommen werden:

- Straße, PLZ, Ort
- Telefonnummer
- Registereintrag
- USt-IdNr.
- zuständige Datenschutz-Aufsichtsbehörde

Nicht ausgefüllte Felder werden auf `/impressum` und `/datenschutz` gelb
hervorgehoben, damit sie nicht unbemerkt online gehen.

## Aufbau

```
app/
  page.tsx                      Übersicht aller Werkzeuge
  tools/ki-kennzeichnung/       Werkzeug: Bild-Kennzeichnung
  impressum/, datenschutz/      Rechtstexte
components/
  labeler/                      Dropzone, Bedienfeld, Vorschau
  ui/controls.tsx               Formular-Bausteine
content/
  site.ts                       Werkzeug-Registry und Metadaten
  legal.ts                      Rechtliche Angaben (siehe oben)
lib/
  eu-icons.ts                   Icon-Katalog inkl. Artwork-Bounding-Boxen
  labeling.ts                   Regeln und Geometrie (frei von DOM)
  image-io.ts                   Datei einlesen, EXIF-Orientierung
  render.ts                     Canvas-Komposition und Export
public/eu-icons/                Original-SVGs der Europäischen Kommission
```

### Ein neues Werkzeug ergänzen

1. Eintrag in `content/site.ts` (`tools`) anlegen.
2. Route unter `app/tools/<slug>/page.tsx` erstellen.

Die Startseite liest die Registry und zeigt neue Einträge automatisch an.
Werkzeuge mit `status: "geplant"` erscheinen als nicht klickbare Vorschau.

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
