import { Question, QuestionType, TextContext } from './types';

export const EXAM_TEXTS: TextContext[] = [
  {
    id: 1,
    title: "Texto 1: La comunicación académica en entornos digitales contemporáneos",
    content: `En las últimas dos décadas, la transición acelerada hacia entornos digitales ha modificado sustancialmente las prácticas de lectura y escritura en el ámbito universitario. Tradicionalmente, la comunicación académica se caracterizaba por un proceso lineal: el estudiante leía un texto extenso, tomaba apuntes, realizaba un análisis crítico y elaboraba un informe siguiendo parámetros normativos estrictos. Sin embargo, en el contexto digital contemporáneo, dicho esquema ya no funciona de manera aislada. Hoy, el estudiante debe navegar simultáneamente entre múltiples fuentes de información, formatos heterogéneos y plataformas con diferentes exigencias discursivas.
    
Esta fragmentación del proceso lector-escritor exige desarrollar competencias nuevas: la capacidad de discriminar entre información confiable y aquella que no lo es; la habilidad de reconstruir textos complejos a partir de fragmentos desarticulados; y la competencia retórica necesaria para adaptar el registro según el canal, el receptor y el propósito comunicativo. No obstante, estas habilidades no se adquieren espontáneamente: requieren instrucción, práctica deliberada y reflexión metacognitiva.

Un problema recurrente es la “ilusión de competencia lectora”: el estudiante cree que comprende un texto porque lo ha recorrido superficialmente o ha explorado resúmenes en plataformas digitales. Esta falsa percepción conduce a conclusiones débiles, argumentaciones sin evidencia y trabajos académicos carentes de profundidad. De ahí la insistencia en que la lectura crítica no consiste en repetir información sino en construir significado, identificar supuestos implícitos y evaluar la argumentación.

Adicionalmente, la proliferación de tecnologías comunicativas ha introducido un desafío adicional: la coexistencia entre registros. En un mismo día, un estudiante puede enviar un mensaje informal por redes sociales, redactar un correo institucional y participar en un foro académico. La incapacidad de distinguir entre dichos registros produce errores de adecuación que afectan la credibilidad del escritor. En síntesis, escribir bien es pensar con precisión.`
  },
  {
    id: 2,
    title: "Texto 2: Evaluación de la calidad textual en informes universitarios",
    content: `Un análisis reciente de 250 informes académicos de estudiantes de primer año reveló que el 62% de los trabajos presentaban problemas de coherencia global, mientras que el 48% mostraba dificultades significativas en la formulación de ideas centrales por párrafo. Estos resultados evidencian que muchos estudiantes no dominan los principios básicos de la estructura textual académica, pese a haber cursado asignaturas introductorias de comunicación escrita.

Los problemas más frecuentes detectados incluyen la ausencia de conectores lógicos, la multiplicidad de ideas inconexas dentro del mismo párrafo y el uso de registros inadecuados para el contexto evaluativo. En particular, se observó que los párrafos descriptivos suelen confundirse con argumentativos, lo cual genera una mezcla poco efectiva de propósitos comunicativos. Asimismo, varios informes mostraron un uso excesivo de tecnicismos que, lejos de aportar precisión, oscurecían el significado del texto.

El estudio concluye que la enseñanza universitaria de la escritura debe centrarse no solo en corregir errores ortográficos, sino también en desarrollar habilidades de planificación, estructuración de argumentos y revisión crítica. En consecuencia, se propone un modelo formativo que combina talleres prácticos, análisis de textos modelo y retroalimentación individualizada para mejorar la competencia comunicativa de los estudiantes.`
  },
  {
    id: 3,
    title: "Texto 3: Norma culta, variación lingüística y comunicación profesional",
    content: `En contextos académicos y profesionales, el uso de la norma culta del español se percibe como un indicador de competencia, seriedad y credibilidad. Sin embargo, esta constatación no debería interpretarse como un rechazo de las variedades dialectales ni de los usos coloquiales del idioma, sino como un reconocimiento de que cada situación comunicativa posee exigencias específicas. Un estudiante universitario puede emplear un registro coloquial con sus amistades y, al mismo tiempo, ser capaz de redactar informes técnicos con estricta corrección ortográfica y sintáctica. Lo problemático no es la existencia de registros múltiples, sino la incapacidad de distinguirlos y emplearlos adecuadamente.

En sociedades plurilingües y pluridialectales, como la mayoría de países hispanohablantes, la diversidad lingüística forma parte de la identidad cultural. Expresiones coloquiales no son errores, sino marcas de pertenencia a una comunidad específica. No obstante, cuando estas formas se trasladan sin filtro a documentos oficiales, informes académicos o comunicaciones institucionales, se produce una ruptura entre las expectativas del receptor y el código efectivamente utilizado. Esta ruptura no solo genera malentendidos, sino que puede ser interpretada como descuido, falta de profesionalismo o desconocimiento de las normas básicas de la escritura formal.

La formación universitaria en comunicación no puede limitarse a un discurso normativo que condene los usos coloquiales. Por el contrario, debe promover una conciencia metalingüística que permita al estudiante reconocer las funciones y los espacios de cada variedad. Aprender a cambiar de registro implica comprender quién es el receptor, cuál es el propósito del mensaje, qué canal se utiliza y qué consecuencias puede tener un error de adecuación.`
  },
  {
    id: 4,
    title: "Texto 4: Escritura universitaria, tecnología y responsabilidad discursiva",
    content: `La expansión de herramientas digitales de corrección ortográfica y gramatical ha transformado las prácticas de escritura en la universidad. Muchos estudiantes redactan directamente en procesadores de texto que subrayan errores, sugieren sinónimos e incluso proponen reformulaciones completas de oraciones. Aunque estos recursos pueden ser aliados para mejorar la calidad formal de un documento, también pueden generar una dependencia que debilita la conciencia ortográfica y la capacidad de revisión autónoma.

Un problema frecuente se observa cuando el estudiante acepta de manera acrítica todas las sugerencias del corrector automático. En tales casos, se producen oraciones gramaticalmente correctas, pero conceptualmente inexactas o incoherentes con la intención comunicativa original. La tecnología corrige la forma, pero no necesariamente el contenido. La responsabilidad final del texto sigue siendo del autor, quien debe verificar si las modificaciones conservan el sentido que desea transmitir.

Por otro lado, la posibilidad de “copiar y pegar” fragmentos de textos tomados de internet ha facilitado tanto la elaboración de trabajos como la proliferación de prácticas de plagio. No se trata solo de una falta ética, sino también de un obstáculo para el desarrollo del pensamiento crítico: quien se limita a reproducir ideas ajenas sin integrarlas ni cuestionarlas renuncia a la construcción de su propia voz académica.`
  }
];

