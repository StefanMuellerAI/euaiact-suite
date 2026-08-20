import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
  applicationName: site.name,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003399",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-eu-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
