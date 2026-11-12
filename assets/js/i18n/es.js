/*
 * Every IT Euro — interface strings used by the JavaScript tools (Spanish / Español).
 * Same keys as en.js. Placeholders such as {done} and {total} are replaced at runtime and must be kept.
 */
window.EveryItEuroStrings = {
  copied: 'Copiado al portapapeles.',
  copyFailed: 'No se ha podido copiar. Seleccione y copie el texto manualmente.',

  /* €100 explorer (index.html) */
  explorer: {
    levels: {
      'eu': 'Mayoritariamente en Europa',
      'mixed': 'Mixto',
      'non-eu': 'Mayoritariamente fuera de Europa',
      'depends': 'Depende de la configuración'
    },
    dimensions: {
      sales: 'Ventas, soporte y servicios',
      rd: 'Ingeniería e I+D',
      ip: 'Propiedad intelectual',
      infra: 'Operación de la infraestructura',
      profit: 'Beneficios y retribución al accionista',
      tax: 'Base del impuesto sobre sociedades',
      law: 'Jurisdicción y control',
      eco: 'Ecosistema y competencias'
    },
    /* Notes per profile and dimension. The level of each entry is defined in main.js and is not translated. */
    notes: {
      'eu-full': {
        sales: 'Los equipos locales de ventas, soporte y consultoría suelen estar empleados en Europa.',
        rd: 'El desarrollo del producto se realiza principalmente en Europa, lo que genera capacidad de ingeniería aquí.',
        ip: 'El código fuente, las patentes y el know-how pertenecen a una entidad europea.',
        infra: 'Funciona en la infraestructura propia del proveedor o en otra operada en Europa, o en la suya.',
        profit: 'Los beneficios corresponden a una empresa europea; los dividendos van a sus accionistas, que pueden estar en cualquier lugar.',
        tax: 'Los beneficios tributan, por lo general, donde la empresa reside y opera: aquí, en Europa.',
        law: 'El proveedor y su matriz están sujetos principalmente al Derecho europeo.',
        eco: 'Con el tiempo, los ingresos financian contrataciones, socios, start-ups y spin-offs europeos.'
      },
      'eu-on-hyperscaler': {
        sales: 'Los equipos de atención al cliente suelen ser europeos.',
        rd: 'La aplicación en sí se desarrolla en Europa.',
        ip: 'La propiedad intelectual de la aplicación es europea; la de la plataforma subyacente, no.',
        infra: 'Los datos pueden estar en regiones de la UE, pero la infraestructura la opera un proveedor no europeo.',
        profit: 'Parte de cada euro paga tarifas de plataforma que van al proveedor de infraestructura.',
        tax: 'El proveedor tributa en Europa; la parte del proveedor de la plataforma tributa según su propia estructura.',
        law: 'El proveedor es europeo, pero su proveedor de infraestructura puede estar sujeto a una legislación no europea con alcance extraterritorial.',
        eco: 'Refuerza las competencias europeas en software, pero aumenta la dependencia de una plataforma no europea.'
      },
      'reseller': {
        sales: 'El revendedor o integrador emplea personal local y mantiene su margen en Europa.',
        rd: 'El desarrollo del producto principal se lleva a cabo allí donde el fabricante tenga sus centros de ingeniería.',
        ip: 'La propiedad intelectual del producto pertenece al fabricante no europeo.',
        infra: 'Depende de si el producto se ejecuta en local (on-premises) o en la nube del fabricante.',
        profit: 'El margen del revendedor se queda en el ámbito local; los ingresos por licencias y suscripciones van al fabricante.',
        tax: 'El revendedor tributa localmente; la parte del fabricante tributa según su estructura societaria.',
        law: 'Las actualizaciones, las licencias y la hoja de ruta del producto las controlan el fabricante y la jurisdicción de su país de origen.',
        eco: 'Genera valiosas competencias locales de implantación, pero no capacidad de desarrollo de producto.'
      },
      'global-with-eu-ops': {
        sales: 'Los grandes proveedores suelen emplear a muchas personas en Europa en ventas, soporte y operaciones.',
        rd: 'Algunos proveedores globales tienen importantes centros de I+D en Europa; las decisiones clave suelen tomarse en otro lugar.',
        ip: 'La propiedad intelectual suele estar en manos de la matriz o de una sociedad tenedora de PI fuera de Europa.',
        infra: 'Pueden utilizarse centros de datos europeos, pero operados bajo el control de la matriz.',
        profit: 'En última instancia, los beneficios corresponden a la matriz y a sus accionistas.',
        tax: 'Las filiales europeas tributan aquí; la parte del beneficio que tributa en Europa depende de la estructura societaria y de precios de transferencia.',
        law: 'La matriz sigue sujeta a la jurisdicción de su país de origen, que puede reivindicar un alcance extraterritorial.',
        eco: 'Crea empleo y competencias en Europa, mientras que la capacidad estratégica se concentra en la sede central.'
      },
      'open-source-eu-integrator': {
        sales: 'El soporte, la integración y el alojamiento se contratan a proveedores de servicios europeos.',
        rd: 'El desarrollo puede ser global o europeo; compruebe quién mantiene realmente el código.',
        ip: 'Una licencia abierta permite a cualquiera usar, inspeccionar y bifurcar el código: el control importa más que la propiedad.',
        infra: 'Usted o un proveedor europeo ejecutan el software en la infraestructura que elija.',
        profit: 'Los ingresos por servicios se quedan en gran medida en proveedores europeos.',
        tax: 'Los proveedores de servicios tributan donde operan.',
        law: 'Una autoridad extranjera no puede revocar una licencia abierta; usted controla el despliegue.',
        eco: 'Financia a mantenedores y proveedores europeos, siempre que realmente contribuya o pague por el soporte.'
      }
    }
  },

  /* Procurement checklist (procurement.html) */
  checklist: {
    progress: 'Preguntas respondidas: {done} de {total}',
    markdownTitle: 'Lista de verificación de soberanía digital para la contratación',
    markdownSource: 'Fuente'
  },

  /* Company database filters (alternatives.html) */
  alternatives: {
    showingAll: 'Se muestran todas las entradas ({total})',
    showingSome: 'Entradas mostradas: {shown} de {total}'
  },

  /* Technology Sovereignty Assessment (sovereignty.html) */
  assessment: {
    levels: {
      low: {
        label: 'RELEVANCIA DE SOBERANÍA BAJA',
        text: 'Es poco probable que la soberanía tecnológica sea un factor decisivo para este sistema. Evalúelo con los criterios habituales (seguridad, calidad, coste, soporte) y mantenga en el contrato opciones básicas de salida (exportación de datos, estándares abiertos).'
      },
      medium: {
        label: 'RELEVANCIA DE SOBERANÍA MEDIA',
        text: 'La soberanía es un criterio secundario relevante. Incluya en la evaluación la jurisdicción del proveedor, la portabilidad de los datos y las opciones de salida, y considere opciones europeas cuando sean competitivas.'
      },
      high: {
        label: 'RELEVANCIA DE SOBERANÍA ALTA',
        text: 'La dependencia de este proveedor podría afectar de forma significativa a su organización. Haga de la soberanía una parte explícita de la evaluación de riesgos: documente la jurisdicción y la propiedad, exija funcionamiento en local (on-premises) o sin conexión cuando sea viable, asegure la exportación de datos y de la configuración, y evalúe activamente alternativas europeas o de código abierto.'
      },
      strategic: {
        label: 'TECNOLOGÍA ESTRATÉGICA',
        text: 'Este sistema combina una gran importancia con una dependencia significativa. Trátelo como tecnología estratégica: implique a la dirección y al CISO, evalúe escenarios geopolíticos y jurídicos (sanciones, restricciones a la exportación, adquisición, retirada del servicio en la nube), diseñe un plan de salida o de continuidad probado y dé una consideración seria y documentada a las alternativas europeas y abiertas.'
      }
    },
    rules: {
      strategicCritical: 'El sistema forma parte de una infraestructura crítica o de OT, es importante para las operaciones y presenta tres o más factores de dependencia.',
      strategicFiveFive: 'Cinco o más factores de importancia combinados con cinco o más factores de dependencia.',
      highCritical: 'Contexto de infraestructura crítica u OT combinado con al menos un factor de dependencia.',
      highThreeTwo: 'Tres o más factores de importancia combinados con dos o más factores de dependencia.',
      highSecurity: 'Un control de seguridad con tres o más factores de dependencia.',
      medium: 'Cierta importancia y cierta dependencia, pero no lo suficiente para alcanzar el umbral alto.',
      low: 'Pocos factores de importancia y/o pocos factores de dependencia.'
    },
    missingTitle: 'Responda a todas las preguntas.',
    missingCount: 'Preguntas sin responder: {n}. Si no conoce la respuesta, elija «No estoy seguro».',
    unclear: 'Sin aclarar: {reason}',
    outcome: 'Resultado',
    meter: ['Baja', 'Media', 'Alta', 'Estratégica'],
    why: '¿Por qué esta clasificación?',
    importance: 'Factores de importancia ({n})',
    dependency: 'Factores de dependencia ({n})',
    mitigating: 'Factores atenuantes',
    openQuestions: 'Preguntas abiertas que aclarar con el proveedor',
    none: 'No se ha identificado ninguno.',
    disclaimer: 'Este resultado se deriva de las reglas publicadas más abajo. No es una puntuación científica y no sustituye a una evaluación de riesgos formal.',
    copyMarkdown: 'Copiar como Markdown',
    copyLink: 'Copiar enlace para compartir',
    print: 'Imprimir / guardar como PDF',
    md: {
      title: 'Evaluación de soberanía tecnológica',
      outcome: 'Resultado',
      rule: 'Regla aplicada',
      importance: 'Factores de importancia',
      dependency: 'Factores de dependencia',
      mitigating: 'Factores atenuantes',
      open: 'Preguntas abiertas',
      none: 'No se ha identificado ninguno',
      footer: 'Generado con la Evaluación de soberanía tecnológica ({url}). No es una puntuación científica.'
    }
  }
};
