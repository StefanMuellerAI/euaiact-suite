/**
 * Laden von Bilddateien – ausschließlich im Browser. Es wird zu keinem
 * Zeitpunkt etwas an einen Server übertragen.
 */

export const ACCEPTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/bmp",
] as const;

export const ACCEPT_ATTRIBUTE = ACCEPTED_MIME_TYPES.join(",");

/** Praktische Obergrenze, damit der Tab bei Riesendateien nicht abstürzt. */
export const MAX_FILE_BYTES = 40 * 1024 * 1024;

export type LoadedImage = {
  bitmap: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  /** Object-URL für die Vorschau; muss beim Verwerfen freigegeben werden. */
  objectUrl: string;
};

export function isAcceptedImage(file: File): boolean {
  return file.type.startsWith("image/") && file.type !== "image/svg+xml";
}

export async function loadImageFile(file: File): Promise<LoadedImage> {
  if (!isAcceptedImage(file)) {
    throw new Error(
      "Dieses Format wird nicht unterstützt. Erlaubt sind PNG, JPEG, WebP, GIF, AVIF und BMP.",
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `Die Datei ist größer als ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB.`,
    );
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const bitmap = await decode(file, objectUrl);
    return {
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      objectUrl,
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

async function decode(
  file: File,
  objectUrl: string,
): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      // `from-image` wendet die EXIF-Orientierung an, damit hochkant
      // aufgenommene Fotos nicht gedreht exportiert werden.
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Ältere Browser kennen die Option nicht – dann über <img> laden.
    }
  }
  return loadViaElement(objectUrl);
}

function loadViaElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Das Bild konnte nicht gelesen werden."));
    image.src = src;
  });
}

export function releaseImage(image: LoadedImage | null): void {
  if (!image) return;
  URL.revokeObjectURL(image.objectUrl);
  if ("close" in image.bitmap && typeof image.bitmap.close === "function") {
    image.bitmap.close();
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
