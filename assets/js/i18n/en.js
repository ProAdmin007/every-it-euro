/*
 * Every IT Euro — interface strings used by the JavaScript tools (English).
 * Always loaded first. Translations live next to this file (de.js, fr.js, …), use the same keys and
 * override these texts; any key missing from a translation falls back to the English text here.
 * Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStringsEn = {
  copied: 'Copied to clipboard.',
  copyFailed: 'Copying failed. Please select and copy the text manually.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Largely in Europe',
      'mixed': 'Mixed',
      'non-eu': 'Largely outside Europe',
      'depends': 'Depends on the set-up'
    },
    dimensions: {
      sales: 'Sales, support and services',
      rd: 'Engineering and R&D',
      ip: 'Intellectual property',
      infra: 'Infrastructure operation',
      profit: 'Profits and shareholder returns',
      tax: 'Corporate tax base',
      law: 'Jurisdiction and control',
      eco: 'Ecosystem and skills'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Local sales, support and consulting teams are typically employed in Europe.',
        rd: 'Product development happens mainly in Europe, building engineering depth here.',
        ip: 'Source code, patents and know-how are owned by a European entity.',
        infra: 'Runs on the vendor’s own or other European-operated infrastructure, or on yours.',
        profit: 'Profits accrue to a European company; dividends go to its shareholders, who may be located anywhere.',
        tax: 'Profits are generally taxed where the company is resident and operates — here, in Europe.',
        law: 'The supplier and its parent are subject primarily to European law.',
        eco: 'Revenue funds European hiring, partners, start-ups and spin-offs over time.'
      },
      'eu-on-hyperscaler': {
        sales: 'Customer-facing teams are usually European.',
        rd: 'The application itself is developed in Europe.',
        ip: 'The application IP is European; the underlying platform IP is not.',
        infra: 'Data may sit in EU regions, but the infrastructure is operated by a non-European provider.',
        profit: 'Part of every euro pays platform fees that flow to the infrastructure provider.',
        tax: 'The vendor pays tax in Europe; the platform provider’s share is taxed according to its own structure.',
        law: 'The vendor is European, but its infrastructure provider may be subject to non-European law with extraterritorial reach.',
        eco: 'Strengthens European software skills, while deepening reliance on a non-European platform.'
      },
      'reseller': {
        sales: 'The reseller or integrator employs local staff and keeps its margin in Europe.',
        rd: 'Core product development takes place wherever the vendor has its engineering centres.',
        ip: 'The product IP is owned by the non-European vendor.',
        infra: 'Depends on whether the product runs on-premises or in the vendor’s cloud.',
        profit: 'The reseller margin stays local; licence and subscription revenue goes to the vendor.',
        tax: 'The reseller pays tax locally; the vendor’s share is taxed according to its corporate structure.',
        law: 'Updates, licensing and product roadmap are controlled by the vendor and its home jurisdiction.',
        eco: 'Builds valuable local implementation skills, but not product-development capability.'
      },
      'global-with-eu-ops': {
        sales: 'Large vendors often employ many people in Europe in sales, support and operations.',
        rd: 'Some global vendors run significant R&D centres in Europe; core decisions are usually taken elsewhere.',
        ip: 'IP is usually held by the parent company or an IP-holding entity outside Europe.',
        infra: 'European data centres may be used, but operated under the parent company’s control.',
        profit: 'Profits ultimately accrue to the parent company and its shareholders.',
        tax: 'European subsidiaries pay tax here; how much profit is taxed in Europe depends on the corporate and transfer-pricing structure.',
        law: 'The parent company remains subject to its home jurisdiction, which may claim extraterritorial reach.',
        eco: 'Creates European jobs and skills, while strategic capability is concentrated at headquarters.'
      },
      'open-source-eu-integrator': {
        sales: 'Support, integration and hosting are bought from European service providers.',
        rd: 'Development may be global or European; check who actually maintains the code.',
        ip: 'An open licence lets anyone use, inspect and fork the code — control matters more than ownership.',
        infra: 'You or a European provider run the software on infrastructure you choose.',
        profit: 'Service revenue stays largely with European providers.',
        tax: 'Service providers are taxed where they operate.',
        law: 'An open licence cannot be withdrawn by a foreign authority; you control the deployment.',
        eco: 'Funds European maintainers and providers — if you actually contribute or pay for support.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: '{done} of {total} questions answered',
    markdownTitle: 'Digital Sovereignty Procurement Checklist',
    markdownSource: 'Source'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Showing all {total} entries',
    showingSome: 'Showing {shown} of {total} entries'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'LOW SOVEREIGNTY RELEVANCE',
        text: 'Technological sovereignty is unlikely to be a deciding factor for this system. Evaluate it on the usual criteria — security, quality, cost, support — and keep basic exit options (data export, open standards) in the contract.'
      },
      medium: {
        label: 'MEDIUM SOVEREIGNTY RELEVANCE',
        text: 'Sovereignty is a relevant secondary criterion. Include supplier jurisdiction, data portability and exit options in the evaluation, and consider European options where they are competitive.'
      },
      high: {
        label: 'HIGH SOVEREIGNTY RELEVANCE',
        text: 'Dependency on this supplier could materially affect your organisation. Make sovereignty an explicit part of the risk assessment: document jurisdiction and ownership, require on-premises or offline operation where feasible, secure data and configuration export, and actively evaluate European or open-source alternatives.'
      },
      strategic: {
        label: 'STRATEGIC TECHNOLOGY',
        text: 'This system combines high importance with significant dependency. Treat it as strategic technology: involve management and the CISO, assess geopolitical and legal scenarios (sanctions, export restrictions, acquisition, cloud withdrawal), design a tested exit or continuity plan, and give European and open alternatives serious, documented consideration.'
      }
    },
    rules: {
      strategicCritical: 'The system is part of critical infrastructure or OT, is operationally important, and shows three or more dependency factors.',
      strategicFiveFive: 'Five or more importance factors combined with five or more dependency factors.',
      highCritical: 'Critical infrastructure or OT context combined with at least one dependency factor.',
      highThreeTwo: 'Three or more importance factors combined with two or more dependency factors.',
      highSecurity: 'A security control with three or more dependency factors.',
      medium: 'Some importance and some dependency, but not enough to reach the high threshold.',
      low: 'Few importance factors and/or few dependency factors.'
    },
    missingTitle: 'Please answer all questions.',
    missingCount: 'Unanswered questions: {n}. If you do not know the answer, choose “Not sure”.',
    unclear: 'Unclear: {reason}',
    outcome: 'Outcome',
    meter: ['Low', 'Medium', 'High', 'Strategic'],
    why: 'Why this classification?',
    importance: 'Importance factors ({n})',
    dependency: 'Dependency factors ({n})',
    mitigating: 'Mitigating factors',
    openQuestions: 'Open questions to resolve with the supplier',
    none: 'None identified.',
    disclaimer: 'This outcome follows the published rules below. It is not a scientific score and does not replace a formal risk assessment.',
    copyMarkdown: 'Copy as Markdown',
    copyLink: 'Copy shareable link',
    print: 'Print / save as PDF',
    md: {
      title: 'Technology Sovereignty Assessment',
      outcome: 'Outcome',
      rule: 'Rule applied',
      importance: 'Importance factors',
      dependency: 'Dependency factors',
      mitigating: 'Mitigating factors',
      open: 'Open questions',
      none: 'None identified',
      footer: 'Generated with the Technology Sovereignty Assessment ({url}). Not a scientific score.'
    }
  }
};
