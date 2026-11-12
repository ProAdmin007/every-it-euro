/*
 * Every IT Euro — interface strings used by the JavaScript tools (German / Deutsch).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStrings = {
  copied: 'In die Zwischenablage kopiert.',
  copyFailed: 'Kopieren fehlgeschlagen. Bitte markieren und kopieren Sie den Text manuell.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Überwiegend in Europa',
      'mixed': 'Gemischt',
      'non-eu': 'Überwiegend außerhalb Europas',
      'depends': 'Abhängig von der Konfiguration'
    },
    dimensions: {
      sales: 'Vertrieb, Support und Dienstleistungen',
      rd: 'Entwicklung und F&E',
      ip: 'Geistiges Eigentum',
      infra: 'Betrieb der Infrastruktur',
      profit: 'Gewinne und Aktionärsrenditen',
      tax: 'Steuerbemessungsgrundlage',
      law: 'Rechtshoheit und Kontrolle',
      eco: 'Ökosystem und Kompetenzen'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Lokale Vertriebs-, Support- und Beratungsteams sind in der Regel in Europa angestellt.',
        rd: 'Die Produktentwicklung findet überwiegend in Europa statt und baut hier technische Tiefe auf.',
        ip: 'Quellcode, Patente und Know-how gehören einer europäischen Gesellschaft.',
        infra: 'Läuft auf eigener oder anderer europäisch betriebener Infrastruktur des Anbieters – oder auf Ihrer.',
        profit: 'Gewinne fallen bei einem europäischen Unternehmen an; Dividenden gehen an dessen Aktionäre, die überall ansässig sein können.',
        tax: 'Gewinne werden im Allgemeinen dort besteuert, wo das Unternehmen ansässig und tätig ist – hier also in Europa.',
        law: 'Der Anbieter und seine Muttergesellschaft unterliegen in erster Linie europäischem Recht.',
        eco: 'Der Umsatz finanziert mit der Zeit europäische Einstellungen, Partner, Start-ups und Ausgründungen.'
      },
      'eu-on-hyperscaler': {
        sales: 'Kundennahe Teams sind in der Regel europäisch.',
        rd: 'Die Anwendung selbst wird in Europa entwickelt.',
        ip: 'Das geistige Eigentum an der Anwendung ist europäisch, das an der zugrunde liegenden Plattform nicht.',
        infra: 'Die Daten können in EU-Regionen liegen, doch die Infrastruktur wird von einem nichteuropäischen Anbieter betrieben.',
        profit: 'Ein Teil jedes Euros fließt als Plattformgebühr an den Infrastrukturanbieter.',
        tax: 'Der Anbieter zahlt Steuern in Europa; der Anteil des Plattformanbieters wird nach dessen eigener Struktur besteuert.',
        law: 'Der Anbieter ist europäisch, doch sein Infrastrukturanbieter kann nichteuropäischem Recht mit extraterritorialer Reichweite unterliegen.',
        eco: 'Stärkt europäische Softwarekompetenz und vertieft zugleich die Abhängigkeit von einer nichteuropäischen Plattform.'
      },
      'reseller': {
        sales: 'Der Wiederverkäufer oder Integrator beschäftigt lokales Personal und behält seine Marge in Europa.',
        rd: 'Die Kernentwicklung des Produkts findet dort statt, wo der Hersteller seine Entwicklungszentren hat.',
        ip: 'Das geistige Eigentum am Produkt gehört dem nichteuropäischen Hersteller.',
        infra: 'Hängt davon ab, ob das Produkt On-Premises oder in der Cloud des Herstellers läuft.',
        profit: 'Die Marge des Wiederverkäufers bleibt vor Ort; Lizenz- und Abonnementerlöse gehen an den Hersteller.',
        tax: 'Der Wiederverkäufer zahlt vor Ort Steuern; der Anteil des Herstellers wird nach dessen Konzernstruktur besteuert.',
        law: 'Updates, Lizenzierung und Produkt-Roadmap werden vom Hersteller und seiner Heimatrechtsordnung kontrolliert.',
        eco: 'Baut wertvolle lokale Implementierungskompetenz auf, aber keine Fähigkeit zur Produktentwicklung.'
      },
      'global-with-eu-ops': {
        sales: 'Große Anbieter beschäftigen in Europa oft viele Menschen in Vertrieb, Support und Betrieb.',
        rd: 'Manche globalen Anbieter betreiben bedeutende F&E-Zentren in Europa; Kernentscheidungen werden meist anderswo getroffen.',
        ip: 'Das geistige Eigentum liegt meist bei der Muttergesellschaft oder einer IP-Holding außerhalb Europas.',
        infra: 'Europäische Rechenzentren können genutzt werden, werden aber unter der Kontrolle der Muttergesellschaft betrieben.',
        profit: 'Gewinne fallen letztlich bei der Muttergesellschaft und ihren Aktionären an.',
        tax: 'Europäische Tochtergesellschaften zahlen hier Steuern; wie viel Gewinn in Europa besteuert wird, hängt von der Konzern- und Verrechnungspreisstruktur ab.',
        law: 'Die Muttergesellschaft bleibt ihrer Heimatrechtsordnung unterworfen, die extraterritoriale Reichweite beanspruchen kann.',
        eco: 'Schafft europäische Arbeitsplätze und Kompetenzen, während strategische Fähigkeiten in der Zentrale gebündelt sind.'
      },
      'open-source-eu-integrator': {
        sales: 'Support, Integration und Hosting werden bei europäischen Dienstleistern eingekauft.',
        rd: 'Die Entwicklung kann global oder europäisch sein; prüfen Sie, wer den Code tatsächlich pflegt.',
        ip: 'Eine offene Lizenz erlaubt es allen, den Code zu nutzen, zu prüfen und abzuspalten (Fork) – Kontrolle zählt mehr als Eigentum.',
        infra: 'Sie oder ein europäischer Anbieter betreiben die Software auf einer Infrastruktur Ihrer Wahl.',
        profit: 'Dienstleistungsumsätze bleiben überwiegend bei europäischen Anbietern.',
        tax: 'Dienstleister werden dort besteuert, wo sie tätig sind.',
        law: 'Eine offene Lizenz kann von keiner ausländischen Behörde widerrufen werden; Sie kontrollieren die Bereitstellung.',
        eco: 'Finanziert europäische Maintainer und Anbieter – sofern Sie tatsächlich beitragen oder für Support bezahlen.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Beantwortete Fragen: {done} von {total}',
    markdownTitle: 'Checkliste für die souveränitätsorientierte Beschaffung',
    markdownSource: 'Quelle'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Alle Einträge werden angezeigt (insgesamt: {total})',
    showingSome: 'Angezeigte Einträge: {shown} von {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'GERINGE SOUVERÄNITÄTSRELEVANZ',
        text: 'Technologische Souveränität dürfte für dieses System kein entscheidender Faktor sein. Bewerten Sie es nach den üblichen Kriterien – Sicherheit, Qualität, Kosten, Support – und sichern Sie grundlegende Ausstiegsoptionen (Datenexport, offene Standards) vertraglich ab.'
      },
      medium: {
        label: 'MITTLERE SOUVERÄNITÄTSRELEVANZ',
        text: 'Souveränität ist ein relevantes Nebenkriterium. Beziehen Sie die Rechtshoheit des Anbieters, Datenportabilität und Ausstiegsoptionen in die Bewertung ein und ziehen Sie europäische Optionen in Betracht, wo sie wettbewerbsfähig sind.'
      },
      high: {
        label: 'HOHE SOUVERÄNITÄTSRELEVANZ',
        text: 'Die Abhängigkeit von diesem Anbieter könnte Ihre Organisation erheblich beeinträchtigen. Machen Sie Souveränität zu einem ausdrücklichen Teil der Risikobewertung: Dokumentieren Sie Rechtshoheit und Eigentümerschaft, verlangen Sie On-Premises- oder Offline-Betrieb, wo machbar, sichern Sie den Export von Daten und Konfiguration und prüfen Sie aktiv europäische oder Open-Source-Alternativen.'
      },
      strategic: {
        label: 'STRATEGISCHE TECHNOLOGIE',
        text: 'Dieses System verbindet hohe Bedeutung mit erheblicher Abhängigkeit. Behandeln Sie es als strategische Technologie: Beziehen Sie Geschäftsleitung und CISO ein, bewerten Sie geopolitische und rechtliche Szenarien (Sanktionen, Exportbeschränkungen, Übernahme, Rückzug aus der Cloud), entwerfen Sie einen getesteten Ausstiegs- oder Kontinuitätsplan und prüfen Sie europäische und offene Alternativen ernsthaft und dokumentiert.'
      }
    },
    rules: {
      strategicCritical: 'Das System ist Teil kritischer Infrastruktur oder OT, betrieblich wichtig und weist drei oder mehr Abhängigkeitsfaktoren auf.',
      strategicFiveFive: 'Fünf oder mehr Bedeutungsfaktoren in Kombination mit fünf oder mehr Abhängigkeitsfaktoren.',
      highCritical: 'Kontext kritischer Infrastruktur oder OT in Kombination mit mindestens einem Abhängigkeitsfaktor.',
      highThreeTwo: 'Drei oder mehr Bedeutungsfaktoren in Kombination mit zwei oder mehr Abhängigkeitsfaktoren.',
      highSecurity: 'Eine Sicherheitskontrolle mit drei oder mehr Abhängigkeitsfaktoren.',
      medium: 'Eine gewisse Bedeutung und eine gewisse Abhängigkeit, aber nicht genug, um die hohe Schwelle zu erreichen.',
      low: 'Wenige Bedeutungsfaktoren und/oder wenige Abhängigkeitsfaktoren.'
    },
    missingTitle: 'Bitte beantworten Sie alle Fragen.',
    missingCount: 'Unbeantwortete Fragen: {n}. Wenn Sie die Antwort nicht kennen, wählen Sie „Nicht sicher“.',
    unclear: 'Unklar: {reason}',
    outcome: 'Ergebnis',
    meter: ['Gering', 'Mittel', 'Hoch', 'Strategisch'],
    why: 'Warum diese Einstufung?',
    importance: 'Bedeutungsfaktoren ({n})',
    dependency: 'Abhängigkeitsfaktoren ({n})',
    mitigating: 'Mildernde Faktoren',
    openQuestions: 'Mit dem Anbieter zu klärende offene Fragen',
    none: 'Keine festgestellt.',
    disclaimer: 'Dieses Ergebnis folgt den unten veröffentlichten Regeln. Es ist kein wissenschaftlicher Wert und ersetzt keine formale Risikobewertung.',
    copyMarkdown: 'Als Markdown kopieren',
    copyLink: 'Teilbaren Link kopieren',
    print: 'Drucken / als PDF speichern',
    md: {
      title: 'Bewertung der Technologiesouveränität',
      outcome: 'Ergebnis',
      rule: 'Angewandte Regel',
      importance: 'Bedeutungsfaktoren',
      dependency: 'Abhängigkeitsfaktoren',
      mitigating: 'Mildernde Faktoren',
      open: 'Offene Fragen',
      none: 'Keine festgestellt',
      footer: 'Erstellt mit der Bewertung der Technologiesouveränität ({url}). Kein wissenschaftlicher Wert.'
    }
  }
};