export const QUESTIONS: Question[] = [
  // --- PREGUNTAS TEXTO 1 ---
  { 
    id: 1, textId: 1, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Basándose en el Texto 1, explique detalladamente qué es la 'ilusión de competencia lectora' y mencione dos consecuencias negativas para el estudiante.", 
    expectedAnswer: "Creencia falsa de comprender un texto por lectura superficial. Consecuencias: conclusiones débiles, falta de profundidad." 
  },
  { 
    id: 2, textId: 1, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Según el Texto 1, ¿cuál es el cambio fundamental en el contexto digital frente al modelo tradicional?", 
    options: ["Lectura lineal vs. Lectura circular.", "Navegación simultánea entre múltiples fuentes y formatos heterogéneos.", "Eliminación de la escritura manual.", "Uso exclusivo de videos."], 
    correctOptionIndex: 1 
  },
  { 
    id: 3, textId: 1, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "El Texto 1 señala que la 'coexistencia entre registros' genera un problema principal. ¿Cuál es?", 
    options: ["El uso de emojis en tesis.", "La falta de tecnología.", "La incapacidad de distinguir y adecuar el registro al contexto.", "El exceso de formalidad en redes sociales."], 
    correctOptionIndex: 2 
  },
  { 
    id: 4, textId: 1, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Interprete la frase final del Texto 1: 'escribir bien es pensar con precisión'. ¿Qué relación establece el autor entre pensamiento y escritura?", 
    expectedAnswer: "La escritura refleja el orden del pensamiento. Claridad escrita implica claridad mental." 
  },
  { 
    id: 5, textId: 1, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Según el Texto 1, ¿qué nuevas competencias exige la fragmentación del proceso lector-escritor?", 
    options: ["Escribir más rápido.", "Discriminar información confiable y reconstruir textos complejos.", "Memorizar autores.", "Usar correctores automáticos."], 
    correctOptionIndex: 1 
  },

  // --- PREGUNTAS TEXTO 2 ---
  { 
    id: 11, textId: 2, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Según el Texto 2, ¿qué implicación tiene que el 48% de los trabajos tenga problemas al formular ideas centrales?", 
    options: ["Que leen poco.", "Que no comprenden la estructura del párrafo académico.", "Que usan muchos conectores.", "Que copian de internet."], 
    correctOptionIndex: 1 
  },
  { 
    id: 12, textId: 2, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Basado en el Texto 2, explique por qué el uso excesivo de tecnicismos puede 'oscurecer' el significado de un informe en lugar de mejorarlo.", 
    expectedAnswer: "El exceso de tecnicismos sin propósito comunicativo claro reduce la legibilidad y comprensión, afectando la transmisión efectiva del mensaje." 
  },
  { 
    id: 13, textId: 2, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "El Texto 2 menciona que la falta de conectores lógicos está relacionada principalmente con:", 
    options: ["Errores de ortografía.", "La incoherencia global del texto.", "El uso de fuentes bibliográficas.", "La extensión del documento."], 
    correctOptionIndex: 1 
  },
  { 
    id: 14, textId: 2, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Según el Texto 2, ¿por qué se confunden frecuentemente los párrafos descriptivos con los argumentativos y cómo afecta esto al texto?", 
    options: undefined, 
    expectedAnswer: "Se confunden los propósitos comunicativos (describir vs convencer), generando una mezcla poco efectiva que debilita la intención del autor." 
  },
  { 
    id: 15, textId: 2, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Qué solución propone el estudio del Texto 2 para mejorar la competencia comunicativa?", 
    options: ["Prohibir el uso de celulares.", "Solo corregir ortografía.", "Modelo formativo con talleres y retroalimentación individualizada.", "Reprobar a los estudiantes."], 
    correctOptionIndex: 2 
  },

  // --- PREGUNTAS TEXTO 3 ---
  { 
    id: 26, textId: 3, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Según el Texto 3, ¿por qué expresiones coloquiales como 'bacán' o 'ñaña' no se consideran errores en sí mismos, pero son problemáticos en documentos oficiales?", 
    expectedAnswer: "Son marcas de identidad válidas en su contexto, pero en documentos formales rompen la expectativa del receptor y el código profesional." 
  },
  { 
    id: 27, textId: 3, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuál es el problema principal señalado en el Texto 3 respecto a los registros?", 
    options: ["La existencia de dialectos.", "El uso de tecnicismos.", "La incapacidad de distinguir y usar adecuadamente registros según el contexto.", "La eliminación de variedades regionales."], 
    correctOptionIndex: 2 
  },
  { 
    id: 30, textId: 3, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Según el Texto 3, la norma culta debe entenderse como:", 
    options: ["Una verdad absoluta e inmutable.", "Una construcción histórica basada en consensos sociales y de prestigio.", "Una invención inútil.", "Algo que solo se usa en España."], 
    correctOptionIndex: 1 
  },
  { 
    id: 33, textId: 3, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuál opción refleja mejor la postura del Texto 3 sobre la identidad lingüística?", 
    options: ["Debe abandonarse al entrar a la universidad.", "Es incompatible con la norma culta.", "Puede mantenerse mientras se amplía el repertorio para manejar la norma culta cuando se exija.", "Solo se conserva rechazando la norma."], 
    correctOptionIndex: 2 
  },
  { 
    id: 34, textId: 3, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "El Texto 3 afirma que dominar la norma culta abre puertas simbólicas a espacios de poder. Explique este concepto con sus propias palabras.", 
    expectedAnswer: "El dominio del lenguaje formal permite el acceso y validación en instituciones (empresas, gobierno) donde ese código es requisito para ser escuchado." 
  },

  // --- PREGUNTAS TEXTO 4 ---
  { 
    id: 37, textId: 4, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Según el Texto 4, ¿cómo la dependencia excesiva de los correctores automáticos debilita la 'conciencia ortográfica'?", 
    expectedAnswer: "El estudiante deja de reflexionar sobre las reglas y acepta pasivamente las correcciones, perdiendo la capacidad de detectar errores por sí mismo." 
  },
  { 
    id: 38, textId: 4, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "El Texto 4 afirma que la tecnología corrige la forma pero no el contenido. ¿Qué ejemplo ilustra esto?", 
    options: ["El corrector mejora el significado.", "El corrector cambia una palabra por un sinónimo que no encaja en el contexto, alterando la idea.", "El corrector detecta inglés.", "El corrector pone tildes."], 
    correctOptionIndex: 1 
  },
  { 
    id: 40, textId: 4, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuál es la postura del Texto 4 respecto a la tecnología?", 
    options: ["Debe prohibirse.", "Es neutral; lo decisivo es el uso responsable y crítico del estudiante.", "Garantiza calidad automática.", "Solo sirve para entretenimiento."], 
    correctOptionIndex: 1 
  },
  { 
    id: 41, textId: 4, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Explique la relación que establece el Texto 4 entre el 'copiar y pegar' y la falta de pensamiento crítico.", 
    expectedAnswer: "Al reproducir ideas ajenas sin procesarlas, el estudiante renuncia a construir su propia voz y argumentación." 
  },
  { 
    id: 43, textId: 4, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "El Texto 4 se clasifica mejor como un texto:", 
    options: ["Narrativo literario.", "Expositivo-argumentativo.", "Descriptivo poético.", "Instructivo."], 
    correctOptionIndex: 1 
  },

  // --- PREGUNTAS INDEPENDIENTES (ORTOGRAFÍA, GRAMÁTICA, ETC.) ---
  { 
    id: 100, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Identifique el vicio del lenguaje en: 'Subir para arriba' o 'Salir para afuera' y explique por qué es incorrecto en un registro formal.", 
    expectedAnswer: "Es un pleonasmo o redundancia. Los verbos subir y salir ya implican la dirección, por lo que añadirla es innecesario." 
  },
  { 
    id: 101, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Seleccione la oración que utiliza correctamente la tilde diacrítica en monosílabos:", 
    options: ["Tú tienes que entregar tu tarea.", "Tu tienes que entregar tú tarea.", "Tú tienes que entregar tú tarea.", "Tu tienes que entregar tu tarea."], 
    correctOptionIndex: 0 
  },
  { 
    id: 102, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuál es el conector más adecuado para introducir una idea opuesta o contradictoria?", 
    options: ["Además", "Por lo tanto", "Sin embargo", "Es decir"], 
    correctOptionIndex: 2 
  },
  { 
    id: 103, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Reescriba la siguiente oración eliminando el queísmo/dequeísmo: 'Pienso de que deberíamos estudiar más'.", 
    expectedAnswer: "Pienso que deberíamos estudiar más." 
  },
  { 
    id: 104, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Identifique la palabra esdrújula:", 
    options: ["Árbol", "Examen", "Académico", "Papel"], 
    correctOptionIndex: 2 
  },
  { 
    id: 105, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Seleccione la opción con la puntuación correcta del vocativo:", 
    options: ["Hola Juan cómo estás.", "Hola, Juan, cómo estás.", "Hola Juan, cómo estás.", "Hola, Juan cómo estás."], 
    correctOptionIndex: 1 
  },
  { 
    id: 106, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Transforme la siguiente frase coloquial a un registro formal académico: 'El profe nos dio una mano con el trabajo'.", 
    expectedAnswer: "El docente nos brindó apoyo/orientación con el trabajo académico." 
  },
  { 
    id: 107, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Qué oración presenta un error de concordancia?", 
    options: ["La gente caminaba rápido.", "El grupo de estudiantes llegaron tarde.", "El equipo ganó el partido.", "La mayoría votó a favor."], 
    correctOptionIndex: 1 
  },
  { 
    id: 108, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Sinónimo académico para 'cosa':", 
    options: ["Vaina", "Asunto / Elemento", "Coso", "Algo"], 
    correctOptionIndex: 1 
  },
  { 
    id: 109, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Explique la diferencia entre 'Haber' (verbo) y 'A ver' (preposición + verbo).", 
    expectedAnswer: "Haber denota existencia o auxiliar (haber comido). A ver se usa para observar o comprobar (vamos a ver)." 
  },
  { 
    id: 110, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuál es la forma correcta del verbo 'satisfacer' en pasado (pretérito perfecto simple, primera persona)?", 
    options: ["Satisfací", "Satisfaci", "Satisfice", "Satisfació"], 
    correctOptionIndex: 2 
  },
  { 
    id: 111, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Uso correcto de mayúsculas:", 
    options: ["El río Amazonas", "El Río Amazonas", "El río amazonas", "el río Amazonas"], 
    correctOptionIndex: 0 
  },
  { 
    id: 112, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Identifique la oración pasiva:", 
    options: ["Juan come manzanas.", "Las manzanas fueron comidas por Juan.", "Juan está comiendo.", "Juan comió."], 
    correctOptionIndex: 1 
  },
  { 
    id: 113, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Defina qué es una 'tesis' en un ensayo argumentativo.", 
    expectedAnswer: "Es la postura, afirmación central o idea principal que el autor defiende y sustenta a lo largo del texto." 
  },
  { 
    id: 114, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Palabra escrita incorrectamente:", 
    options: ["Injerencia", "Garaje", "Extrangero", "Berenjena"], 
    correctOptionIndex: 2 
  },
  { 
    id: 115, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Conector de consecuencia:", 
    options: ["Pero", "Aunque", "Por consiguiente", "Además"], 
    correctOptionIndex: 2 
  },
  { 
    id: 116, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Corrija la redundancia: 'Lapso de tiempo'.", 
    expectedAnswer: "Lapso (ya implica tiempo) o Período." 
  },
  { 
    id: 117, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Cuándo se usa punto y coma?", 
    options: ["Para terminar un texto.", "Para separar oraciones independientes pero relacionadas, o en enumeraciones complejas.", "Después de un saludo.", "Nunca."], 
    correctOptionIndex: 1 
  },
  { 
    id: 118, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Antónimo de 'Efímero':", 
    options: ["Breve", "Pasajero", "Duradero", "Rápido"], 
    correctOptionIndex: 2 
  },
  { 
    id: 119, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Escriba una oración usando correctamente 'basta' (suficiente) y 'vasta' (extensa).", 
    expectedAnswer: "Basta con mirar la vasta llanura para entender su inmensidad." 
  },
  { 
    id: 120, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Seleccione la palabra grave con tilde:", 
    options: ["Canción", "Árbol", "Cantar", "Música"], 
    correctOptionIndex: 1 
  },
  { 
    id: 121, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Solecismo común: 'Hubieron problemas'. Lo correcto es:", 
    options: ["Habían problemas", "Hubo problemas", "Han habido problemas", "Habemos problemas"], 
    correctOptionIndex: 1 
  },
  { 
    id: 122, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "¿Qué es una cita bibliográfica?", 
    options: ["Una reunión.", "La mención de una fuente de información en el texto.", "Una lista de libros.", "Un resumen."], 
    correctOptionIndex: 1 
  },
  { 
    id: 123, textId: 0, type: QuestionType.OPEN_TEXT, points: 2, 
    questionText: "Explique por qué se debe evitar el uso de 'etcétera' excesivo en textos académicos.", 
    expectedAnswer: "Puede denotar imprecisión, falta de conocimiento o pereza para enumerar los elementos relevantes." 
  },
  { 
    id: 124, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Escritura correcta de números en ensayos (generalmente):", 
    options: ["Del cero al nueve con letras.", "Siempre con cifras.", "Siempre con letras.", "Mezclado."], 
    correctOptionIndex: 0 
  },
  { 
    id: 125, textId: 0, type: QuestionType.MULTIPLE_CHOICE, points: 1, 
    questionText: "Significado de 'Ambiguo':", 
    options: ["Claro", "Que puede entenderse de varios modos.", "Largo", "Corto"], 
    correctOptionIndex: 1 
  }
];

export const TOTAL_QUESTIONS = QUESTIONS.length;