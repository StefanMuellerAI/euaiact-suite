import Link from "next/link";
import type { Tool } from "@/content/site";

const glyphs: Record<Tool["icon"], string> = {
  label: "AI",
  checklist: "✓",
  book: "§",
  shield: "!",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const isLive = tool.status === "live";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold ${
            isLive ? "bg-eu-blue text-white" : "bg-ink-100 text-ink-400"
          }`}
        >
          {glyphs[tool.icon]}
        </span>
        {!isLive ? (
          <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500">
            geplant
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-base font-semibold text-ink-900">{tool.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{tool.summary}</p>
      <p className="mt-4 text-xs text-ink-400">{tool.legalBasis}</p>
    </>
  );

  const base = "block h-full rounded-xl border p-5 transition-colors";

  if (!isLive) {
    return (
      <div className={`${base} border-dashed border-ink-200 bg-white/60`}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={tool.href}
      className={`${base} border-ink-200 bg-white hover:border-eu-blue hover:shadow-[0_2px_12px_rgba(0,51,153,0.08)]`}
    >
      {inner}
    </Link>
  );
}
