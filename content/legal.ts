/**
 * Zentrale Stelle für alle rechtlichen Angaben.
 *
 * ⚠️ AUSZUFÜLLEN: Die mit `TODO` markierten Felder stammen aus
 * stefanai.de/impressum bzw. stefanai.de/datenschutzerklaerung. Diese Seiten
 * waren aus der Build-Umgebung heraus nicht erreichbar (Egress-Sperre), die
 * Werte müssen daher einmalig hier eingetragen werden. Danach sind Impressum
 * und Datenschutzerklärung vollständig.
 */

export const TODO = "TODO – aus stefanai.de übernehmen";

export const imprint = {
  /** Anbieter im Sinne von § 5 DDG. */
  company: "StefanAI – Research & Development",
  representative: "Stefan Müller",
  street: TODO,
  postalCode: TODO,
  city: TODO,
  country: "Deutschland",
  phone: TODO,
  email: "info@stefanai.de",
  /** Registergericht und -nummer; leer lassen, falls Einzelunternehmen. */
  register: TODO,
  /** Umsatzsteuer-Identifikationsnummer nach § 27a UStG. */
  vatId: TODO,
  /** Verantwortlich nach § 18 Abs. 2 MStV. */
  contentResponsible: "Stefan Müller",
} as const;

export const dataProtection = {
  /** Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO. */
  controller: imprint.company,
  controllerEmail: imprint.email,
  /** Falls ein Datenschutzbeauftragter benannt ist, hier eintragen. */
  dpo: null as string | null,
  hosting: {
    provider: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
    /** Art der Auslieferung. */
    delivery: "Vercel Edge Network (weltweites Content Delivery Network)",
    dpaUrl: "https://vercel.com/legal/dpa",
  },
  /** Zuständige Aufsichtsbehörde – abhängig vom Sitz. */
  supervisoryAuthority: TODO,
  lastUpdated: "2026-08-20",
} as const;

export function isTodo(value: string): boolean {
  return value === TODO;
}
