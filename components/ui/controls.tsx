"use client";

import type { ReactNode } from "react";
import { useId } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ink-200 bg-white shadow-[0_1px_2px_rgba(13,16,23,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-sm font-semibold text-ink-900">{legend}</legend>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export function SegmentedControl<T extends string>({
  legend,
  hint,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  hint?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}) {
  const name = useId();
  const columnClass =
    columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <Fieldset legend={legend} hint={hint}>
      <div className={`grid gap-2 ${columnClass}`}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                checked
                  ? "border-eu-blue bg-eu-blue/5 text-ink-900"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="block font-medium">{option.label}</span>
              {option.description ? (
                <span className="mt-0.5 block text-xs font-normal text-ink-500">
                  {option.description}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </Fieldset>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  readout,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  readout?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink-900">
          {label}
        </label>
        <span className="text-xs tabular-nums text-ink-500">
          {readout ?? `${value}${unit}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-eu-blue"
      />
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-eu-blue"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink-900">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs text-ink-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-eu-blue text-white hover:bg-eu-blue-dark",
    secondary: "border border-ink-300 bg-white text-ink-800 hover:bg-ink-50",
    ghost: "text-ink-600 hover:text-eu-blue",
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-eu-blue/25 bg-eu-blue/5 text-ink-700",
    warn: "border-amber-300 bg-amber-50 text-amber-900",
  } as const;

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
