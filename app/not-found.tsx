import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-eu-blue">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-900">
        Diese Seite gibt es nicht
      </h1>
      <p className="mt-3 text-sm text-ink-600">
        Vielleicht wurde sie verschoben oder noch nicht gebaut.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-eu-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-eu-blue-dark"
      >
        Zurück zur Übersicht
      </Link>
    </div>
  );
}
