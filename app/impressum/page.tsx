import type { Metadata } from "next";
import { LegalValue } from "@/components/legal-value";
import { imprint } from "@/content/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung nach § 5 DDG.",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Impressum</h1>

      <div className="legal mt-8">
        <h2>Angaben gemäß § 5 DDG</h2>
        <address>
          {imprint.company}
          <br />
          <LegalValue value={imprint.street} />
          <br />
          <LegalValue value={imprint.postalCode} />{" "}
          <LegalValue value={imprint.city} />
          <br />
          {imprint.country}
        </address>

        <h2>Vertreten durch</h2>
        <p>{imprint.representative}</p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <LegalValue value={imprint.phone} />
          <br />
          E-Mail:{" "}
          <a href={`mailto:${imprint.email}`}>{imprint.email}</a>
        </p>

        <h2>Registereintrag</h2>
        <p>
          <LegalValue value={imprint.register} />
        </p>

        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{" "}
          <LegalValue value={imprint.vatId} />
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <address>
          {imprint.contentResponsible}
          <br />
          <LegalValue value={imprint.street} />
          <br />
          <LegalValue value={imprint.postalCode} />{" "}
          <LegalValue value={imprint.city} />
        </address>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen (§ 36 VSBG).
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder
          nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          entsprechender Rechtsverletzungen entfernen wir diese Inhalte
          umgehend.
        </p>
        <p>
          Die auf dieser Website bereitgestellten Werkzeuge und Texte sind eine
          Arbeitshilfe zur Umsetzung des EU AI Act. Sie stellen keine
          Rechtsberatung dar und ersetzen keine rechtliche Prüfung des
          Einzelfalls.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
          Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte
          waren zum Zeitpunkt der Verlinkung nicht erkennbar. Bei Bekanntwerden
          von Rechtsverletzungen entfernen wir derartige Links umgehend.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers.
        </p>
        <p>
          Die auf dieser Website verwendeten Icons zur Kennzeichnung
          KI-generierter Inhalte stammen von der Europäischen Kommission und
          werden von dieser zur freien Verwendung ohne Namensnennung bereit­gestellt.{" "}
          <a
            href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content"
            target="_blank"
            rel="noreferrer noopener"
          >
            Quelle: EU Icons for labelling AI-generated content
          </a>
          .
        </p>
      </div>
    </div>
  );
}
