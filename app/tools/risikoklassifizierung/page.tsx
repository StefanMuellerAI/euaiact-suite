import type { Metadata } from "next";
import Link from "next/link";
import { RiskWizard } from "@/components/risk-check/risk-wizard";

export const metadata: Metadata = {
  title: "Risikoklassifizierung",
  description:
    "Fragebogen zur Einstufung eines KI-Systems nach der KI-Verordnung – regelbasiert, ohne KI und ohne Datenübertragung.",
};

const classes = [
  {
    label: "Verboten",
    body: "Praktiken aus Art. 5 – etwa Social Scoring, Emotionserkennung am Arbeitsplatz oder das ungezielte Auslesen von Gesichtsbildern. Nicht heilbar, seit 2. Februar 2025 untersagt.",
  },
  {
    label: "Hochrisiko",
    body: "Produkte und Sicherheitsbauteile nach Anhang I sowie die Einsatzzwecke aus Anhang III. Voller Pflichtenkatalog von Risikomanagement bis Konformitätsbewertung.",
  },
  {
    label: "Hochrisiko mit Ausnahme",
    body: "Anhang-III-Bereich, aber nur eng gefasste Verfahrens- oder Vorbereitungsaufgabe ohne wesentlichen Einfluss auf die Entscheidung. Bewertung dokumentieren, System trotzdem registrieren.",
  },
  {
    label: "Begrenztes Risiko",
    body: "Transparenzpflichten nach Art. 50: Chatbots, synthetische Inhalte, Deepfakes, Emotionserkennung. Offenlegen, kennzeichnen, maschinenlesbar markieren.",
  },
  {
    label: "Minimales Risiko",
    body: "Keine besonderen Anforderungen der Verordnung. Die Pflicht zur KI-Kompetenz nach Art. 4 und das übrige Recht gelten weiterhin.",
  },
];

const milestones = [
  { date: "2. Februar 2025", body: "Verbote nach Art. 5 und KI-Kompetenz nach Art. 4" },
  {
    date: "2. August 2025",
    body: "Pflichten für GPAI-Modelle, Governance-Struktur und Sanktionen",
  },
  {
    date: "2. August 2026",
    body: "Allgemeine Anwendbarkeit, Hochrisiko nach Anhang III, Transparenzpflichten nach Art. 50",
  },
  {
    date: "2. August 2027",
    body: "Hochrisiko-Systeme nach Art. 6 Abs. 1 – Produkte und Sicherheitsbauteile aus Anhang I",
  },
];

export default function RisikoklassifizierungPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Brotkrumen" className="text-sm text-ink-500">
        <Link href="/" className="hover:text-eu-blue">
          Werkzeuge
        </Link>
        <span aria-hidden="true" className="px-2">
          /
        </span>
        <span className="text-ink-700">Risikoklassifizierung</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">
          In welche Risikoklasse fällt Ihr KI-System?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          Bis zu elf Fragen mit vorgegebenen Antworten. Der Fragebogen klärt
          zuerst Ihre Rolle – Anbieter, Betreiber, Importeur oder Händler – und
          prüft dann der Reihe nach Verbote, Hochrisiko-Tatbestände und
          Transparenzpflichten. Am Ende stehen die wahrscheinliche Risikoklasse,
          die Begründung und der Pflichtenkatalog für genau Ihre Rolle.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Die Auswertung ist ein fester Entscheidungsbaum: keine KI, kein Upload,
          keine Speicherung. Dieselben Antworten führen immer zum selben
          Ergebnis, und die Seite lässt sich offline nutzen.
        </p>
      </header>

      <section className="mt-10">
        <RiskWizard />
      </section>

      <section className="mt-16 max-w-4xl" aria-labelledby="klassen">
        <h2 id="klassen" className="text-xl font-semibold text-ink-900">
          Die Klassen im Überblick
        </h2>
        <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {classes.map((entry) => (
            <div key={entry.label}>
              <dt className="text-sm font-semibold text-ink-900">
                {entry.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {entry.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 max-w-4xl" aria-labelledby="fristen">
        <h2 id="fristen" className="text-xl font-semibold text-ink-900">
          Ab wann gilt was
        </h2>
        <ul className="mt-5 space-y-3">
          {milestones.map((milestone) => (
            <li
              key={milestone.date}
              className="flex flex-col gap-1 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:gap-6"
            >
              <span className="text-sm font-semibold text-ink-900 sm:w-44 sm:shrink-0">
                {milestone.date}
              </span>
              <span className="text-sm leading-relaxed text-ink-600">
                {milestone.body}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          Grundlage ist die Verordnung (EU) 2024/1689 in der geltenden Fassung.
          Zu Änderungsvorhaben an den Übergangsfristen sollte vor
          Projektentscheidungen der aktuelle Stand geprüft werden.
        </p>
      </section>

      <section className="mt-14 max-w-4xl rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-sm font-semibold text-amber-900">
          Was dieser Fragebogen nicht leistet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          Das Ergebnis ist eine begründete Ersteinschätzung, keine
          Rechtsberatung. Der Fragebogen bildet die häufigen Fälle ab; er ersetzt
          weder die Prüfung der konkreten Zweckbestimmung noch die Bewertung
          verketteter Systeme, sektorspezifischer Vorgaben oder der
          datenschutzrechtlichen Zulässigkeit. Halten Sie das Ergebnis und die
          zugrunde liegenden Antworten schriftlich fest – die Dokumentation der
          Prüfung ist selbst Teil der Pflichten.
        </p>
      </section>
    </div>
  );
}
