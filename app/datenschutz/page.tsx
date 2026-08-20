import type { Metadata } from "next";
import { dataProtection, imprint } from "@/content/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 DSGVO.",
};

export default function DatenschutzPage() {
  const { hosting, supervisoryAuthority } = dataProtection;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">
        Datenschutzerklärung
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Stand: {dataProtection.lastUpdated}
      </p>

      <div className="legal mt-8">
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO für die Verarbeitung
          personenbezogener Daten auf dieser Website ist:
        </p>
        <address>
          {imprint.company}
          <br />
          {imprint.representative}
          <br />
          {imprint.street}
          <br />
          {imprint.postalCode} {imprint.city}
          <br />
          Telefon: <a href={`tel:${imprint.phoneHref}`}>{imprint.phone}</a>
          <br />
          E-Mail: <a href={`mailto:${imprint.email}`}>{imprint.email}</a>
        </address>
        {dataProtection.dpo ? (
          <p>Datenschutzbeauftragter: {dataProtection.dpo}</p>
        ) : null}

        <h2>2. Verarbeitung Ihrer Bilder – ausschließlich lokal</h2>
        <p>
          Die auf dieser Website angebotenen Werkzeuge zur Bildkennzeichnung
          verarbeiten Ihre Dateien vollständig im Arbeitsspeicher Ihres eigenen
          Browsers. Es gibt keinen Upload-Endpunkt: Bilder werden weder an uns
          noch an Dritte übertragen, nicht zwischengespeichert und nicht
          gespeichert. Auch das fertig gekennzeichnete Bild entsteht lokal und
          wird nur dort abgelegt, wo Sie es speichern.
        </p>
        <p>
          Es kommt keine KI-Anbindung und keine externe Bildverarbeitungs-API zum
          Einsatz. Insoweit findet keine Verarbeitung personenbezogener Daten
          durch uns statt.
        </p>

        <h2>3. Aufruf der Website: Server-Logfiles</h2>
        <p>
          Beim Aufruf dieser Website werden durch unseren Hosting-Dienstleister
          automatisch Informationen erfasst, die Ihr Browser übermittelt. Dies
          sind insbesondere:
        </p>
        <ul>
          <li>IP-Adresse des anfragenden Endgeräts</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Name und URL der abgerufenen Datei</li>
          <li>Übertragene Datenmenge und HTTP-Statuscode</li>
          <li>Browsertyp, Browserversion und verwendetes Betriebssystem</li>
          <li>Referrer-URL, sofern übermittelt</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt im technisch fehlerfreien Betrieb, in der Auslieferung
          der Website und in der Abwehr von Angriffen. Eine Zusammenführung
          dieser Daten mit anderen Datenquellen findet nicht statt; eine
          Auswertung zu Marketingzwecken erfolgt nicht.
        </p>

        <h3>Hosting</h3>
        <p>
          Diese Website wird bei {hosting.provider}, {hosting.address},
          gehostet. Die Auslieferung der Seiten erfolgt über das{" "}
          {hosting.delivery}; dabei können Server außerhalb der EU beteiligt
          sein. {hosting.provider} verarbeitet die vorgenannten Daten
          als Auftragsverarbeiter auf Grundlage eines Vertrags zur
          Auftragsverarbeitung nach Art. 28 DSGVO (
          <a href={hosting.dpaUrl} target="_blank" rel="noreferrer noopener">
            Data Processing Addendum
          </a>
          ).
        </p>
        <p>
          Eine Übermittlung personenbezogener Daten in die USA kann nicht
          ausgeschlossen werden. Sie wird auf die Standardvertragsklauseln der
          EU-Kommission gemäß Art. 46 Abs. 2 lit. c DSGVO sowie – soweit der
          Anbieter zertifiziert ist – auf den Angemessenheitsbeschluss zum
          EU-US Data Privacy Framework gestützt.
        </p>

        <h2>4. Cookies, Tracking und Analyse</h2>
        <p>
          Diese Website setzt keine Cookies zu Analyse-, Marketing- oder
          Tracking­zwecken ein. Es sind keine Webanalyse-Dienste, keine
          Werbenetzwerke, keine Social-Media-Plugins und keine externen
          Schriftarten- oder CDN-Dienste eingebunden. Eine Einwilligung nach
          § 25 TDDDG ist deshalb nicht erforderlich.
        </p>
        <p>
          Getroffene Einstellungen der Werkzeuge verbleiben ausschließlich in
          Ihrem Browser und werden nicht an uns übermittelt.
        </p>

        <h2>5. Kontaktaufnahme</h2>
        <p>
          Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen
          mitgeteilten Daten zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO, bei vertragsbezogenen Anfragen Art. 6
          Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald der jeweilige
          Vorgang abgeschlossen ist und keine gesetzlichen
          Aufbewahrungs­pflichten entgegenstehen.
        </p>

        <h2>6. Speicherdauer</h2>
        <p>
          Server-Logfiles werden nach spätestens 30 Tagen gelöscht oder
          anonymisiert, soweit sie nicht ausnahmsweise zur Aufklärung eines
          konkreten Sicherheitsvorfalls länger benötigt werden.
        </p>

        <h2>7. Ihre Rechte</h2>
        <p>Ihnen stehen gegenüber dem Verantwortlichen folgende Rechte zu:</p>
        <ul>
          <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>
            Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1
            lit. f DSGVO (Art. 21 DSGVO)
          </li>
        </ul>
        <p>
          Zur Ausübung genügt eine formlose Nachricht an{" "}
          <a href={`mailto:${dataProtection.controllerEmail}`}>
            {dataProtection.controllerEmail}
          </a>
          .
        </p>

        <h2>8. Beschwerderecht bei der Aufsichtsbehörde</h2>
        <p>
          Unbeschadet anderweitiger Rechtsbehelfe steht Ihnen nach Art. 77 DSGVO
          ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu,
          insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres
          Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Die für uns
          zuständige Aufsichtsbehörde ist:
        </p>
        <address>
          {supervisoryAuthority.name}
          <br />
          {supervisoryAuthority.street}
          <br />
          {supervisoryAuthority.postalCode} {supervisoryAuthority.city}
          <br />
          <a href={supervisoryAuthority.url} target="_blank" rel="noreferrer noopener">
            {supervisoryAuthority.url}
          </a>
        </address>

        <h2>9. Verschlüsselung</h2>
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung.
          Eine verschlüsselte Verbindung erkennen Sie an der Adresszeile Ihres
          Browsers („https://“).
        </p>

        <h2>10. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir passen diese Datenschutzerklärung an, sobald Änderungen an der
          Website oder der Rechtslage dies erforderlich machen. Es gilt jeweils
          die hier veröffentlichte Fassung.
        </p>
      </div>
    </div>
  );
}
