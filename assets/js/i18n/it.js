/*
 * Every IT Euro — interface strings used by the JavaScript tools (Italian / Italiano).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStrings = {
  copied: 'Copiato negli appunti.',
  copyFailed: 'Copia non riuscita. Selezionare e copiare il testo manualmente.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Prevalentemente in Europa',
      'mixed': 'Misto',
      'non-eu': 'Prevalentemente fuori dall’Europa',
      'depends': 'Dipende dalla configurazione'
    },
    dimensions: {
      sales: 'Vendite, assistenza e servizi',
      rd: 'Ingegneria e R&S',
      ip: 'Proprietà intellettuale',
      infra: 'Gestione dell’infrastruttura',
      profit: 'Utili e remunerazione degli azionisti',
      tax: 'Base imponibile societaria',
      law: 'Giurisdizione e controllo',
      eco: 'Ecosistema e competenze'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'I team locali di vendita, assistenza e consulenza sono in genere impiegati in Europa.',
        rd: 'Lo sviluppo del prodotto avviene principalmente in Europa e costruisce qui competenze ingegneristiche approfondite.',
        ip: 'Codice sorgente, brevetti e know-how appartengono a un soggetto europeo.',
        infra: 'Funziona sull’infrastruttura del fornitore stesso o di altri operatori europei, oppure sulla vostra.',
        profit: 'Gli utili spettano a un’azienda europea; i dividendi vanno ai suoi azionisti, che possono trovarsi ovunque.',
        tax: 'Gli utili sono di norma tassati dove l’azienda ha sede e opera: qui, in Europa.',
        law: 'Il fornitore e la sua capogruppo sono soggetti principalmente al diritto europeo.',
        eco: 'Nel tempo, i ricavi finanziano assunzioni, partner, start-up e spin-off europei.'
      },
      'eu-on-hyperscaler': {
        sales: 'I team a contatto con i clienti sono di solito europei.',
        rd: 'L’applicazione in sé è sviluppata in Europa.',
        ip: 'La proprietà intellettuale dell’applicazione è europea; quella della piattaforma sottostante no.',
        infra: 'I dati possono risiedere in regioni dell’UE, ma l’infrastruttura è gestita da un fornitore non europeo.',
        profit: 'Una parte di ogni euro paga canoni di piattaforma che confluiscono al fornitore dell’infrastruttura.',
        tax: 'Il fornitore paga le imposte in Europa; la quota del fornitore della piattaforma è tassata secondo la struttura di quest’ultimo.',
        law: 'Il fornitore è europeo, ma il suo fornitore di infrastruttura può essere soggetto a leggi non europee con portata extraterritoriale.',
        eco: 'Rafforza le competenze software europee, ma accentua la dipendenza da una piattaforma non europea.'
      },
      'reseller': {
        sales: 'Il rivenditore o integratore impiega personale locale e trattiene il proprio margine in Europa.',
        rd: 'Lo sviluppo del prodotto principale avviene ovunque il produttore abbia i propri centri di ingegneria.',
        ip: 'La proprietà intellettuale del prodotto appartiene al produttore non europeo.',
        infra: 'Dipende dal fatto che il prodotto funzioni on-premises o nel cloud del produttore.',
        profit: 'Il margine del rivenditore resta sul territorio; i ricavi da licenze e abbonamenti vanno al produttore.',
        tax: 'Il rivenditore paga le imposte localmente; la quota del produttore è tassata secondo la sua struttura societaria.',
        law: 'Aggiornamenti, licenze e roadmap del prodotto sono controllati dal produttore e dalla sua giurisdizione di origine.',
        eco: 'Sviluppa preziose competenze locali di implementazione, ma non capacità di sviluppo del prodotto.'
      },
      'global-with-eu-ops': {
        sales: 'I grandi fornitori impiegano spesso molte persone in Europa nelle vendite, nell’assistenza e nelle operazioni.',
        rd: 'Alcuni fornitori globali gestiscono importanti centri di R&S in Europa; le decisioni chiave vengono però di solito prese altrove.',
        ip: 'La proprietà intellettuale è di norma detenuta dalla capogruppo o da una società titolare di PI al di fuori dell’Europa.',
        infra: 'Possono essere utilizzati data center europei, ma gestiti sotto il controllo della capogruppo.',
        profit: 'Gli utili spettano in ultima istanza alla capogruppo e ai suoi azionisti.',
        tax: 'Le controllate europee pagano le imposte qui; la quota di utili tassata in Europa dipende dalla struttura societaria e dai prezzi di trasferimento.',
        law: 'La capogruppo resta soggetta alla giurisdizione del proprio paese d’origine, che può rivendicare una portata extraterritoriale.',
        eco: 'Crea posti di lavoro e competenze in Europa, mentre la capacità strategica resta concentrata presso la sede centrale.'
      },
      'open-source-eu-integrator': {
        sales: 'Assistenza, integrazione e hosting vengono acquistati da fornitori di servizi europei.',
        rd: 'Lo sviluppo può essere globale o europeo; occorre verificare chi effettivamente mantiene il codice.',
        ip: 'Una licenza aperta consente a chiunque di usare, ispezionare e ramificare (fork) il codice: conta più il controllo che la proprietà.',
        infra: 'Il software è gestito da voi o da un fornitore europeo, su un’infrastruttura di vostra scelta.',
        profit: 'I ricavi da servizi restano in larga parte presso fornitori europei.',
        tax: 'I fornitori di servizi sono tassati dove operano.',
        law: 'Una licenza aperta non può essere revocata da un’autorità straniera; il controllo dell’installazione resta a voi.',
        eco: 'Finanzia manutentori e fornitori europei, a condizione di contribuire effettivamente o di pagare l’assistenza.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Domande con risposta: {done} su {total}',
    markdownTitle: 'Checklist per acquisti orientati alla sovranità digitale',
    markdownSource: 'Fonte'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Voci visualizzate: tutte ({total})',
    showingSome: 'Voci visualizzate: {shown} su {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'RILEVANZA BASSA PER LA SOVRANITÀ',
        text: 'È improbabile che la sovranità tecnologica sia un fattore decisivo per questo sistema. Valutarlo in base ai consueti criteri (sicurezza, qualità, costi, assistenza) e mantenere nel contratto opzioni di uscita di base (esportazione dei dati, standard aperti).'
      },
      medium: {
        label: 'RILEVANZA MEDIA PER LA SOVRANITÀ',
        text: 'La sovranità è un criterio secondario rilevante. Includere nella valutazione la giurisdizione del fornitore, la portabilità dei dati e le opzioni di uscita, e prendere in considerazione le opzioni europee laddove siano competitive.'
      },
      high: {
        label: 'RILEVANZA ALTA PER LA SOVRANITÀ',
        text: 'La dipendenza da questo fornitore potrebbe incidere in modo sostanziale sulla vostra organizzazione. Rendere la sovranità una componente esplicita della valutazione dei rischi: documentare giurisdizione e assetto proprietario, richiedere il funzionamento on-premises o offline ove possibile, garantire l’esportazione di dati e configurazioni e valutare attivamente alternative europee o open source.'
      },
      strategic: {
        label: 'TECNOLOGIA STRATEGICA',
        text: 'Questo sistema unisce un’elevata importanza a una dipendenza significativa. Trattarlo come tecnologia strategica: coinvolgere la direzione e il CISO, valutare scenari geopolitici e giuridici (sanzioni, restrizioni all’esportazione, acquisizioni, ritiro del servizio cloud), predisporre un piano di uscita o di continuità collaudato e prendere in seria considerazione, documentandola, le alternative europee e aperte.'
      }
    },
    rules: {
      strategicCritical: 'Il sistema fa parte di un’infrastruttura critica o dell’OT, è importante dal punto di vista operativo e presenta tre o più fattori di dipendenza.',
      strategicFiveFive: 'Cinque o più fattori di importanza combinati con cinque o più fattori di dipendenza.',
      highCritical: 'Contesto di infrastruttura critica o OT combinato con almeno un fattore di dipendenza.',
      highThreeTwo: 'Tre o più fattori di importanza combinati con due o più fattori di dipendenza.',
      highSecurity: 'Un controllo di sicurezza con tre o più fattori di dipendenza.',
      medium: 'Una certa importanza e una certa dipendenza, ma non sufficienti a raggiungere la soglia alta.',
      low: 'Pochi fattori di importanza e/o pochi fattori di dipendenza.'
    },
    missingTitle: 'Rispondere a tutte le domande.',
    missingCount: 'Domande senza risposta: {n}. Se non si conosce la risposta, scegliere «Non so».',
    unclear: 'Non chiaro: {reason}',
    outcome: 'Esito',
    meter: ['Bassa', 'Media', 'Alta', 'Strategica'],
    why: 'Perché questa classificazione?',
    importance: 'Fattori di importanza ({n})',
    dependency: 'Fattori di dipendenza ({n})',
    mitigating: 'Fattori di mitigazione',
    openQuestions: 'Questioni aperte da chiarire con il fornitore',
    none: 'Nessuno individuato.',
    disclaimer: 'Questo esito segue le regole pubblicate qui sotto. Non è un punteggio scientifico e non sostituisce una valutazione formale dei rischi.',
    copyMarkdown: 'Copia come Markdown',
    copyLink: 'Copia link condivisibile',
    print: 'Stampa / salva come PDF',
    md: {
      title: 'Valutazione della sovranità tecnologica',
      outcome: 'Esito',
      rule: 'Regola applicata',
      importance: 'Fattori di importanza',
      dependency: 'Fattori di dipendenza',
      mitigating: 'Fattori di mitigazione',
      open: 'Questioni aperte',
      none: 'Nessuno individuato',
      footer: 'Generato con la Valutazione della sovranità tecnologica ({url}). Non è un punteggio scientifico.'
    }
  }
};
