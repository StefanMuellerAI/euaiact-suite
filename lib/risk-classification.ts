/**
 * Regelbasierte Einstufung eines KI-Systems nach der KI-Verordnung
 * (Verordnung (EU) 2024/1689).
 *
 * Bewusst ohne KI: Der Fragebogen ist ein Entscheidungsbaum. Aus einem
 * Antwortsatz folgt deterministisch genau ein Ergebnis – dieselben Antworten
 * ergeben immer dieselbe Einstufung. Dieses Modul ist frei von DOM und
 * Netzwerkzugriffen und damit isoliert prüfbar.
 */

export type StepId =
  | "ki-system"
  | "gpai"
  | "rolle"
  | "rollenwechsel"
  | "ausnahmen"
  | "verbote"
  | "anhang-i"
  | "anhang-iii"
  | "art6-3"
  | "profiling"
  | "transparenz";

export type SectionId =
  | "grundlage"
  | "rolle"
  | "verbote"
  | "hochrisiko"
  | "transparenz";

export type Choice = {
  id: string;
  label: string;
  hint?: string;
  /** Schließt in Mehrfachauswahl alle anderen Optionen aus („nichts davon“). */
  exclusive?: boolean;
};

export type Step = {
  id: StepId;
  section: SectionId;
  question: string;
  help?: string;
  legalRef: string;
  kind: "single" | "multi";
  choices: Choice[];
  /** Blendet die Frage aus, wenn sie nach den bisherigen Antworten entfällt. */
  when?: (answers: Answers) => boolean;
};

/** Antworten je Frage. Auch Einfachauswahl wird als Liste gespeichert. */
export type Answers = Partial<Record<StepId, string[]>>;

export const SECTION_LABELS: Record<SectionId, string> = {
  grundlage: "Grundlage",
  rolle: "Rolle",
  verbote: "Verbotene Praktiken",
  hochrisiko: "Hochrisiko",
  transparenz: "Transparenz",
};

const NOTHING: Choice = {
  id: "keins",
  label: "Nichts davon trifft zu",
  exclusive: true,
};

export function isAiSystem(answers: Answers): boolean {
  return !has(answers, "ki-system", "regelwerk");
}

