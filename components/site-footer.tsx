import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.legalEntity} · Interne Nutzung
        </p>
        <nav aria-label="Rechtliches">
          <ul className="flex flex-wrap gap-5">
            <li>
              <Link href="/impressum" className="transition-colors hover:text-eu-blue">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="transition-colors hover:text-eu-blue">
                Datenschutzerklärung
              </Link>
            </li>
            <li>
              <a
                href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content"
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-eu-blue"
              >
                EU-Icons (Quelle)
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
