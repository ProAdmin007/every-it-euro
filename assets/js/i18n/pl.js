/*
 * Every IT Euro — interface strings used by the JavaScript tools (Polish / Polski).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 * Count strings are phrased so that they are grammatical for any number (Polish plural forms vary).
 */
window.EveryItEuroStrings = {
  copied: 'Skopiowano do schowka.',
  copyFailed: 'Kopiowanie nie powiodło się. Zaznacz i skopiuj tekst ręcznie.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Głównie w Europie',
      'mixed': 'Mieszane',
      'non-eu': 'Głównie poza Europą',
      'depends': 'Zależy od konfiguracji'
    },
    dimensions: {
      sales: 'Sprzedaż, wsparcie i usługi',
      rd: 'Inżynieria oraz B+R',
      ip: 'Własność intelektualna',
      infra: 'Eksploatacja infrastruktury',
      profit: 'Zyski i zwrot dla akcjonariuszy',
      tax: 'Podstawa opodatkowania',
      law: 'Jurysdykcja i kontrola',
      eco: 'Ekosystem i kompetencje'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Lokalne zespoły sprzedaży, wsparcia i doradztwa są zazwyczaj zatrudnione w Europie.',
        rd: 'Rozwój produktu odbywa się głównie w Europie, co buduje tu zaplecze inżynierskie.',
        ip: 'Kod źródłowy, patenty i know-how należą do podmiotu europejskiego.',
        infra: 'Działa na infrastrukturze własnej dostawcy lub innej infrastrukturze eksploatowanej w Europie albo na Twojej.',
        profit: 'Zyski trafiają do europejskiej firmy; dywidendy otrzymują jej akcjonariusze, którzy mogą mieć siedzibę w dowolnym miejscu.',
        tax: 'Zyski są co do zasady opodatkowane tam, gdzie firma ma rezydencję i prowadzi działalność — czyli tutaj, w Europie.',
        law: 'Dostawca i jego spółka dominująca podlegają przede wszystkim prawu europejskiemu.',
        eco: 'Przychody z czasem finansują zatrudnienie w Europie, partnerów, start-upy i spin-offy.'
      },
      'eu-on-hyperscaler': {
        sales: 'Zespoły obsługujące klientów są zazwyczaj europejskie.',
        rd: 'Sama aplikacja jest rozwijana w Europie.',
        ip: 'Własność intelektualna aplikacji jest europejska; własność intelektualna platformy bazowej — nie.',
        infra: 'Dane mogą znajdować się w regionach UE, ale infrastrukturę eksploatuje dostawca spoza Europy.',
        profit: 'Część każdego euro idzie na opłaty za platformę, które trafiają do dostawcy infrastruktury.',
        tax: 'Dostawca płaci podatki w Europie; udział dostawcy platformy jest opodatkowany zgodnie z jego własną strukturą.',
        law: 'Dostawca jest europejski, ale jego dostawca infrastruktury może podlegać prawu spoza Europy o zasięgu eksterytorialnym.',
        eco: 'Wzmacnia europejskie kompetencje programistyczne, a jednocześnie pogłębia zależność od platformy spoza Europy.'
      },
      'reseller': {
        sales: 'Odsprzedawca lub integrator zatrudnia lokalny personel i zatrzymuje swoją marżę w Europie.',
        rd: 'Główne prace rozwojowe nad produktem odbywają się tam, gdzie producent ma swoje centra inżynieryjne.',
        ip: 'Własność intelektualna produktu należy do producenta spoza Europy.',
        infra: 'Zależy od tego, czy produkt działa lokalnie (on-premises), czy w chmurze producenta.',
        profit: 'Marża odsprzedawcy zostaje na miejscu; przychody z licencji i subskrypcji trafiają do producenta.',
        tax: 'Odsprzedawca płaci podatki lokalnie; udział producenta jest opodatkowany zgodnie z jego strukturą korporacyjną.',
        law: 'Aktualizacje, licencjonowanie i plan rozwoju produktu kontroluje producent i jego macierzysta jurysdykcja.',
        eco: 'Buduje cenne lokalne kompetencje wdrożeniowe, ale nie zdolność do rozwijania produktów.'
      },
      'global-with-eu-ops': {
        sales: 'Duzi dostawcy często zatrudniają w Europie wiele osób w sprzedaży, wsparciu i eksploatacji.',
        rd: 'Niektórzy globalni dostawcy prowadzą w Europie znaczące centra B+R; kluczowe decyzje zapadają jednak zwykle gdzie indziej.',
        ip: 'Własność intelektualna należy zwykle do spółki dominującej lub podmiotu zarządzającego własnością intelektualną poza Europą.',
        infra: 'Mogą być wykorzystywane europejskie centra danych, ale są one eksploatowane pod kontrolą spółki dominującej.',
        profit: 'Zyski ostatecznie trafiają do spółki dominującej i jej akcjonariuszy.',
        tax: 'Europejskie spółki zależne płacą podatki tutaj; to, jaka część zysku jest opodatkowana w Europie, zależy od struktury korporacyjnej i cen transferowych.',
        law: 'Spółka dominująca nadal podlega swojej macierzystej jurysdykcji, która może rościć sobie zasięg eksterytorialny.',
        eco: 'Tworzy miejsca pracy i kompetencje w Europie, natomiast zdolności strategiczne koncentrują się w centrali.'
      },
      'open-source-eu-integrator': {
        sales: 'Wsparcie, integracja i hosting są kupowane od europejskich usługodawców.',
        rd: 'Rozwój może być globalny lub europejski; warto sprawdzić, kto faktycznie utrzymuje kod.',
        ip: 'Otwarta licencja pozwala każdemu używać kodu, analizować go i tworzyć jego forki — kontrola ma większe znaczenie niż własność.',
        infra: 'Oprogramowanie uruchamiasz Ty lub europejski usługodawca na wybranej przez Ciebie infrastrukturze.',
        profit: 'Przychody z usług pozostają w dużej mierze u europejskich usługodawców.',
        tax: 'Usługodawcy są opodatkowani tam, gdzie prowadzą działalność.',
        law: 'Otwartej licencji nie może cofnąć zagraniczny organ; to Ty kontrolujesz wdrożenie.',
        eco: 'Finansuje europejskich opiekunów projektów i usługodawców — o ile rzeczywiście wnosisz wkład lub płacisz za wsparcie.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Pytania z odpowiedzią: {done} z {total}',
    markdownTitle: 'Lista kontrolna zakupów pod kątem suwerenności cyfrowej',
    markdownSource: 'Źródło'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Wyświetlane są wszystkie wpisy (łącznie: {total})',
    showingSome: 'Wyświetlane wpisy: {shown} z {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'NISKIE ZNACZENIE SUWERENNOŚCI',
        text: 'Suwerenność technologiczna raczej nie będzie czynnikiem rozstrzygającym w przypadku tego systemu. Należy go ocenić według zwykłych kryteriów — bezpieczeństwa, jakości, kosztów, wsparcia — i zachować w umowie podstawowe możliwości wyjścia (eksport danych, otwarte standardy).'
      },
      medium: {
        label: 'ŚREDNIE ZNACZENIE SUWERENNOŚCI',
        text: 'Suwerenność jest istotnym kryterium drugorzędnym. W ocenie należy uwzględnić jurysdykcję dostawcy, przenoszalność danych i możliwości wyjścia, a także rozważyć opcje europejskie tam, gdzie są konkurencyjne.'
      },
      high: {
        label: 'WYSOKIE ZNACZENIE SUWERENNOŚCI',
        text: 'Zależność od tego dostawcy może w istotny sposób wpłynąć na Twoją organizację. Suwerenność powinna być wyraźną częścią oceny ryzyka: należy udokumentować jurysdykcję i strukturę własności, wymagać działania lokalnego (on-premises) lub offline tam, gdzie to możliwe, zapewnić eksport danych i konfiguracji oraz aktywnie oceniać europejskie lub otwartoźródłowe alternatywy.'
      },
      strategic: {
        label: 'TECHNOLOGIA STRATEGICZNA',
        text: 'Ten system łączy duże znaczenie ze znaczną zależnością. Należy traktować go jako technologię strategiczną: zaangażować kierownictwo i CISO, przeanalizować scenariusze geopolityczne i prawne (sankcje, ograniczenia eksportowe, przejęcie, wycofanie usługi chmurowej), opracować przetestowany plan wyjścia lub ciągłości działania oraz poważnie i w udokumentowany sposób rozważyć alternatywy europejskie i otwarte.'
      }
    },
    rules: {
      strategicCritical: 'System jest częścią infrastruktury krytycznej lub OT, ma duże znaczenie operacyjne i wykazuje co najmniej trzy czynniki zależności.',
      strategicFiveFive: 'Co najmniej pięć czynników znaczenia w połączeniu z co najmniej pięcioma czynnikami zależności.',
      highCritical: 'Kontekst infrastruktury krytycznej lub OT w połączeniu z co najmniej jednym czynnikiem zależności.',
      highThreeTwo: 'Co najmniej trzy czynniki znaczenia w połączeniu z co najmniej dwoma czynnikami zależności.',
      highSecurity: 'Mechanizm bezpieczeństwa z co najmniej trzema czynnikami zależności.',
      medium: 'Pewne znaczenie i pewna zależność, ale za mało, by osiągnąć próg wysokiego poziomu.',
      low: 'Niewiele czynników znaczenia i/lub niewiele czynników zależności.'
    },
    missingTitle: 'Odpowiedz na wszystkie pytania.',
    missingCount: 'Liczba pytań bez odpowiedzi: {n}. Jeśli nie znasz odpowiedzi, wybierz „Nie wiem”.',
    unclear: 'Niejasne: {reason}',
    outcome: 'Wynik',
    meter: ['Niskie', 'Średnie', 'Wysokie', 'Strategiczne'],
    why: 'Skąd taka klasyfikacja?',
    importance: 'Czynniki znaczenia ({n})',
    dependency: 'Czynniki zależności ({n})',
    mitigating: 'Czynniki łagodzące',
    openQuestions: 'Otwarte kwestie do wyjaśnienia z dostawcą',
    none: 'Nie zidentyfikowano.',
    disclaimer: 'Ten wynik wynika z opublikowanych poniżej reguł. Nie jest to ocena naukowa i nie zastępuje formalnej oceny ryzyka.',
    copyMarkdown: 'Kopiuj jako Markdown',
    copyLink: 'Kopiuj link do udostępnienia',
    print: 'Drukuj / zapisz jako PDF',
    md: {
      title: 'Ocena suwerenności technologicznej',
      outcome: 'Wynik',
      rule: 'Zastosowana reguła',
      importance: 'Czynniki znaczenia',
      dependency: 'Czynniki zależności',
      mitigating: 'Czynniki łagodzące',
      open: 'Otwarte kwestie',
      none: 'Nie zidentyfikowano',
      footer: 'Wygenerowano za pomocą narzędzia Ocena suwerenności technologicznej ({url}). To nie jest ocena naukowa.'
    }
  }
};
