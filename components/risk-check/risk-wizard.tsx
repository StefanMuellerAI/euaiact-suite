"use client";

import { useMemo, useState } from "react";
import { Button, Card } from "@/components/ui/controls";
import { ResultPanel } from "@/components/risk-check/result-panel";
import {
  SECTION_LABELS,
  type Answers,
  type Choice,
  type Step,
  type StepId,
  classify,
  visibleSteps,
} from "@/lib/risk-classification";

/**
 * Fragebogen zur Einstufung eines KI-Systems. Der Ablauf ist ein
 * Entscheidungsbaum: Jede Antwort bestimmt, welche Fragen noch folgen, und am
 * Ende wertet `classify` den Antwortsatz nach festen Regeln aus.
 */
export function RiskWizard() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => visibleSteps(answers), [answers]);
  const position = Math.min(index, steps.length - 1);
  const step = steps[position];
  const current = answers[step.id] ?? [];
  const isLast = position === steps.length - 1;

  function setAnswer(id: StepId, values: string[]) {
    setAnswers((previous) => ({ ...previous, [id]: values }));
    setError(null);
  }

  function toggle(step: Step, choice: Choice) {
    if (step.kind === "single") {
      setAnswer(step.id, [choice.id]);
      return;
    }

    const picked = answers[step.id] ?? [];
    if (choice.exclusive) {
      setAnswer(step.id, picked.includes(choice.id) ? [] : [choice.id]);
      return;
    }

    const withoutExclusive = picked.filter(
      (id) => !step.choices.find((entry) => entry.id === id)?.exclusive,
    );
    setAnswer(
      step.id,
      withoutExclusive.includes(choice.id)
        ? withoutExclusive.filter((id) => id !== choice.id)
        : [...withoutExclusive, choice.id],
    );
  }

  function next() {
    if (current.length === 0) {
      setError(
        step.kind === "single"
          ? "Bitte wählen Sie eine Antwort aus."
          : "Bitte wählen Sie mindestens eine Option – oder „Nichts davon trifft zu“.",
      );
      return;
    }
    setError(null);
    if (isLast) {
      setShowResult(true);
      return;
    }
    setIndex(position + 1);
  }

  function back() {
    setError(null);
    if (showResult) {
      setShowResult(false);
      return;
    }
    setIndex(Math.max(0, position - 1));
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setShowResult(false);
    setError(null);
  }

  function jumpTo(id: StepId) {
    const target = steps.findIndex((entry) => entry.id === id);
    if (target < 0) return;
    setShowResult(false);
    setIndex(target);
    setError(null);
  }

  if (showResult) {
    return (
      <ResultPanel
        answers={answers}
        result={classify(answers)}
        onEdit={jumpTo}
        onRestart={restart}
        onBack={back}
      />
    );
  }

  const progress = ((position + 1) / steps.length) * 100;

  return (
    <Card className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-eu-blue/10 px-2.5 py-1 text-xs font-semibold text-eu-blue">
          {SECTION_LABELS[step.section]}
        </span>
        <span className="text-xs tabular-nums text-ink-500">
          Frage {position + 1} von {steps.length}
        </span>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={position + 1}
        aria-label="Fortschritt im Fragebogen"
      >
        <div
          className="h-full rounded-full bg-eu-blue transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="text-lg font-semibold leading-snug text-ink-900">
          {step.question}
        </legend>
        {step.help ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
            {step.help}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-ink-400">
          {step.legalRef}
          {step.kind === "multi" ? " · Mehrfachauswahl möglich" : ""}
        </p>

        <div className="mt-5 grid gap-2">
          {step.choices.map((choice) => {
            const checked = current.includes(choice.id);
            return (
              <label
                key={choice.id}
                className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  checked
                    ? "border-eu-blue bg-eu-blue/5"
                    : "border-ink-200 bg-white hover:border-ink-300"
                }`}
              >
                <input
                  type={step.kind === "single" ? "radio" : "checkbox"}
                  name={step.id}
                  value={choice.id}
                  checked={checked}
                  onChange={() => toggle(step, choice)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-eu-blue"
                />
                <span>
                  <span className="block text-sm font-medium text-ink-900">
                    {choice.label}
                  </span>
                  {choice.hint ? (
                    <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                      {choice.hint}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back} disabled={position === 0}>
          Zurück
        </Button>
        <div className="flex items-center gap-2">
          {position > 0 ? (
            <Button variant="secondary" onClick={restart}>
              Neu starten
            </Button>
          ) : null}
          <Button onClick={next}>
            {isLast ? "Ergebnis anzeigen" : "Weiter"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
