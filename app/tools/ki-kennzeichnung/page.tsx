import type { Metadata } from "next";
import Link from "next/link";
import { ImageLabeler } from "@/components/labeler/image-labeler";
import { EU_ICONS, ICON_ORDER, iconAltText } from "@/lib/eu-icons";
import { MIN_ICON_HEIGHT_PX } from "@/lib/labeling";

export const metadata: Metadata = {
  title: "Bild-Kennzeichnung",
  description:
    "Offizielles EU-Icon für KI-generierte Inhalte im Browser auf ein Bild legen – ohne Upload.",
};

const rules = [
  {
    title: "Auf dem Inhalt selbst",
    body: "Das Icon gehört in das Bild, nicht in die Bildunterschrift oder den Footer. Dieses Werkzeug brennt es in die Datei ein – so bleibt es auch beim Weiterteilen und Herunterladen sichtbar.",
  },
  {
    title: "Beim ersten Kontakt erkennbar",
    body: "Die Kennzeichnung muss spätestens dann wahrnehmbar sein, wenn eine Person dem Inhalt zum ersten Mal begegnet.",
  },
  {
    title: "Klar sichtbare Größe",
    body: `Der Code of Practice verlangt eine „clearly visible size“. Die begleitende Praxisempfehlung nennt 24–48 px für kleine Darstellungen. Dieses Werkzeug skaliert das Icon proportional zur kürzeren Bildkante und geht nie unter ${MIN_ICON_HEIGHT_PX} px Höhe.`,
  },
  {
    title: "Freie Fläche, guter Kontrast",
    body: "Das Icon soll dort liegen, wo es nicht von Bedienelementen der Plattform überlagert wird. Die Kontrastautomatik misst die Helligkeit unter dem Icon und wählt die helle oder dunkle Variante.",
  },
  {
    title: "Text schlägt Symbol",
    body: "Nutzertests der Kommission zeigen: Varianten mit dem Zusatz „GENERATED“ oder „MODIFIED“ werden deutlich besser verstanden als das Symbol allein. Das kompakte „AI“-Icon nur nutzen, wenn der Platz nicht reicht.",
  },
  {
    title: "Barrierefreiheit mitdenken",
    body: "Beim Einbetten in eine Website sollte der Hinweis über Alt-Text oder ARIA-Label auch für assistive Technologien lesbar sein.",
  },
];

export default function KiKennzeichnungPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Brotkrumen" className="text-sm text-ink-500">
        <Link href="/" className="hover:text-eu-blue">
          Werkzeuge
        </Link>
        <span aria-hidden="true" className="px-2">
          /
        </span>
        <span className="text-ink-700">Bild-Kennzeichnung</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">
          KI-Kennzeichnung für Bilder
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          Bild auswählen, Variante bestimmen, fertiges Bild herunterladen. Die
          Datei verlässt dabei nie den Browser – es findet kein Upload statt.
        </p>
      </header>

      <section className="mt-10">
        <ImageLabeler />
      </section>

      <section className="mt-16 max-w-4xl" aria-labelledby="regeln">
        <h2 id="regeln" className="text-xl font-semibold text-ink-900">
          Was die EU-Vorgaben zu Größe und Platzierung sagen
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Grundlage ist der{" "}
          <a
            href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content"
            target="_blank"
            rel="noreferrer noopener"
            className="text-eu-blue underline underline-offset-2"
          >
            EU-Icon-Satz der Europäischen Kommission
          </a>{" "}
          und Abschnitt 2 des Code of Practice on marking and labelling of
          AI-generated content.
        </p>

        <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule.title}>
              <dt className="text-sm font-semibold text-ink-900">{rule.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {rule.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 max-w-4xl" aria-labelledby="varianten">
        <h2 id="varianten" className="text-xl font-semibold text-ink-900">
          Welche Variante wann
        </h2>
        <ul className="mt-5 space-y-4">
          {ICON_ORDER.map((kind) => {
            const icon = EU_ICONS[kind];
            return (
              <li
                key={kind}
                className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-5"
              >
                <span className="inline-flex shrink-0 items-center rounded-lg bg-ink-900 px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/eu-icons/${kind}--white.svg`}
                    alt={iconAltText(kind)}
                    className="h-7 w-auto"
                  />
                </span>
                <span className="text-sm leading-relaxed text-ink-600">
                  <strong className="font-semibold text-ink-900">
                    {icon.label}
                  </strong>{" "}
                  – {icon.description} {icon.useWhen}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14 max-w-4xl rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-sm font-semibold text-amber-900">
          Sichtbares Label ersetzt keine maschinenlesbare Markierung
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          Art. 50 Abs. 2 AI Act verlangt von Anbietern generativer KI-Systeme
          zusätzlich eine maschinenlesbare Markierung der Ausgaben, etwa
          Wasserzeichen oder Herkunftsmetadaten (C2PA). Dieses Werkzeug erzeugt
          ausschließlich die sichtbare Kennzeichnung. Die Verwendung der EU-Icons
          ist freiwillig, die Kennzeichnungspflicht selbst ist es nicht. Diese
          Seite ist eine Arbeitshilfe und ersetzt keine Rechtsberatung.
        </p>
      </section>
    </div>
  );
}