export const STEPS: Step[] = [
  {
    id: "ki-system",
    section: "grundlage",
    question: "Handelt es sich überhaupt um ein KI-System?",
    help: "Ein KI-System leitet aus den erhaltenen Eingaben ab, wie es Ausgaben erzeugt, und arbeitet dabei mit einem gewissen Grad an Autonomie. Klassische Software, die ausschließlich von Menschen vollständig vorgegebene Regeln abarbeitet, fällt nicht darunter.",
    legalRef: "Art. 3 Nr. 1, Erwägungsgrund 12",
    kind: "single",
    choices: [
      {
        id: "ki-system",
        label: "Ja – das System schlussfolgert aus Eingaben",
        hint: "Maschinelles Lernen, logik- oder wissensbasierte Ansätze; das System erzeugt Vorhersagen, Empfehlungen, Inhalte oder Entscheidungen.",
      },
      {
        id: "unklar",
        label: "Unklar",
        hint: "Wird im Ergebnis wie ein KI-System behandelt – im Zweifel prüfen lassen.",
      },
      {
        id: "regelwerk",
        label: "Nein – reine Regelabarbeitung",
        hint: "Feste Formeln, Schwellenwerte oder Entscheidungstabellen, die Menschen vollständig festgelegt haben; auch einfache Statistik ohne Inferenz.",
      },
    ],
  },
  {
    id: "gpai",
    section: "grundlage",
    question:
      "Bringen Sie selbst ein KI-Modell mit allgemeinem Verwendungszweck (GPAI) in Verkehr?",
    help: "Gemeint ist das Modell, nicht die Anwendung darauf. Auch das Weitertrainieren oder erhebliche Feinabstimmen eines fremden Modells kann eigene Pflichten auslösen.",
    legalRef: "Art. 3 Nr. 63, Art. 51, Art. 53, Art. 55",
    kind: "single",
    when: isAiSystem,
    choices: [
      {
        id: "nein",
        label: "Nein",
        hint: "Wir nutzen fremde Modelle oder gar keine – dann gelten die Kapitel-V-Pflichten nicht uns gegenüber.",
      },
      {
        id: "gpai",
        label: "Ja, ein GPAI-Modell",
        hint: "Ein Modell, das allgemein einsetzbar ist und in verschiedene nachgelagerte Systeme eingebettet werden kann.",
      },
      {
        id: "gpai-systemisch",
        label: "Ja, mit systemischem Risiko",
        hint: "Sehr hohe Trainings-Rechenleistung (Richtwert mehr als 10^25 FLOP) oder von der Kommission entsprechend eingestuft.",
      },
    ],
  },
  {
    id: "rolle",
    section: "rolle",
    question: "Welche Rolle nehmen Sie bei genau diesem System ein?",
    help: "Die Rolle entscheidet, welcher Pflichtenkatalog greift. Wer ein System einkauft und einsetzt, ist Betreiber – auch dann, wenn es intensiv konfiguriert wird.",
    legalRef: "Art. 3 Nr. 3–7, Art. 2",
    kind: "single",
    when: isAiSystem,
    choices: [
      {
        id: "anbieter",
        label: "Anbieter",
        hint: "Wir entwickeln das System oder lassen es entwickeln und bringen es unter unserem Namen oder unserer Marke in Verkehr oder nehmen es in Betrieb – auch rein intern.",
      },
      {
        id: "betreiber",
        label: "Betreiber",
        hint: "Wir setzen ein System unter unserer Verantwortung im beruflichen Kontext ein.",
      },
      {
        id: "importeur",
        label: "Importeur",
        hint: "Wir bringen ein System eines Anbieters mit Sitz außerhalb der EU erstmals auf den EU-Markt.",
      },
      {
        id: "haendler",
        label: "Händler",
        hint: "Wir stellen das System in der Lieferkette bereit, ohne Anbieter oder Importeur zu sein.",
      },
      {
        id: "privat",
        label: "Rein private Nutzung",
        hint: "Nutzung als natürliche Person außerhalb jeder beruflichen Tätigkeit.",
      },
    ],
  },
  {
    id: "rollenwechsel",
    section: "rolle",
    question: "Trifft einer dieser Punkte auf Sie zu?",
    help: "In diesen Fällen gelten Betreiber, Importeure und Händler als Anbieter und übernehmen deren vollen Pflichtenkatalog.",
    legalRef: "Art. 25 Abs. 1",
    kind: "multi",
    when: (answers) =>
      isAiSystem(answers) &&
      !has(answers, "rolle", "anbieter") &&
      !has(answers, "rolle", "privat"),
    choices: [
      {
        id: "name",
        label: "Wir bringen unseren Namen oder unsere Marke auf dem System an",
        hint: "Auch Weiterverkauf unter eigenem Label („White Label“).",
      },
      {
        id: "wesentliche-aenderung",
        label: "Wir nehmen eine wesentliche Änderung an einem Hochrisiko-System vor",
        hint: "Änderung, die nicht vom Anbieter vorgesehen war und die Konformität oder Zweckbestimmung berührt.",
      },
      {
        id: "zweck",
        label:
          "Wir ändern die Zweckbestimmung so, dass das System zu einem Hochrisiko-System wird",
      },
      NOTHING,
    ],
  },
  {
    id: "ausnahmen",
    section: "grundlage",
    question: "Greift eine Ausnahme vom Anwendungsbereich?",
    help: "Diese Ausnahmen sind eng. Sobald das System produktiv für seinen eigentlichen Zweck eingesetzt wird, entfallen sie.",
    legalRef: "Art. 2 Abs. 3, 6, 8",
    kind: "multi",
    when: isAiSystem,
    choices: [
      {
        id: "militaer",
        label:
          "Ausschließlich für militärische Zwecke, Verteidigung oder nationale Sicherheit",
      },
      {
        id: "forschung",
        label:
          "Ausschließlich für wissenschaftliche Forschung und Entwicklung",
      },
      {
        id: "vor-markt",
        label:
          "Nur Forschung, Erprobung und Entwicklung vor dem Inverkehrbringen",
        hint: "Tests unter Realbedingungen sind davon ausgenommen – sie fallen unter die Verordnung.",
      },
      NOTHING,
    ],
  },
  {
    id: "verbote",
    section: "verbote",
    question: "Nutzt oder ermöglicht das System eine dieser Praktiken?",
    help: "Diese Praktiken sind seit dem 2. Februar 2025 verboten – unabhängig von Rolle, Branche und Sorgfalt.",
    legalRef: "Art. 5",
    kind: "multi",
    when: isAiSystem,
    choices: [
      {
        id: "manipulation",
        label: "Unterschwellige, manipulative oder täuschende Techniken",
        hint: "Beeinflussen das Verhalten wesentlich, sodass erheblicher Schaden entstehen kann.",
      },
      {
        id: "schwaeche",
        label: "Ausnutzen einer Schutzbedürftigkeit",
        hint: "Alter, Behinderung oder besondere soziale beziehungsweise wirtschaftliche Lage.",
      },
      {
        id: "social-scoring",
        label: "Soziale Bewertung (Social Scoring)",
        hint: "Bewertung sozialen Verhaltens oder persönlicher Eigenschaften mit Schlechterstellung in unzusammenhängenden Kontexten oder in unverhältnismäßiger Weise.",
      },
      {
        id: "predictive-policing",
        label: "Straftatprognose allein anhand von Profiling",
        hint: "Verboten ist die Vorhersage allein aus Persönlichkeitsmerkmalen oder Profiling; die Unterstützung menschlicher Bewertung auf Basis objektiver, überprüfbarer Tatsachen bleibt möglich.",
      },
      {
        id: "gesichtsdatenbank",
        label: "Ungezieltes Auslesen von Gesichtsbildern",
        hint: "Aufbau oder Erweiterung von Gesichtserkennungsdatenbanken durch Scraping aus dem Internet oder aus Videoüberwachung.",
      },
      {
        id: "emotion-arbeit",
        label:
          "Emotionserkennung am Arbeitsplatz oder in Bildungseinrichtungen",
        hint: "Zulässig nur aus medizinischen Gründen oder aus Sicherheitsgründen.",
      },
      {
        id: "biometrische-kategorisierung",
        label: "Biometrische Kategorisierung nach sensiblen Merkmalen",
        hint: "Ableitung von Rasse, politischer Meinung, Gewerkschaftszugehörigkeit, religiöser oder weltanschaulicher Überzeugung, Sexualleben oder sexueller Orientierung.",
      },
      {
        id: "echtzeit-biometrie",
        label:
          "Biometrische Echtzeit-Fernidentifizierung in öffentlich zugänglichen Räumen zu Strafverfolgungszwecken",
        hint: "Nur in eng umgrenzten Ausnahmefällen und mit vorheriger Genehmigung zulässig.",
      },
      NOTHING,
    ],
  },
  {
    id: "anhang-i",
    section: "hochrisiko",
    question:
      "Ist das System Sicherheitsbauteil eines Produkts – oder selbst ein Produkt – nach den EU-Vorschriften aus Anhang I?",
    help: "Anhang I nennt unter anderem Maschinen, Spielzeug, Aufzüge, Funkanlagen, Medizinprodukte, Druckgeräte, Seilbahnen, persönliche Schutzausrüstung sowie Luftfahrt-, Fahrzeug- und Schiffsrecht.",
    legalRef: "Art. 6 Abs. 1, Anhang I",
    kind: "single",
    when: isAiSystem,
    choices: [
      {
        id: "nein",
        label: "Nein",
      },
      {
        id: "ja-drittstelle",
        label: "Ja – mit Konformitätsbewertung durch eine unabhängige Stelle",
        hint: "Das Produkt muss vor dem Inverkehrbringen von einer notifizierten Stelle bewertet werden.",
      },
      {
        id: "ja-ohne-drittstelle",
        label: "Ja – aber ohne Beteiligung einer unabhängigen Stelle",
        hint: "Reine Selbstzertifizierung durch den Hersteller.",
      },
    ],
  },
  {
    id: "anhang-iii",
    section: "hochrisiko",
    question: "Fällt der Einsatzzweck in einen der Bereiche aus Anhang III?",
    help: "Maßgeblich ist die konkrete Zweckbestimmung, nicht die Branche. Mehrfachauswahl möglich.",
    legalRef: "Art. 6 Abs. 2, Anhang III",
    kind: "multi",
    when: isAiSystem,
    choices: [
      {
        id: "biometrie",
        label: "Biometrie",
        hint: "Biometrische Fernidentifizierung, biometrische Kategorisierung nach sensiblen Merkmalen, Emotionserkennung – soweit nicht bereits verboten.",
      },
      {
        id: "infrastruktur",
        label: "Kritische Infrastruktur",
        hint: "Sicherheitsbauteil für Betrieb und Verwaltung von Straßenverkehr, Wasser, Gas, Wärme, Strom oder kritischer digitaler Infrastruktur.",
      },
      {
        id: "bildung",
        label: "Allgemeine und berufliche Bildung",
        hint: "Zugang und Zulassung, Zuweisung zu Einrichtungen, Bewertung von Lernergebnissen oder Bildungsniveau, Überwachung unzulässigen Verhaltens bei Prüfungen.",
      },
      {
        id: "beschaeftigung",
        label: "Beschäftigung und Personalmanagement",
        hint: "Ausspielen von Stellenanzeigen, Filtern und Bewerten von Bewerbungen, Beförderung und Kündigung, Aufgabenzuweisung, Überwachung und Bewertung von Leistung und Verhalten.",
      },
      {
        id: "dienste",
        label: "Zugang zu wesentlichen Diensten",
        hint: "Öffentliche Unterstützungsleistungen, Kreditwürdigkeitsprüfung (außer zur Aufdeckung von Finanzbetrug), Risikobewertung und Preisbildung bei Lebens- und Krankenversicherungen, Notrufabwicklung und Triage.",
      },
      {
        id: "strafverfolgung",
        label: "Strafverfolgung",
        hint: "Etwa Risikobewertung von Personen, Beweiswürdigung, Lügendetektion, Profiling im Rahmen der Strafverfolgung.",
      },
      {
        id: "migration",
        label: "Migration, Asyl und Grenzkontrolle",
      },
      {
        id: "justiz",
        label: "Rechtspflege und demokratische Prozesse",
        hint: "Unterstützung von Justizbehörden bei Sachverhaltsermittlung und Rechtsauslegung, Beeinflussung von Wahlen oder Wahlverhalten.",
      },
      NOTHING,
    ],
  },
  {
    id: "art6-3",
    section: "hochrisiko",
    question: "Trifft eine dieser Beschreibungen auf das System zu?",
    help: "Systeme aus Anhang III gelten ausnahmsweise nicht als Hochrisiko, wenn sie kein erhebliches Risiko für Gesundheit, Sicherheit oder Grundrechte bergen und das Ergebnis der Entscheidungsfindung nicht wesentlich beeinflussen.",
    legalRef: "Art. 6 Abs. 3",
    kind: "multi",
    when: (answers) =>
      isAiSystem(answers) && selectedAnnexThree(answers).length > 0,
    choices: [
      {
        id: "verfahrensaufgabe",
        label: "Es erfüllt nur eine eng gefasste Verfahrensaufgabe",
        hint: "Zum Beispiel Umwandlung unstrukturierter Daten in ein Format oder Sortieren eingehender Dokumente.",
      },
      {
        id: "verbesserung",
        label:
          "Es verbessert nur das Ergebnis einer zuvor abgeschlossenen menschlichen Tätigkeit",
        hint: "Etwa sprachliche Glättung eines fertigen Textes.",
      },
      {
        id: "abweichungsmuster",
        label:
          "Es erkennt Entscheidungsmuster oder Abweichungen davon, ohne die menschliche Bewertung ohne Überprüfung zu ersetzen",
      },
      {
        id: "vorbereitend",
        label: "Es erfüllt nur eine vorbereitende Aufgabe für eine Bewertung",
      },
      {
        ...NOTHING,
        label: "Keine dieser Beschreibungen trifft zu",
      },
    ],
  },
  {
    id: "profiling",
    section: "hochrisiko",
    question: "Führt das System ein Profiling natürlicher Personen durch?",
    help: "Profiling ist die automatisierte Verarbeitung personenbezogener Daten zur Bewertung persönlicher Aspekte, etwa Arbeitsleistung, wirtschaftliche Lage, Gesundheit, Vorlieben, Verhalten oder Aufenthaltsort (Art. 4 Nr. 4 DSGVO).",
    legalRef: "Art. 6 Abs. 3 Unterabsatz 3",
    kind: "single",
    when: (answers) =>
      isAiSystem(answers) &&
      selectedAnnexThree(answers).length > 0 &&
      selectedExemptionFilters(answers).length > 0,
    choices: [
      { id: "nein", label: "Nein" },
      {
        id: "ja",
        label: "Ja",
        hint: "Dann bleibt es bei der Einstufung als Hochrisiko-System – die Ausnahme ist ausgeschlossen.",
      },
    ],
  },
  {
    id: "transparenz",
    section: "transparenz",
    question: "Trifft einer dieser Punkte auf das System zu?",
    help: "Diese Pflichten gelten zusätzlich zu jeder Risikoklasse – auch bei einem System mit minimalem Risiko.",
    legalRef: "Art. 50",
    kind: "multi",
    when: isAiSystem,
    choices: [
      {
        id: "interaktion",
        label: "Menschen interagieren direkt mit dem System",
        hint: "Chatbot, Sprachassistent, automatisierter Telefondienst.",
      },
      {
        id: "synthetisch",
        label:
          "Das System erzeugt synthetische Bild-, Audio-, Video- oder Textinhalte",
      },
      {
        id: "emotion-biometrie",
        label:
          "Das System erkennt Emotionen oder kategorisiert Personen biometrisch",
      },
      {
        id: "deepfake",
        label: "Es entstehen Deepfakes",
        hint: "Inhalte, die realen Personen, Gegenständen, Orten oder Ereignissen täuschend ähnlich sehen.",
      },
      {
        id: "oeffentlicher-text",
        label:
          "Erzeugte Texte werden veröffentlicht, um die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse zu informieren",
      },
      NOTHING,
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen auf dem Antwortsatz                                  */
/* ------------------------------------------------------------------ */

export function has(answers: Answers, step: StepId, choice: string): boolean {
  return (answers[step] ?? []).includes(choice);
}

function selected(answers: Answers, step: StepId): string[] {
  return (answers[step] ?? []).filter((id) => id !== "keins");
}

function selectedAnnexThree(answers: Answers): string[] {
  return selected(answers, "anhang-iii");
}

function selectedExemptionFilters(answers: Answers): string[] {
  return selected(answers, "art6-3");
}

/** Fragen, die nach den bisherigen Antworten tatsächlich zu beantworten sind. */
export function visibleSteps(answers: Answers): Step[] {
  return STEPS.filter((step) => !step.when || step.when(answers));
}

export function isComplete(answers: Answers): boolean {
  return visibleSteps(answers).every(
    (step) => (answers[step.id] ?? []).length > 0,
  );
}

export function labelOf(step: Step, choiceId: string): string {
  return step.choices.find((choice) => choice.id === choiceId)?.label ?? choiceId;
}

/* ------------------------------------------------------------------ */
/* Auswertung                                                           */
/* ------------------------------------------------------------------ */

export type RiskLevel =
  | "kein-ki-system"
  | "ausserhalb"
  | "verboten"
  | "hochrisiko"
  | "hochrisiko-ausnahme"
  | "transparenz"
  | "minimal";

export type RoleKey = "anbieter" | "betreiber" | "importeur" | "haendler" | "privat";

export type DutyGroup = {
  title: string;
  legalRef: string;
  items: string[];
};

export type Classification = {
  level: RiskLevel;
  badge: string;
  tone: "danger" | "warn" | "info" | "ok";
  headline: string;
  summary: string;
  legalBasis: string;
  /** Welche Antworten zu diesem Ergebnis geführt haben. */
  reasons: string[];
  role: { key: RoleKey; label: string; note?: string };
  duties: DutyGroup[];
  notes: string[];
  deadline?: string;
};

const ROLE_LABELS: Record<RoleKey, string> = {
  anbieter: "Anbieter",
  betreiber: "Betreiber",
  importeur: "Importeur",
  haendler: "Händler",
  privat: "Private Nutzung",
};

function resolveRole(answers: Answers): Classification["role"] {
  const raw = (answers.rolle ?? [])[0] as RoleKey | undefined;
  const key: RoleKey = raw ?? "betreiber";
  const shift = selected(answers, "rollenwechsel");

  if (key !== "anbieter" && key !== "privat" && shift.length > 0) {
    return {
      key: "anbieter",
      label: "Anbieter (durch Rollenwechsel)",
      note: `Ausgangsrolle ${ROLE_LABELS[key]}: Nach Art. 25 Abs. 1 gelten Sie als Anbieter, weil ${shiftReason(shift)}. Damit trifft Sie der volle Anbieter-Pflichtenkatalog; der ursprüngliche Anbieter wird aus seinen Pflichten entlassen und muss Sie unterstützen.`,
    };
  }

  return { key, label: ROLE_LABELS[key] };
}

function shiftReason(shift: string[]): string {
  const reasons: Record<string, string> = {
    name: "Sie Ihren Namen oder Ihre Marke auf dem System anbringen",
    "wesentliche-aenderung":
      "Sie eine wesentliche Änderung an einem Hochrisiko-System vornehmen",
    zweck:
      "Sie die Zweckbestimmung so ändern, dass ein Hochrisiko-System entsteht",
  };
  return shift.map((id) => reasons[id] ?? id).join(" und ");
}

/** Pflichten des jeweiligen Akteurs bei einem Hochrisiko-System. */
function highRiskDuties(role: RoleKey): DutyGroup[] {
  if (role === "anbieter") {
    return [
      {
        title: "Vor dem Inverkehrbringen aufzubauen",
        legalRef: "Art. 8–17",
        items: [
          "Risikomanagementsystem über den gesamten Lebenszyklus (Art. 9)",
          "Daten-Governance für Trainings-, Validierungs- und Testdaten (Art. 10)",
          "Technische Dokumentation nach Anhang IV (Art. 11)",
          "Automatische Aufzeichnung von Ereignissen – Protokollierung (Art. 12)",
          "Betriebsanleitung und Transparenz gegenüber Betreibern (Art. 13)",
          "Wirksame menschliche Aufsicht ermöglichen (Art. 14)",
          "Genauigkeit, Robustheit und Cybersicherheit (Art. 15)",
          "Qualitätsmanagementsystem (Art. 17)",
        ],
      },
      {
        title: "Marktzugang",
        legalRef: "Art. 43, 47–49",
        items: [
          "Konformitätsbewertungsverfahren durchlaufen (Art. 43)",
          "EU-Konformitätserklärung ausstellen (Art. 47)",
          "CE-Kennzeichnung anbringen (Art. 48)",
          "System in der EU-Datenbank registrieren (Art. 49)",
          "Bei Sitz außerhalb der EU: Bevollmächtigten in der Union benennen (Art. 22)",
        ],
      },
      {
        title: "Nach dem Inverkehrbringen",
        legalRef: "Art. 72–73",
        items: [
          "Beobachtung nach dem Inverkehrbringen mit ausgewertetem Plan (Art. 72)",
          "Schwerwiegende Vorfälle der Marktüberwachungsbehörde melden (Art. 73)",
          "Korrekturmaßnahmen und Informationspflichten bei Nichtkonformität (Art. 20)",
          "Dokumentation zehn Jahre aufbewahren (Art. 18)",
        ],
      },
    ];
  }

  if (role === "betreiber") {
    return [
      {
        title: "Betrieb",
        legalRef: "Art. 26",
        items: [
          "System entsprechend der Betriebsanleitung einsetzen",
          "Menschliche Aufsicht auf kompetente, geschulte und befugte Personen übertragen",
          "Eingabedaten müssen der Zweckbestimmung entsprechen und ausreichend repräsentativ sein",
          "Betrieb überwachen, bei Risiko aussetzen und Anbieter sowie Behörde informieren",
          "Protokolle mindestens sechs Monate aufbewahren",
        ],
      },
      {
        title: "Information der Betroffenen",
        legalRef: "Art. 26 Abs. 7 und 11, Art. 86",
        items: [
          "Beschäftigte und ihre Vertretungen vor dem Einsatz am Arbeitsplatz informieren",
          "Betroffene Personen darüber informieren, dass ein Hochrisiko-System bei sie betreffenden Entscheidungen verwendet wird",
          "Auf Verlangen eine Erklärung zur Rolle des Systems in der Entscheidung geben (Art. 86)",
        ],
      },
      {
        title: "Zusätzlich für Behörden sowie Kredit- und Versicherungswirtschaft",
        legalRef: "Art. 27, Art. 49 Abs. 3",
        items: [
          "Grundrechte-Folgenabschätzung vor der ersten Nutzung durchführen und der Behörde anzeigen (Art. 27)",
          "Öffentliche Stellen registrieren sich und das System in der EU-Datenbank (Art. 49 Abs. 3)",
          "Datenschutz-Folgenabschätzung nach DSGVO bleibt daneben bestehen (Art. 26 Abs. 9)",
        ],
      },
    ];
  }

  if (role === "importeur") {
    return [
      {
        title: "Prüfpflichten vor dem Inverkehrbringen",
        legalRef: "Art. 23",
        items: [
          "Prüfen, ob die Konformitätsbewertung durchgeführt wurde und die technische Dokumentation vorliegt",
          "CE-Kennzeichnung, EU-Konformitätserklärung und Betriebsanleitung prüfen",
          "Prüfen, ob der Anbieter einen Bevollmächtigten in der Union benannt hat",
          "Eigenen Namen und Kontaktdaten auf dem System oder der Verpackung angeben",
          "Bei begründetem Verdacht auf Nichtkonformität nicht in Verkehr bringen und Behörde informieren",
          "Dokumentation zehn Jahre aufbewahren und Behörden auf Verlangen bereitstellen",
        ],
      },
    ];
  }

  return [
    {
      title: "Prüfpflichten in der Lieferkette",
      legalRef: "Art. 24",
      items: [
        "Vor der Bereitstellung CE-Kennzeichnung, Konformitätserklärung und Betriebsanleitung prüfen",
        "Prüfen, ob Anbieter und Importeur ihre Pflichten erfüllt haben",
        "Bei Verdacht auf Nichtkonformität nicht bereitstellen, Korrekturmaßnahmen einleiten und Behörden informieren",
        "Angemessene Lager- und Transportbedingungen sicherstellen",
      ],
    },
  ];
}

function transparencyDuties(answers: Answers, role: RoleKey): DutyGroup | null {
  const picked = selected(answers, "transparenz");
  if (picked.length === 0) return null;

  const items: string[] = [];
  const isProvider = role === "anbieter";

  if (picked.includes("interaktion")) {
    items.push(
      "Anbieter: Personen darüber informieren, dass sie mit einem KI-System interagieren – es sei denn, das ist aus dem Kontext offensichtlich (Art. 50 Abs. 1)",
    );
  }
  if (picked.includes("synthetisch")) {
    items.push(
      "Anbieter: Ausgaben maschinenlesbar als künstlich erzeugt oder bearbeitet markieren, etwa durch Wasserzeichen oder Herkunftsmetadaten (Art. 50 Abs. 2)",
    );
  }
  if (picked.includes("emotion-biometrie")) {
    items.push(
      "Betreiber: betroffene Personen über den Einsatz informieren und die Vorgaben der DSGVO einhalten (Art. 50 Abs. 3)",
    );
  }
  if (picked.includes("deepfake")) {
    items.push(
      "Betreiber: offenlegen, dass die Inhalte künstlich erzeugt oder manipuliert wurden; bei künstlerischen Werken genügt ein Hinweis, der die Darbietung nicht beeinträchtigt (Art. 50 Abs. 4)",
    );
  }
  if (picked.includes("oeffentlicher-text")) {
    items.push(
      "Betreiber: offenlegen, dass der Text künstlich erzeugt wurde – außer der Inhalt wurde einer menschlichen Überprüfung unterzogen und eine natürliche oder juristische Person trägt die redaktionelle Verantwortung (Art. 50 Abs. 4)",
    );
  }

  items.push(
    "Die Information muss spätestens bei der ersten Interaktion oder Wahrnehmung erfolgen, klar erkennbar und barrierefrei sein (Art. 50 Abs. 5)",
  );

  if (!isProvider) {
    items.push(
      "Als Betreiber die Anbieterpflichten hier nur mitdenken – zu erfüllen sind sie vom Anbieter; verlassen Sie sich nicht darauf, sondern prüfen Sie die Umsetzung.",
    );
  }

  return { title: "Transparenzpflichten", legalRef: "Art. 50", items };
}

function gpaiDuties(answers: Answers): DutyGroup | null {
  const systemic = has(answers, "gpai", "gpai-systemisch");
  if (!systemic && !has(answers, "gpai", "gpai")) return null;

  const items = [
    "Technische Dokumentation des Modells erstellen und aktuell halten (Art. 53 Abs. 1 Buchst. a)",
    "Informationen und Dokumentation für nachgelagerte Anbieter bereitstellen (Art. 53 Abs. 1 Buchst. b)",
    "Strategie zur Einhaltung des Urheberrechts, einschließlich Text- und Data-Mining-Vorbehalt (Art. 53 Abs. 1 Buchst. c)",
    "Hinreichend detaillierte öffentliche Zusammenfassung der Trainingsinhalte veröffentlichen (Art. 53 Abs. 1 Buchst. d)",
  ];

  if (systemic) {
    items.push(
      "Modellbewertung inklusive adversarialem Testen durchführen (Art. 55 Abs. 1 Buchst. a)",
      "Systemische Risiken bewerten und mindern (Art. 55 Abs. 1 Buchst. b)",
      "Schwerwiegende Vorfälle dem AI Office und den zuständigen Behörden melden (Art. 55 Abs. 1 Buchst. c)",
      "Angemessenes Cybersicherheitsniveau für Modell und physische Infrastruktur (Art. 55 Abs. 1 Buchst. d)",
      "Die Kommission über das Erreichen der Schwelle informieren (Art. 52)",
    );
  }

  return {
    title: systemic
      ? "GPAI-Modell mit systemischem Risiko"
      : "GPAI-Modell (allgemeiner Verwendungszweck)",
    legalRef: systemic ? "Art. 52, 53, 55" : "Art. 53",
    items,
  };
}

const LITERACY_DUTY: DutyGroup = {
  title: "Gilt unabhängig von der Risikoklasse",
  legalRef: "Art. 4, Art. 95",
  items: [
    "KI-Kompetenz sicherstellen: Personal und beauftragte Personen müssen über ausreichende Kenntnisse für den Umgang mit dem System verfügen (Art. 4, seit 2. Februar 2025)",
    "Freiwillige Verhaltenskodizes können genutzt werden, um Anforderungen für Hochrisiko-Systeme auch auf andere Systeme anzuwenden (Art. 95)",
    "DSGVO, Betriebsverfassungsrecht, Produkthaftung und Sektorrecht gelten unverändert daneben",
  ],
};

function annexThreeLabels(answers: Answers): string[] {
  const step = STEPS.find((entry) => entry.id === "anhang-iii")!;
  return selectedAnnexThree(answers).map((id) => labelOf(step, id));
}

function prohibitionLabels(answers: Answers): string[] {
  const step = STEPS.find((entry) => entry.id === "verbote")!;
  return selected(answers, "verbote").map((id) => labelOf(step, id));
}

/** Kernlogik ohne die Prüfung des Anwendungsbereichs. */
function classifyRisk(
  answers: Answers,
  role: Classification["role"],
): Classification {
  const prohibited = prohibitionLabels(answers);
  if (prohibited.length > 0) {
    return {
      level: "verboten",
      badge: "Verbotene Praktik",
      tone: "danger",
      headline: "Das System fällt voraussichtlich unter ein Verbot",
      summary:
        "Mindestens eine der angegebenen Praktiken ist nach Art. 5 untersagt. Ein Verbot lässt sich nicht durch Dokumentation, Einwilligung oder menschliche Aufsicht heilen – das System darf in der EU weder in Verkehr gebracht noch betrieben werden. Verstöße sind mit Geldbußen von bis zu 35 Mio. Euro oder 7 % des weltweiten Jahresumsatzes bedroht.",
      legalBasis: "Art. 5, Art. 99 Abs. 3",
      reasons: prohibited.map((label) => `Angegeben: ${label}`),
      role,
      duties: [
        {
          title: "Nächste Schritte",
          legalRef: "Art. 5",
          items: [
            "Einsatz oder Entwicklung stoppen und den Sachverhalt rechtlich prüfen lassen",
            "Prüfen, ob eine der eng gefassten Ausnahmen greift – etwa Emotionserkennung aus medizinischen oder Sicherheitsgründen",
            "Alternative Umsetzung ohne die verbotene Funktion entwerfen und die Zweckbestimmung entsprechend schriftlich festlegen",
          ],
        },
      ],
      notes: [],
      deadline: "Die Verbote gelten seit dem 2. Februar 2025.",
    };
  }

  if (has(answers, "anhang-i", "ja-drittstelle")) {
    return {
      level: "hochrisiko",
      badge: "Hochrisiko",
      tone: "warn",
      headline: "Hochrisiko-System über die Produktsicherheit",
      summary:
        "Das System ist Sicherheitsbauteil eines Produkts – oder selbst ein Produkt – nach den Rechtsvorschriften aus Anhang I und unterliegt dort einer Konformitätsbewertung durch eine unabhängige Stelle. Damit gilt es nach Art. 6 Abs. 1 als Hochrisiko-System. Die Anforderungen werden in das bestehende Produktverfahren integriert, nicht daneben gestellt.",
      legalBasis: "Art. 6 Abs. 1, Anhang I",
      reasons: [
        "Produkt oder Sicherheitsbauteil nach Anhang I mit Konformitätsbewertung durch eine unabhängige Stelle",
      ],
      role,
      duties: highRiskDuties(role.key),
      notes: [
        "Die Prüfung nach der KI-Verordnung wird Teil der bestehenden sektoralen Konformitätsbewertung – ein zweites, getrenntes Verfahren gibt es nicht.",
      ],
      deadline:
        "Für Hochrisiko-Systeme nach Art. 6 Abs. 1 gilt die Übergangsfrist bis zum 2. August 2027.",
    };
  }

  const annexThree = annexThreeLabels(answers);
  if (annexThree.length > 0) {
    const filters = selectedExemptionFilters(answers);
    const profiling = has(answers, "profiling", "ja");

    if (filters.length > 0 && !profiling) {
      return {
        level: "hochrisiko-ausnahme",
        badge: "Hochrisiko – Ausnahme greift",
        tone: "info",
        headline: "Anhang-III-Bereich, aber voraussichtlich kein Hochrisiko",
        summary:
          "Der Einsatzzweck liegt in einem Bereich aus Anhang III, das System erfüllt jedoch eine der Fallgruppen aus Art. 6 Abs. 3 und beeinflusst das Ergebnis der Entscheidungsfindung nicht wesentlich. Die Ausnahme ist eng und muss dokumentiert werden – sie entfällt, sobald das System die menschliche Bewertung tatsächlich prägt.",
        legalBasis: "Art. 6 Abs. 3 und 4",
        reasons: [
          ...annexThree.map((label) => `Anhang-III-Bereich: ${label}`),
          "Mindestens eine Fallgruppe aus Art. 6 Abs. 3 trifft zu",
          "Kein Profiling natürlicher Personen",
        ],
        role,
        duties: [
          {
            title: "Voraussetzung der Ausnahme",
            legalRef: "Art. 6 Abs. 4",
            items: [
              "Die Bewertung, dass das System kein Hochrisiko-System ist, vor Inverkehrbringen oder Inbetriebnahme dokumentieren",
              "Das System dennoch in der EU-Datenbank registrieren (Art. 49 Abs. 2)",
              "Die Dokumentation den Behörden auf Verlangen vorlegen",
              "Bewertung erneuern, sobald sich Funktion, Zweckbestimmung oder Einsatzkontext ändern",
            ],
          },
        ],
        notes: [
          "Die Behörde kann die Einschätzung überprüfen. Trägt sie nicht, gelten rückwirkend die vollen Hochrisiko-Pflichten – die Dokumentation der Bewertung ist deshalb der wichtigste Schritt.",
        ],
        deadline:
          "Die Registrierungs- und Dokumentationspflicht greift ab dem 2. August 2026.",
      };
    }

    return {
      level: "hochrisiko",
      badge: "Hochrisiko",
      tone: "warn",
      headline: "Hochrisiko-System nach Anhang III",
      summary:
        "Der Einsatzzweck fällt in einen der Bereiche aus Anhang III und keine der eng gefassten Ausnahmen aus Art. 6 Abs. 3 greift. Damit gilt der volle Pflichtenkatalog – bei Anbietern über den gesamten Lebenszyklus, bei Betreibern für den Einsatz.",
      legalBasis: "Art. 6 Abs. 2, Anhang III",
      reasons: [
        ...annexThree.map((label) => `Anhang-III-Bereich: ${label}`),
        profiling
          ? "Das System führt Profiling natürlicher Personen durch – die Ausnahme nach Art. 6 Abs. 3 ist damit ausgeschlossen"
          : "Keine der Fallgruppen aus Art. 6 Abs. 3 trifft zu",
      ],
      role,
      duties: highRiskDuties(role.key),
      notes: [],
      deadline:
        "Für Hochrisiko-Systeme nach Anhang III gilt die Übergangsfrist bis zum 2. August 2026.",
    };
  }

  if (selected(answers, "transparenz").length > 0) {
    return {
      level: "transparenz",
      badge: "Begrenztes Risiko",
      tone: "ok",
      headline: "Kein Hochrisiko, aber transparenzpflichtig",
      summary:
        "Das System fällt weder unter ein Verbot noch unter die Hochrisiko-Tatbestände. Es löst jedoch Transparenzpflichten aus: Die betroffenen Personen müssen erkennen können, dass sie es mit KI zu tun haben beziehungsweise dass Inhalte künstlich erzeugt wurden.",
      legalBasis: "Art. 50",
      reasons: ["Keine Hochrisiko-Tatbestände, aber Art. 50 einschlägig"],
      role,
      duties: [],
      notes: [],
      deadline: "Die Transparenzpflichten gelten ab dem 2. August 2026.",
    };
  }

  return {
    level: "minimal",
    badge: "Minimales Risiko",
    tone: "ok",
    headline: "Voraussichtlich minimales Risiko",
    summary:
      "Nach den Angaben greift weder ein Verbot noch ein Hochrisiko-Tatbestand noch eine Transparenzpflicht. Für diese Systeme stellt die Verordnung keine besonderen Anforderungen auf – die allgemeine Pflicht zur KI-Kompetenz und das übrige Recht gelten weiterhin.",
    legalBasis: "Art. 4, Art. 95",
    reasons: [
      "Keine verbotene Praktik angegeben",
      "Kein Produkt nach Anhang I mit Konformitätsbewertung durch eine unabhängige Stelle",
      "Kein Einsatzzweck aus Anhang III",
      "Keine Konstellation aus Art. 50",
    ],
    role,
    duties: [],
    notes: [
      "Die Einstufung hängt an der Zweckbestimmung. Wird das System später für einen anderen Zweck eingesetzt, ist die Prüfung zu wiederholen.",
    ],
  };
}

/**
 * Wertet einen vollständigen Antwortsatz aus. Ohne Zufall, ohne Modell:
 * gleiche Antworten ergeben immer dasselbe Ergebnis.
 */
export function classify(answers: Answers): Classification {
  const role = resolveRole(answers);

  if (has(answers, "ki-system", "regelwerk")) {
    return {
      level: "kein-ki-system",
      badge: "Kein KI-System",
      tone: "ok",
      headline: "Die Verordnung ist voraussichtlich nicht anwendbar",
      summary:
        "Software, die ausschließlich von Menschen vollständig vorgegebene Regeln abarbeitet, ist kein KI-System im Sinne von Art. 3 Nr. 1. Die Abgrenzung ist allerdings die häufigste Fehlerquelle: Sobald Modelle, Lernverfahren oder wissensbasierte Inferenz hinzukommen, ändert sich die Antwort.",
      legalBasis: "Art. 3 Nr. 1, Erwägungsgrund 12",
      reasons: ["Reine Regelabarbeitung ohne Ableitung aus Eingaben"],
      role,
      duties: [],
      notes: [
        "Die Einschätzung schriftlich festhalten – sie ist gegenüber Behörden und Kunden der Nachweis, dass geprüft wurde.",
      ],
    };
  }

  const scopeExemptions = selected(answers, "ausnahmen");
  const privateUse = has(answers, "rolle", "privat");

  if (scopeExemptions.length > 0 || privateUse) {
    const step = STEPS.find((entry) => entry.id === "ausnahmen")!;
    const shadow = classifyRisk(answers, role);
    const reasons = privateUse
      ? ["Rein private Nutzung außerhalb jeder beruflichen Tätigkeit (Art. 2 Abs. 10)"]
      : [];

    return {
      level: "ausserhalb",
      badge: "Außerhalb des Anwendungsbereichs",
      tone: "info",
      headline: "Eine Ausnahme vom Anwendungsbereich greift",
      summary:
        "Nach den Angaben fällt der Einsatz unter eine Ausnahme des Art. 2. Diese Ausnahmen sind eng auszulegen und an den konkreten Zweck gebunden – sie entfallen, sobald das System außerhalb dieses Rahmens genutzt wird.",
      legalBasis: "Art. 2",
      reasons: [
        ...reasons,
        ...scopeExemptions.map((id) => `Angegeben: ${labelOf(step, id)}`),
      ],
      role,
      duties: [],
      notes: [
        `Ohne diese Ausnahme wäre das Ergebnis: ${shadow.badge}. Planen Sie den Fall ein, dass das System später produktiv eingesetzt wird.`,
        ...(shadow.level === "verboten"
          ? [
              "Achtung: Nach den übrigen Angaben liegt eine nach Art. 5 verbotene Praktik vor. Die Ausnahme trägt nur, solange der Einsatz tatsächlich vollständig in ihrem Rahmen bleibt.",
            ]
          : []),
        "Tests unter Realbedingungen und jede produktive Nutzung fallen wieder in den Anwendungsbereich.",
      ],
    };
  }

  const result = classifyRisk(answers, role);
  const extras: DutyGroup[] = [];

  const transparency = transparencyDuties(answers, result.role.key);
  if (transparency) extras.push(transparency);

  const gpai = gpaiDuties(answers);
  if (gpai) extras.push(gpai);

  return {
    ...result,
    duties:
      result.level === "verboten"
        ? [...result.duties, ...extras]
        : [...result.duties, ...extras, LITERACY_DUTY],
  };
}

/** Ergebnis und Antwortsatz als Text – zum Ablegen in der eigenen Akte. */
export function resultAsText(
  answers: Answers,
  result: Classification,
  isoDate: string,
): string {
  const lines: string[] = [
    "EU AI Act – orientierende Einstufung",
    `Stand: ${isoDate}`,
    "",
    `Ergebnis: ${result.badge} – ${result.headline}`,
    `Rechtsgrundlage: ${result.legalBasis}`,
    `Rolle: ${result.role.label}`,
    "",
    result.summary,
    "",
    "Begründung",
    ...result.reasons.map((reason) => `- ${reason}`),
  ];

  if (result.role.note) {
    lines.push("", "Hinweis zur Rolle", `- ${result.role.note}`);
  }

  if (result.deadline) {
    lines.push("", "Frist", `- ${result.deadline}`);
  }

  for (const group of result.duties) {
    lines.push("", `${group.title} (${group.legalRef})`);
    lines.push(...group.items.map((item) => `- ${item}`));
  }

  if (result.notes.length > 0) {
    lines.push("", "Hinweise", ...result.notes.map((note) => `- ${note}`));
  }

  lines.push("", "Antworten");
  for (const step of visibleSteps(answers)) {
    const picked = (answers[step.id] ?? []).map((id) => labelOf(step, id));
    lines.push(
      `- ${step.question} (${step.legalRef})`,
      ...picked.map((label) => `  · ${label}`),
    );
  }

  lines.push(
    "",
    "Diese Einstufung ist eine Arbeitshilfe auf Basis eines festen Regelwerks und ersetzt keine Rechtsberatung.",
  );

  return lines.join("\n");
}
