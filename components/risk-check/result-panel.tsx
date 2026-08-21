"use client";

import { useState } from "react";
import { Button, Card, Callout } from "@/components/ui/controls";
import {
  type Answers,
  type Classification,
  type StepId,
  labelOf,
  resultAsText,
  visibleSteps,
} from "@/lib/risk-classification";

const TONES: Record<
  Classification["tone"],
  { frame: string; badge: string; bar: string }
> = {
  danger: {
    frame: "border-red-300 bg-red-50",
    badge: "bg-red-700 text-white",
    bar: "bg-red-700",
  },
  warn: {
    frame: "border-amber-300 bg-amber-50",
    badge: "bg-amber-600 text-white",
    bar: "bg-amber-600",
  },
  info: {
    frame: "border-eu-blue/30 bg-eu-blue/5",
    badge: "bg-eu-blue text-white",
    bar: "bg-eu-blue",
  },
  ok: {
    frame: "border-emerald-300 bg-emerald-50",
    badge: "bg-emerald-700 text-white",
    bar: "bg-emerald-700",
  },
};

/** Reihenfolge der Klassen für die Skala über dem Ergebnis. */
const SCALE: { level: Classification["level"][]; label: string }[] = [
  { level: ["minimal", "kein-ki-system", "ausserhalb"], label: "Minimal" },
  { level: ["transparenz"], label: "Begrenzt" },
  { level: ["hochrisiko-ausnahme"], label: "Ausnahme" },
  { level: ["hochrisiko"], label: "Hoch" },
  { level: ["verboten"], label: "Verboten" },
];

export function ResultPanel({
  answers,
  result,
  onEdit,
  onRestart,
  onBack,
}: {
  answers: Answers;
  result: Classification;
  onEdit: (id: StepId) => void;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const tone = TONES[result.tone];

  async function copy() {
    const text = resultAsText(
      answers,
      result,
      new Date().toLocaleDateString("de-DE"),
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className={`border p-5 sm:p-7 ${tone.frame}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}
          >
            {result.badge}
          </span>
          <span className="text-xs text-ink-500">{result.legalBasis}</span>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-900">
          {result.headline}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
          {result.summary}
        </p>

        <ol className="mt-6 grid grid-cols-5 gap-1" aria-label="Risikoskala">
          {SCALE.map((entry) => {
            const active = entry.level.includes(result.level);
            return (
              <li key={entry.label}>
                <div
                  className={`h-1.5 rounded-full ${active ? tone.bar : "bg-ink-200"}`}
                />
                <span
                  className={`mt-1.5 block text-[11px] leading-tight ${
                    active ? "font-semibold text-ink-900" : "text-ink-400"
                  }`}
                >
                  {entry.label}
                </span>
              </li>
            );
          })}
        </ol>

        {result.deadline ? (
          <p className="mt-6 text-sm font-medium text-ink-800">
            {result.deadline}
          </p>
        ) : null}
      </Card>

      <Card className="p-5 sm:p-7">
        <h3 className="text-base font-semibold text-ink-900">
          Warum dieses Ergebnis
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span aria-hidden="true" className="text-eu-blue">
                ›
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-ink-200 pt-5">
          <h3 className="text-base font-semibold text-ink-900">
            Ihre Rolle: {result.role.label}
          </h3>
          {result.role.note ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {result.role.note}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Die Pflichten unten sind auf diese Rolle zugeschnitten. Ändert sich
              die Rolle – etwa durch eigenes Branding oder eine wesentliche
              Änderung –, ändert sich der Pflichtenkatalog mit.
            </p>
          )}
        </div>
      </Card>

      {result.duties.length > 0 ? (
        <Card className="p-5 sm:p-7">
          <h3 className="text-base font-semibold text-ink-900">
            Was daraus folgt
          </h3>
          <div className="mt-4 space-y-6">
            {result.duties.map((group) => (
              <section key={group.title}>
                <h4 className="text-sm font-semibold text-ink-900">
                  {group.title}
                </h4>
                <p className="mt-0.5 text-xs text-ink-400">{group.legalRef}</p>
                <ul className="mt-2.5 space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm leading-relaxed text-ink-600"
                    >
                      <span aria-hidden="true" className="text-ink-300">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Card>
      ) : null}

      {result.notes.length > 0 ? (
        <Callout tone="info" title="Hinweise">
          <ul className="mt-1 space-y-1.5">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Callout>
      ) : null}

      <Card className="p-5 sm:p-7">
        <h3 className="text-base font-semibold text-ink-900">Ihre Antworten</h3>
        <dl className="mt-4 divide-y divide-ink-100">
          {visibleSteps(answers).map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-6"
            >
              <dt className="text-sm text-ink-500 sm:w-1/2">{step.question}</dt>
              <dd className="flex-1 text-sm text-ink-900">
                {(answers[step.id] ?? [])
                  .map((id) => labelOf(step, id))
                  .join(" · ")}
                <button
                  type="button"
                  onClick={() => onEdit(step.id)}
                  className="ml-2 text-xs font-medium text-eu-blue underline underline-offset-2"
                >
                  ändern
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={copy}>
          {copied ? "In der Zwischenablage" : "Ergebnis als Text kopieren"}
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Letzte Frage
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Neu starten
        </Button>
      </div>

      <Callout tone="warn" title="Arbeitshilfe, keine Rechtsberatung">
        Die Einstufung folgt einem festen Regelwerk und bildet die häufigen Fälle
        ab. Sie ersetzt keine Einzelfallprüfung – insbesondere bei
        Grenzfällen der Zweckbestimmung, bei mehreren verketteten Systemen und in
        regulierten Branchen.
      </Callout>
    </div>
  );
}
