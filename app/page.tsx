import { ToolCard } from "@/components/tool-card";
import { site, tools } from "@/content/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-eu-blue">
          {site.name}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          {site.tagline}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          {site.description}
        </p>
      </section>

      <section className="mt-12" aria-labelledby="werkzeuge">
        <h2 id="werkzeuge" className="sr-only">
          Verfügbare Werkzeuge
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-ink-200 bg-white p-6">
        <h2 className="text-base font-semibold text-ink-900">
          Verarbeitung ausschließlich im Browser
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-600">
          Bilder werden über die Canvas-API des Browsers verarbeitet. Es gibt
          keinen Upload-Endpunkt, keine Weitergabe an Dritte und keine
          serverseitige Speicherung. Auch eine KI-Anbindung besteht nicht – die
          Kennzeichnung ist reine Bildkomposition.
        </p>
      </section>
    </div>
  );
}
