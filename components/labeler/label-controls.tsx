"use client";

import {
  EU_ICONS,
  ICON_ORDER,
  iconAssetPath,
  type IconBackdrop,
  type IconKind,
  type IconTone,
} from "@/lib/eu-icons";
import {
  MARGIN_PERCENT_RANGE,
  PLACEMENTS,
  SIZE_PERCENT_RANGE,
  type ExportFormat,
  type LabelMode,
  type LabelSettings,
  type Layout,
  type Placement,
} from "@/lib/labeling";
import {
  Button,
  Fieldset,
  RangeField,
  SegmentedControl,
  Toggle,
} from "@/components/ui/controls";

export function LabelControls({
  settings,
  layout,
  effectiveTone,
  onChange,
  onReset,
}: {
  settings: LabelSettings;
  layout: Layout | null;
  effectiveTone: IconTone;
  onChange: (patch: Partial<LabelSettings>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-7">
      <SegmentedControl<IconKind>
        legend="1 · Kennzeichnung"
        hint="Welche Aussage trifft auf das Bild zu?"
        columns={1}
        value={settings.kind}
        onChange={(kind) => onChange({ kind })}
        options={ICON_ORDER.map((kind) => ({
          value: kind,
          label: EU_ICONS[kind].label,
          description: EU_ICONS[kind].useWhen,
        }))}
      />

      <SegmentedControl<LabelMode>
        legend="2 · Anbringung"
        hint="Der Code of Practice verlangt das Label auf dem Inhalt selbst."
        value={settings.mode}
        onChange={(mode) => onChange({ mode })}
        options={[
          {
            value: "overlay",
            label: "Auf dem Bild",
            description: "Regelfall",
          },
          {
            value: "bar",
            label: "Auf Balken",
            description: "Bild bleibt unverdeckt",
          },
        ]}
      />

      <SegmentedControl<Placement>
        legend="3 · Position"
        hint="Eine Ecke ohne störende Bildinhalte wählen."
        columns={3}
        value={settings.placement}
        onChange={(placement) => onChange({ placement })}
        options={PLACEMENTS}
      />

      <Fieldset
        legend="4 · Größe und Abstand"
        hint="Prozentwerte beziehen sich auf die kürzere Bildkante."
      >
        <div className="space-y-5">
          <RangeField
            label="Icon-Höhe"
            value={settings.sizePercent}
            min={SIZE_PERCENT_RANGE.min}
            max={SIZE_PERCENT_RANGE.max}
            step={0.5}
            readout={
              layout
                ? `${settings.sizePercent} % · ${layout.iconWidth} × ${layout.iconHeight} px`
                : `${settings.sizePercent} %`
            }
            onChange={(sizePercent) => onChange({ sizePercent })}
          />
          <RangeField
            label="Randabstand"
            value={settings.marginPercent}
            min={MARGIN_PERCENT_RANGE.min}
            max={MARGIN_PERCENT_RANGE.max}
            step={0.5}
            unit=" %"
            onChange={(marginPercent) => onChange({ marginPercent })}
          />
          <RangeField
            label="Deckkraft"
            value={Math.round(settings.opacity * 100)}
            min={20}
            max={100}
            step={5}
            unit=" %"
            onChange={(value) => onChange({ opacity: value / 100 })}
          />
        </div>
      </Fieldset>

      <Fieldset
        legend="5 · Darstellung"
        hint="Das Label muss sich deutlich vom Untergrund abheben."
      >
        <div className="space-y-4">
          <Toggle
            label="Kontrast automatisch wählen"
            description={`Misst die Helligkeit unter dem Icon. Aktuell: ${
              effectiveTone === "black" ? "dunkles Label" : "helles Label"
            }.`}
            checked={settings.autoContrast}
            onChange={(autoContrast) => onChange({ autoContrast })}
          />

          {!settings.autoContrast ? (
            <SegmentedControl<IconTone>
              legend="Farbvariante"
              value={settings.tone}
              onChange={(tone) => onChange({ tone })}
              options={[
                { value: "black", label: "Dunkel" },
                { value: "white", label: "Hell" },
              ]}
            />
          ) : null}

          <SegmentedControl<IconBackdrop>
            legend="Fläche"
            value={settings.backdrop}
            onChange={(backdrop) => onChange({ backdrop })}
            options={[
              { value: "solid", label: "Deckend", description: "Empfohlen" },
              {
                value: "transparent",
                label: "Halbtransparent",
                description: "50 % Deckkraft",
              },
            ]}
          />

          {settings.mode === "bar" ? (
            <SegmentedControl<"light" | "dark">
              legend="Balkenfarbe"
              value={settings.barColor}
              onChange={(barColor) => onChange({ barColor })}
              options={[
                { value: "dark", label: "Dunkel" },
                { value: "light", label: "Hell" },
              ]}
            />
          ) : null}

          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-ink-50 p-3">
            <span className="text-xs font-medium text-ink-600">Vorschau:</span>
            <span
              className={`inline-flex rounded p-2 ${
                effectiveTone === "white" ? "bg-ink-800" : "bg-white border border-ink-200"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconAssetPath({
                  kind: settings.kind,
                  tone: effectiveTone,
                  backdrop: settings.backdrop,
                })}
                alt=""
                className="h-6 w-auto"
              />
            </span>
          </div>
        </div>
      </Fieldset>

      <Fieldset legend="6 · Export">
        <div className="space-y-5">
          <SegmentedControl<ExportFormat>
            legend="Dateiformat"
            columns={3}
            value={settings.exportFormat}
            onChange={(exportFormat) => onChange({ exportFormat })}
            options={[
              { value: "png", label: "PNG" },
              { value: "jpeg", label: "JPEG" },
              { value: "webp", label: "WebP" },
            ]}
          />

          {settings.exportFormat !== "png" ? (
            <RangeField
              label="Qualität"
              value={Math.round(settings.quality * 100)}
              min={50}
              max={100}
              step={1}
              unit=" %"
              onChange={(value) => onChange({ quality: value / 100 })}
            />
          ) : null}

          <SegmentedControl<string>
            legend="Ausgabegröße"
            columns={3}
            value={settings.maxEdge === null ? "original" : String(settings.maxEdge)}
            onChange={(value) =>
              onChange({ maxEdge: value === "original" ? null : Number(value) })
            }
            options={[
              { value: "original", label: "Original" },
              { value: "2048", label: "2048 px" },
              { value: "1200", label: "1200 px" },
            ]}
          />
        </div>
      </Fieldset>

      <Button variant="ghost" onClick={onReset} className="px-0">
        Einstellungen zurücksetzen
      </Button>
    </div>
  );
}
