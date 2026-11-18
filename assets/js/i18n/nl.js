/*
 * EU Tech Compass — interface strings used by the JavaScript tools (Dutch / Nederlands).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStrings = {
  copied: 'Gekopieerd naar het klembord.',
  copyFailed: 'Kopiëren is mislukt. Selecteer en kopieer de tekst handmatig.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Grotendeels in Europa',
      'mixed': 'Gemengd',
      'non-eu': 'Grotendeels buiten Europa',
      'depends': 'Afhankelijk van de opzet'
    },
    dimensions: {
      sales: 'Verkoop, support en diensten',
      rd: 'Engineering en R&D',
      ip: 'Intellectueel eigendom',
      infra: 'Beheer van de infrastructuur',
      profit: 'Winst en aandeelhoudersrendement',
      tax: 'Belastinggrondslag (vennootschapsbelasting)',
      law: 'Jurisdictie en zeggenschap',
      eco: 'Ecosysteem en vaardigheden'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Lokale verkoop-, support- en adviesteams zijn doorgaans in Europa in dienst.',
        rd: 'De productontwikkeling vindt vooral in Europa plaats en bouwt hier technische kennis op.',
        ip: 'Broncode, octrooien en knowhow zijn eigendom van een Europese entiteit.',
        infra: 'Draait op eigen infrastructuur van de leverancier of op andere door Europeanen beheerde infrastructuur — of op die van u.',
        profit: 'De winst komt toe aan een Europees bedrijf; dividenden gaan naar de aandeelhouders, die overal ter wereld kunnen zitten.',
        tax: 'Winst wordt in de regel belast waar het bedrijf gevestigd en actief is — hier, in Europa.',
        law: 'De leverancier en zijn moederbedrijf vallen in de eerste plaats onder Europees recht.',
        eco: 'De omzet financiert op termijn Europese banen, partners, start-ups en spin-offs.'
      },
      'eu-on-hyperscaler': {
        sales: 'Klantgerichte teams zijn meestal Europees.',
        rd: 'De applicatie zelf wordt in Europa ontwikkeld.',
        ip: 'Het intellectueel eigendom van de applicatie is Europees; dat van het onderliggende platform niet.',
        infra: 'Gegevens kunnen in EU-regio’s staan, maar de infrastructuur wordt beheerd door een niet-Europese aanbieder.',
        profit: 'Een deel van elke euro gaat naar platformkosten die bij de infrastructuuraanbieder terechtkomen.',
        tax: 'De leverancier betaalt belasting in Europa; het aandeel van de platformaanbieder wordt belast volgens diens eigen structuur.',
        law: 'De leverancier is Europees, maar zijn infrastructuuraanbieder kan onder niet-Europees recht met extraterritoriale werking vallen.',
        eco: 'Versterkt Europese softwarekennis, maar vergroot tegelijk de afhankelijkheid van een niet-Europees platform.'
      },
      'reseller': {
        sales: 'De reseller of integrator heeft lokaal personeel in dienst en houdt zijn marge in Europa.',
        rd: 'De kernontwikkeling van het product vindt plaats waar de leverancier zijn engineeringcentra heeft.',
        ip: 'Het intellectueel eigendom van het product ligt bij de niet-Europese leverancier.',
        infra: 'Hangt ervan af of het product on-premises draait of in de cloud van de leverancier.',
        profit: 'De marge van de reseller blijft lokaal; licentie- en abonnementsinkomsten gaan naar de leverancier.',
        tax: 'De reseller betaalt lokaal belasting; het aandeel van de leverancier wordt belast volgens diens bedrijfsstructuur.',
        law: 'Updates, licenties en de productroadmap worden bepaald door de leverancier en zijn thuisjurisdictie.',
        eco: 'Bouwt waardevolle lokale implementatiekennis op, maar geen vermogen om zelf producten te ontwikkelen.'
      },
      'global-with-eu-ops': {
        sales: 'Grote leveranciers hebben vaak veel mensen in Europa in dienst voor verkoop, support en operations.',
        rd: 'Sommige wereldwijde leveranciers hebben grote R&D-centra in Europa; kernbeslissingen worden meestal elders genomen.',
        ip: 'Het intellectueel eigendom ligt meestal bij het moederbedrijf of bij een IP-houdstermaatschappij buiten Europa.',
        infra: 'Er kunnen Europese datacenters worden gebruikt, maar die worden beheerd onder zeggenschap van het moederbedrijf.',
        profit: 'De winst komt uiteindelijk toe aan het moederbedrijf en zijn aandeelhouders.',
        tax: 'Europese dochterondernemingen betalen hier belasting; hoeveel winst in Europa wordt belast, hangt af van de bedrijfs- en verrekenprijsstructuur.',
        law: 'Het moederbedrijf blijft onderworpen aan zijn thuisjurisdictie, die extraterritoriale werking kan claimen.',
        eco: 'Schept Europese banen en vaardigheden, terwijl strategisch vermogen op het hoofdkantoor geconcentreerd blijft.'
      },
      'open-source-eu-integrator': {
        sales: 'Support, integratie en hosting worden ingekocht bij Europese dienstverleners.',
        rd: 'De ontwikkeling kan wereldwijd of Europees zijn; ga na wie de code daadwerkelijk onderhoudt.',
        ip: 'Een open licentie staat iedereen toe de code te gebruiken, in te zien en te forken — zeggenschap weegt zwaarder dan eigendom.',
        infra: 'U of een Europese aanbieder draait de software op infrastructuur naar uw keuze.',
        profit: 'De omzet uit diensten blijft grotendeels bij Europese aanbieders.',
        tax: 'Dienstverleners worden belast waar zij actief zijn.',
        law: 'Een open licentie kan niet door een buitenlandse overheid worden ingetrokken; u hebt zelf zeggenschap over de implementatie.',
        eco: 'Financiert Europese maintainers en aanbieders — als u daadwerkelijk bijdraagt of voor support betaalt.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Beantwoorde vragen: {done} van {total}',
    markdownTitle: 'Checklist digitale soevereiniteit bij inkoop',
    markdownSource: 'Bron'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Alle vermeldingen worden getoond (totaal: {total})',
    showingSome: 'Getoonde vermeldingen: {shown} van {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'LAGE SOEVEREINITEITSRELEVANTIE',
        text: 'Technologische soevereiniteit zal voor dit systeem waarschijnlijk geen doorslaggevende factor zijn. Beoordeel het op de gebruikelijke criteria — beveiliging, kwaliteit, kosten, support — en leg basale exitmogelijkheden (gegevensexport, open standaarden) vast in het contract.'
      },
      medium: {
        label: 'GEMIDDELDE SOEVEREINITEITSRELEVANTIE',
        text: 'Soevereiniteit is een relevant nevencriterium. Neem de jurisdictie van de leverancier, de overdraagbaarheid van gegevens en exitmogelijkheden mee in de beoordeling, en overweeg Europese opties waar die concurrerend zijn.'
      },
      high: {
        label: 'HOGE SOEVEREINITEITSRELEVANTIE',
        text: 'Afhankelijkheid van deze leverancier kan wezenlijke gevolgen hebben voor uw organisatie. Maak soevereiniteit een expliciet onderdeel van de risicobeoordeling: leg jurisdictie en eigendom vast, eis waar mogelijk on-premises of offline gebruik, borg de export van gegevens en configuratie, en beoordeel actief Europese of open-source alternatieven.'
      },
      strategic: {
        label: 'STRATEGISCHE TECHNOLOGIE',
        text: 'Dit systeem combineert groot belang met aanzienlijke afhankelijkheid. Behandel het als strategische technologie: betrek het management en de CISO, beoordeel geopolitieke en juridische scenario’s (sancties, exportbeperkingen, overname, terugtrekking uit de cloud), ontwerp een getest exit- of continuïteitsplan, en geef Europese en open alternatieven serieuze, gedocumenteerde aandacht.'
      }
    },
    rules: {
      strategicCritical: 'Het systeem maakt deel uit van kritieke infrastructuur of OT, is operationeel belangrijk en vertoont drie of meer afhankelijkheidsfactoren.',
      strategicFiveFive: 'Vijf of meer belangfactoren in combinatie met vijf of meer afhankelijkheidsfactoren.',
      highCritical: 'Context van kritieke infrastructuur of OT in combinatie met ten minste één afhankelijkheidsfactor.',
      highThreeTwo: 'Drie of meer belangfactoren in combinatie met twee of meer afhankelijkheidsfactoren.',
      highSecurity: 'Een beveiligingsmaatregel met drie of meer afhankelijkheidsfactoren.',
      medium: 'Enig belang en enige afhankelijkheid, maar niet genoeg om de hoge drempel te halen.',
      low: 'Weinig belangfactoren en/of weinig afhankelijkheidsfactoren.'
    },
    missingTitle: 'Beantwoord alstublieft alle vragen.',
    missingCount: 'Onbeantwoorde vragen: {n}. Als u het antwoord niet weet, kies dan “Weet ik niet”.',
    unclear: 'Onduidelijk: {reason}',
    outcome: 'Uitkomst',
    meter: ['Laag', 'Gemiddeld', 'Hoog', 'Strategisch'],
    why: 'Waarom deze indeling?',
    importance: 'Belangfactoren ({n})',
    dependency: 'Afhankelijkheidsfactoren ({n})',
    mitigating: 'Mitigerende factoren',
    openQuestions: 'Open vragen om met de leverancier op te helderen',
    none: 'Geen vastgesteld.',
    disclaimer: 'Deze uitkomst volgt uit de hieronder gepubliceerde regels. Het is geen wetenschappelijke score en vervangt geen formele risicobeoordeling.',
    copyMarkdown: 'Kopiëren als Markdown',
    copyLink: 'Deelbare link kopiëren',
    print: 'Afdrukken / opslaan als pdf',
    md: {
      title: 'Toets technologische soevereiniteit',
      outcome: 'Uitkomst',
      rule: 'Toegepaste regel',
      importance: 'Belangfactoren',
      dependency: 'Afhankelijkheidsfactoren',
      mitigating: 'Mitigerende factoren',
      open: 'Open vragen',
      none: 'Geen vastgesteld',
      footer: 'Gemaakt met de Toets technologische soevereiniteit ({url}). Geen wetenschappelijke score.'
    }
  }
};
