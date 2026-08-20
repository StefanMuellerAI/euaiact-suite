"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropzone } from "./dropzone";
import { LabelControls } from "./label-controls";
import { Button, Callout, Card } from "@/components/ui/controls";
import { iconAltText, type IconTone } from "@/lib/eu-icons";
import {
  formatBytes,
  loadImageFile,
  releaseImage,
  type LoadedImage,
} from "@/lib/image-io";
import {
  computeLayout,
  DEFAULT_SETTINGS,
  outputFileName,
  scaleLayout,
  type LabelSettings,
} from "@/lib/labeling";
import {
  canvasToBlob,
  flattenForJpeg,
  renderLabeledImage,
  triggerDownload,
} from "@/lib/render";

/** Längste Kante der Bildschirmvorschau – hält das Rendern flüssig. */
const PREVIEW_MAX_EDGE = 1400;

export function ImageLabeler() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [settings, setSettings] = useState<LabelSettings>(DEFAULT_SETTINGS);
  const [effectiveTone, setEffectiveTone] = useState<IconTone>(
    DEFAULT_SETTINGS.tone,
  );
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "done" | "unsupported">(
    "idle",
  );

  const previewRef = useRef<HTMLDivElement>(null);

  const layoutResult = useMemo(() => {
    if (!image) return null;
    return computeLayout(image.width, image.height, settings);
  }, [image, settings]);

  useEffect(() => {
    if (!image || !layoutResult) return;
    let cancelled = false;

    const draw = async () => {
      const { layout } = layoutResult;
      const factor = Math.min(
        1,
        PREVIEW_MAX_EDGE / Math.max(layout.canvasWidth, layout.canvasHeight),
      );
      const { canvas, tone } = await renderLabeledImage(
        image.bitmap,
        scaleLayout(layout, factor),
        settings,
      );
      if (cancelled) return;

      canvas.className = "block h-auto w-full";
      canvas.setAttribute("role", "img");
      canvas.setAttribute(
        "aria-label",
        `Vorschau: ${image.fileName} mit ${iconAltText(settings.kind)}`,
      );
      previewRef.current?.replaceChildren(canvas);
      setEffectiveTone(tone);
    };

    draw().catch((cause: unknown) => {
      if (cancelled) return;
      setError(
        cause instanceof Error ? cause.message : "Die Vorschau ist fehlgeschlagen.",
      );
    });

    return () => {
      cancelled = true;
    };
  }, [image, layoutResult, settings]);

  // Muss NACH dem Render-Effekt stehen: React ruft die Cleanups in
  // Deklarationsreihenfolge auf, dadurch wird ein laufendes Rendern erst
  // abgebrochen und die Bitmap danach freigegeben.
  useEffect(() => () => releaseImage(image), [image]);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setCopyState("idle");
    try {
      const loaded = await loadImageFile(file);
      setImage(loaded);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Das Bild konnte nicht geladen werden.",
      );
    }
  }, []);

  const buildBlob = useCallback(async () => {
    if (!image || !layoutResult) return null;
    const { canvas } = await renderLabeledImage(
      image.bitmap,
      layoutResult.layout,
      settings,
    );
    const target =
      settings.exportFormat === "jpeg" ? flattenForJpeg(canvas) : canvas;
    return canvasToBlob(target, settings);
  }, [image, layoutResult, settings]);

  const handleDownload = useCallback(async () => {
    if (!image) return;
    setIsExporting(true);
    setError(null);
    try {
      const blob = await buildBlob();
      if (blob) {
        triggerDownload(
          blob,
          outputFileName(image.fileName, settings.exportFormat, settings.kind),
        );
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Der Export ist fehlgeschlagen.",
      );
    } finally {
      setIsExporting(false);
    }
  }, [buildBlob, image, settings.exportFormat, settings.kind]);

  const handleCopy = useCallback(async () => {
    if (!image) return;
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
      setCopyState("unsupported");
      return;
    }
    setIsExporting(true);
    try {
      // Die Zwischenablage akzeptiert zuverlässig nur PNG.
      const { canvas } = await renderLabeledImage(
        image.bitmap,
        layoutResult!.layout,
        settings,
      );
      const blob = await canvasToBlob(canvas, { ...settings, exportFormat: "png" });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopyState("done");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("unsupported");
    } finally {
      setIsExporting(false);
    }
  }, [image, layoutResult, settings]);

  const handleReset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);
  const patchSettings = useCallback(
    (patch: Partial<LabelSettings>) =>
      setSettings((previous) => ({ ...previous, ...patch })),
    [],
  );

  if (!image) {
    return (
      <div className="space-y-4">
        <Dropzone onFile={handleFile} />
        {error ? <Callout tone="warn">{error}</Callout> : null}
      </div>
    );
  }

  const layout = layoutResult?.layout ?? null;
  const warnings = layoutResult?.warnings ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="checkerboard p-4">
            <div ref={previewRef} className="mx-auto max-w-full" />
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleDownload} disabled={isExporting}>
            {isExporting ? "Wird erstellt …" : "Bild herunterladen"}
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={isExporting}>
            {copyState === "done" ? "Kopiert" : "In Zwischenablage"}
          </Button>
          <Dropzone onFile={handleFile} compact />
        </div>

        {copyState === "unsupported" ? (
          <Callout>
            Dieser Browser erlaubt das Kopieren von Bildern nicht. Nutze den
            Download.
          </Callout>
        ) : null}

        {error ? <Callout tone="warn">{error}</Callout> : null}

        {warnings.map((warning) => (
          <Callout key={warning.id} tone={warning.severity === "warn" ? "warn" : "info"}>
            {warning.message}
          </Callout>
        ))}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg bg-white p-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-500">Datei</dt>
            <dd className="truncate font-medium text-ink-900" title={image.fileName}>
              {image.fileName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Original</dt>
            <dd className="font-medium text-ink-900">
              {image.width} × {image.height} px
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Ausgabe</dt>
            <dd className="font-medium text-ink-900">
              {layout ? `${layout.canvasWidth} × ${layout.canvasHeight} px` : "–"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-500">Dateigröße (Eingabe)</dt>
            <dd className="font-medium text-ink-900">{formatBytes(image.fileSize)}</dd>
          </div>
        </dl>
      </div>

      <aside>
        <Card className="p-5">
          <LabelControls
            settings={settings}
            layout={layout}
            effectiveTone={effectiveTone}
            onChange={patchSettings}
            onReset={handleReset}
          />
        </Card>
      </aside>
    </div>
  );
}
