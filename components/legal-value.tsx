import { isTodo } from "@/content/legal";

/**
 * Rendert einen Wert aus `content/legal.ts`. Noch nicht befüllte Felder werden
 * deutlich markiert, damit sie nicht unbemerkt online gehen.
 */
export function LegalValue({ value }: { value: string }) {
  if (!isTodo(value)) return <>{value}</>;
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
      {value}
    </mark>
  );
}
