import Image from "next/image";
import Link from "next/link";
import { liveTools, site } from "@/content/site";

/** Die Navigation folgt der Registry: neue Live-Werkzeuge erscheinen von selbst. */
const navigation = [
  { href: "/", label: "Werkzeuge" },
  ...liveTools().map((tool) => ({ href: tool.href, label: tool.title })),
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/*
            Die Signet-Datei aus dem Corporate Design bringt ihren Schutzraum mit:
            die Bildmarke füllt nur 40,6 % der Breite und 56 % der Höhe des
            quadratischen Canvas und sitzt exakt mittig. Für den Header wird das
            Bild deshalb überformatig geladen und der leere Rand abgeschnitten –
            60 px Canvas ergeben eine 33,6 px hohe Bildmarke.
          */}
          <Link
            href="/"
            aria-label={`${site.name} – Startseite`}
            className="relative block h-9 w-7 shrink-0 overflow-hidden"
          >
            <Image
              src="/stefanai-signet.svg"
              alt=""
              width={60}
              height={60}
              unoptimized
              priority
              className="absolute left-1/2 top-1/2 h-[60px] w-[60px] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </Link>
          <span className="flex flex-col leading-tight">
            <Link
              href="/"
              className="text-sm font-semibold text-ink-900 transition-colors hover:text-eu-blue"
            >
              {site.name}
            </Link>
            <a
              href={site.homepage}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-ink-500 transition-colors hover:text-eu-blue"
            >
              {site.legalEntity}
            </a>
          </span>
        </div>

        <nav aria-label="Hauptnavigation" className="ml-auto">
          <ul className="flex items-center gap-5 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-600 transition-colors hover:text-eu-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
