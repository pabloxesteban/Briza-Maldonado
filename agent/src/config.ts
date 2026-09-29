// Everything Briza decides lives here. Empty values are fine: the assistant then says Briza will
// confirm it, instead of inventing an answer.

// 10 · House rules the assistant enforces and explains
export const RULES: string[] = [
  'Todas las reservas se confirman con una seña de al menos el 40% del costo total.',
  // Ejemplos para completar/borrar:
  // 'No tatúo rostro, manos ni cuello.',
  // 'Tamaño mínimo: 5 cm.',
  // 'No tatúo los domingos ni los lunes.',
  // 'Solo mayores de 18 años, con DNI.',
]

// 4 · Orientative price ranges for custom designs (ARS). Leave empty to never quote numbers.
// The final price is always Briza's.
export const PRICING: { size: string; bw: string; color: string }[] = [
  // { size: 'Hasta 8 cm', bw: '$40.000 – $60.000', color: '$50.000 – $70.000' },
  // { size: '8 a 15 cm', bw: '$60.000 – $110.000', color: '$75.000 – $130.000' },
  // { size: 'Más de 15 cm', bw: 'a cotizar', color: 'a cotizar' },
]

// 2 · Aftercare guide. General guidance — Briza should review and adapt it to how she works.
export const AFTERCARE = `Cuidados del tatuaje (guía general, Briza te indica los suyos):
• Dejá el film/apósito el tiempo que te indique Briza. Después lavá con agua tibia y jabón neutro, con las manos limpias, sin frotar.
• Secá con toques suaves (papel descartable) y aplicá una capa fina de la crema que te recomiende Briza, 2 a 3 veces por día.
• Durante 2 a 3 semanas: nada de pileta, mar, sauna ni sol directo. No rasques ni arranques las cascaritas.
• Usá ropa suelta y limpia sobre la zona.
• Es normal que pique, pele o esté un poco sensible los primeros días.
• Consultá a un médico si tenés fiebre, pus, enrojecimiento que se expande, calor intenso o dolor que empeora, y avisale a Briza.`
