/**
 * Zentrale Stelle für alle rechtlichen Angaben. Impressum und
 * Datenschutzerklärung lesen ausschließlich von hier.
 */

export const imprint = {
  /** Anbieter im Sinne von § 5 DDG. */
  company: "StefanAI Solutions GmbH",
  representative: "Geschäftsführer Stefan Müller",
  street: "Graeffstr. 5",
  postalCode: "50823",
  city: "Köln",
  country: "Deutschland",
  phone: "0221/5702984",
  phoneHref: "+492215702984",
  email: "info@stefanai.de",
  register: {
    court: "Amtsgericht Köln",
    number: "HRB 128408",
  },
  /** Umsatzsteuer-Identifikationsnummer nach § 27 a UStG. */
  vatId: "DE463775332",
  /** Redaktionell verantwortlich nach § 18 Abs. 2 MStV. */
  contentResponsible: {
    name: "Stefan Müller",
    street: "Graeffstr. 22",
    postalCode: "50823",
    city: "Köln",
  },
} as const;

/**
 * Die EU-Plattform zur Online-Streitbeilegung (OS) hat ihren Betrieb am
 * 20.07.2025 eingestellt. Der Abschnitt wird unverändert von stefanai.de
 * übernommen; auf `false` setzen, um ihn auszublenden.
 */
export const showOdrSection = true;

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
  /** Zuständige Aufsichtsbehörde nach dem Sitz in Köln. */
  supervisoryAuthority: {
    name: "Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen",
    street: "Kavalleriestr. 2–4",
    postalCode: "40213",
    city: "Düsseldorf",
    url: "https://www.ldi.nrw.de",
  },
  lastUpdated: "2026-08-20",
} as const;
