import Link from "next/link";
import { site } from "@/content/site";

const navigation = [
  { href: "/", label: "Werkzeuge" },
  { href: "/tools/ki-kennzeichnung", label: "Bild-Kennzeichnung" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-md bg-eu-blue text-sm font-bold tracking-tight text-eu-yellow"
          >
            EU
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-ink-900">{site.name}</span>
            <span className="text-xs text-ink-500">{site.operator}</span>
          </span>
        </Link>

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
