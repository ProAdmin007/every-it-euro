/*
 * Every IT Euro — interface strings used by the JavaScript tools (French).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStrings = {
  copied: 'Copié dans le presse-papiers.',
  copyFailed: 'La copie a échoué. Veuillez sélectionner et copier le texte manuellement.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Surtout en Europe',
      'mixed': 'Mixte',
      'non-eu': 'Surtout hors d’Europe',
      'depends': 'Selon la configuration'
    },
    dimensions: {
      sales: 'Ventes, support et services',
      rd: 'Ingénierie et R&D',
      ip: 'Propriété intellectuelle',
      infra: 'Exploitation de l’infrastructure',
      profit: 'Bénéfices et rémunération des actionnaires',
      tax: 'Assiette de l’impôt sur les sociétés',
      law: 'Juridiction et contrôle',
      eco: 'Écosystème et compétences'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Les équipes locales de vente, de support et de conseil sont généralement employées en Europe.',
        rd: 'Le développement des produits a lieu principalement en Europe, ce qui y renforce l’expertise en ingénierie.',
        ip: 'Le code source, les brevets et le savoir-faire appartiennent à une entité européenne.',
        infra: 'Fonctionne sur l’infrastructure du fournisseur ou sur une autre infrastructure exploitée en Europe, ou sur la vôtre.',
        profit: 'Les bénéfices reviennent à une entreprise européenne  les dividendes vont à ses actionnaires, qui peuvent se trouver n’importe où.',
        tax: 'Les bénéfices sont en général imposés là où l’entreprise a sa résidence et ses activités — ici, en Europe.',
        law: 'Le fournisseur et sa société mère relèvent principalement du droit européen.',
        eco: 'Au fil du temps, le chiffre d’affaires finance des recrutements, des partenaires, des start-up et des essaimages européens.'
      },
      'eu-on-hyperscaler': {
        sales: 'Les équipes en contact avec les clients sont généralement européennes.',
        rd: 'L’application elle-même est développée en Europe.',
        ip: 'La propriété intellectuelle de l’application est européenne  celle de la plateforme sous-jacente ne l’est pas.',
        infra: 'Les données peuvent se trouver dans des régions de l’UE, mais l’infrastructure est exploitée par un fournisseur non européen.',
        profit: 'Une partie de chaque euro paie des frais de plateforme qui reviennent au fournisseur d’infrastructure.',
        tax: 'L’éditeur paie des impôts en Europe  la part du fournisseur de la plateforme est imposée selon sa propre structure.',
        law: 'L’éditeur est européen, mais son fournisseur d’infrastructure peut relever d’un droit non européen à portée extraterritoriale.',
        eco: 'Renforce les compétences logicielles européennes, tout en accroissant la dépendance à une plateforme non européenne.'
      },
      'reseller': {
        sales: 'Le revendeur ou l’intégrateur emploie du personnel local et conserve sa marge en Europe.',
        rd: 'Le développement du produit de base a lieu là où l’éditeur a ses centres d’ingénierie.',
        ip: 'La propriété intellectuelle du produit appartient à l’éditeur non européen.',
        infra: 'Dépend de l’exploitation du produit sur site ou dans le cloud de l’éditeur.',
        profit: 'La marge du revendeur reste locale  les revenus des licences et abonnements vont à l’éditeur.',
        tax: 'Le revendeur paie ses impôts localement  la part de l’éditeur est imposée selon sa structure d’entreprise.',
        law: 'Les mises à jour, les licences et la feuille de route du produit sont contrôlées par l’éditeur et par la juridiction de son pays d’origine.',
        eco: 'Développe de précieuses compétences locales de mise en œuvre, mais pas de capacité de développement de produits.'
      },
      'global-with-eu-ops': {
        sales: 'Les grands éditeurs emploient souvent de nombreuses personnes en Europe dans la vente, le support et l’exploitation.',
        rd: 'Certains éditeurs mondiaux disposent d’importants centres de R&D en Europe  les décisions essentielles sont généralement prises ailleurs.',
        ip: 'La propriété intellectuelle est généralement détenue par la société mère ou par une entité de détention de PI hors d’Europe.',
        infra: 'Des centres de données européens peuvent être utilisés, mais ils sont exploités sous le contrôle de la société mère.',
        profit: 'Les bénéfices reviennent en fin de compte à la société mère et à ses actionnaires.',
        tax: 'Les filiales européennes paient des impôts ici  la part des bénéfices imposée en Europe dépend de la structure de l’entreprise et de ses prix de transfert.',
        law: 'La société mère reste soumise à la juridiction de son pays d’origine, qui peut revendiquer une portée extraterritoriale.',
        eco: 'Crée des emplois et des compétences en Europe, tandis que la capacité stratégique reste concentrée au siège.'
      },
      'open-source-eu-integrator': {
        sales: 'Le support, l’intégration et l’hébergement sont achetés auprès de prestataires européens.',
        rd: 'Le développement peut être mondial ou européen  vérifiez qui maintient réellement le code.',
        ip: 'Une licence libre permet à chacun d’utiliser, d’examiner et de forker le code — le contrôle compte davantage que la propriété.',
        infra: 'Vous-même ou un prestataire européen exploitez le logiciel sur l’infrastructure de votre choix.',
        profit: 'Les revenus des services restent en grande partie chez des prestataires européens.',
        tax: 'Les prestataires de services sont imposés là où ils exercent leurs activités.',
        law: 'Une licence libre ne peut pas être retirée par une autorité étrangère  vous contrôlez le déploiement.',
        eco: 'Finance des mainteneurs et des prestataires européens — à condition que vous contribuiez réellement ou que vous payiez pour le support.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Questions traitées : {done} sur {total}',
    markdownTitle: 'Liste de contrôle souveraineté numérique pour les achats',
    markdownSource: 'Source'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Entrées affichées : {total} (toutes)',
    showingSome: 'Entrées affichées : {shown} sur {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'PERTINENCE FAIBLE EN MATIÈRE DE SOUVERAINETÉ',
        text: 'La souveraineté technologique ne sera probablement pas un facteur décisif pour ce système. Évaluez-le selon les critères habituels — sécurité, qualité, coût, support — et conservez dans le contrat des options de sortie de base (export des données, standards ouverts).'
      },
      medium: {
        label: 'PERTINENCE MOYENNE EN MATIÈRE DE SOUVERAINETÉ',
        text: 'La souveraineté est un critère secondaire pertinent. Intégrez à l’évaluation la juridiction du fournisseur, la portabilité des données et les options de sortie, et envisagez des options européennes lorsqu’elles sont compétitives.'
      },
      high: {
        label: 'PERTINENCE ÉLEVÉE EN MATIÈRE DE SOUVERAINETÉ',
        text: 'La dépendance à ce fournisseur pourrait affecter sensiblement votre organisation. Faites de la souveraineté un élément explicite de l’analyse de risques : documentez la juridiction et la propriété, exigez un fonctionnement sur site ou hors ligne lorsque c’est possible, garantissez l’export des données et de la configuration, et évaluez activement des alternatives européennes ou open source.'
      },
      strategic: {
        label: 'TECHNOLOGIE STRATÉGIQUE',
        text: 'Ce système associe une importance élevée à une dépendance significative. Traitez-le comme une technologie stratégique : impliquez la direction et le RSSI, évaluez les scénarios géopolitiques et juridiques (sanctions, restrictions à l’exportation, rachat, retrait du cloud), concevez un plan de sortie ou de continuité testé, et accordez aux alternatives européennes et ouvertes un examen sérieux et documenté.'
      }
    },
    rules: {
      strategicCritical: 'Le système fait partie d’une infrastructure critique ou de l’OT, il est important pour l’exploitation et présente au moins trois facteurs de dépendance.',
      strategicFiveFive: 'Au moins cinq facteurs d’importance combinés à au moins cinq facteurs de dépendance.',
      highCritical: 'Contexte d’infrastructure critique ou d’OT combiné à au moins un facteur de dépendance.',
      highThreeTwo: 'Au moins trois facteurs d’importance combinés à au moins deux facteurs de dépendance.',
      highSecurity: 'Une mesure de sécurité présentant au moins trois facteurs de dépendance.',
      medium: 'Une certaine importance et une certaine dépendance, mais pas assez pour atteindre le seuil élevé.',
      low: 'Peu de facteurs d’importance et/ou peu de facteurs de dépendance.'
    },
    missingTitle: 'Veuillez répondre à toutes les questions.',
    missingCount: 'Questions sans réponse : {n}. Si vous ne connaissez pas la réponse, choisissez « Je ne sais pas ».',
    unclear: 'Incertain : {reason}',
    outcome: 'Résultat',
    meter: ['Faible', 'Moyenne', 'Élevée', 'Stratégique'],
    why: 'Pourquoi cette classification ',
    importance: 'Facteurs d’importance ({n})',
    dependency: 'Facteurs de dépendance ({n})',
    mitigating: 'Facteurs atténuants',
    openQuestions: 'Questions à éclaircir avec le fournisseur',
    none: 'Aucun identifié.',
    disclaimer: 'Ce résultat découle des règles publiées ci-dessous. Il ne s’agit pas d’un score scientifique et il ne remplace pas une analyse de risques formelle.',
    copyMarkdown: 'Copier au format Markdown',
    copyLink: 'Copier le lien de partage',
    print: 'Imprimer / enregistrer en PDF',
    md: {
      title: 'Évaluation de la souveraineté technologique',
      outcome: 'Résultat',
      rule: 'Règle appliquée',
      importance: 'Facteurs d’importance',
      dependency: 'Facteurs de dépendance',
      mitigating: 'Facteurs atténuants',
      open: 'Questions ouvertes',
      none: 'Aucun identifié',
      footer: 'Généré avec l’Évaluation de la souveraineté technologique ({url}). Il ne s’agit pas d’un score scientifique.'
    }
  }
};
