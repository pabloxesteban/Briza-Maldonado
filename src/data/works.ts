export type Work = {
  slug: string
  title: string
  style: 'Traditional' | 'Black & white' | 'Color'
  zone: string
  note?: string
  src: string
}

const P = '/Briza-Maldonado/portfolio/'

export const WORKS: Work[] = [
  { slug: 'garza', title: 'La Garza', style: 'Traditional', zone: 'Antebrazo', note: 'Alas abiertas, plumas en capas. Un vuelo permanente.', src: P + 'garza.jpg' },
  { slug: 'lobo', title: 'El Lobo', style: 'Traditional', zone: 'Brazo', note: 'Feroz, peludo, libre. Sin domesticar.', src: P + 'lobo.jpg' },
  { slug: 'polilla', title: 'Polilla 777', style: 'Traditional', zone: 'Esternón', note: 'Grande, oscura, simétrica. El centro del cuerpo.', src: P + 'polilla-esterno.jpg' },
  { slug: 'lockets', title: 'Lockets de Gatos', style: 'Color', zone: 'Antebrazo', src: P + 'lockets-gatos.jpg' },
  { slug: 'daga-serpiente', title: 'Daga & Serpiente', style: 'Traditional', zone: 'Antebrazo', note: 'La daga como eje. La serpiente como vida.', src: P + 'daga-serpiente.jpg' },
  { slug: 'cocodrilo', title: 'Cocodrilo', style: 'Black & white', zone: 'Antebrazo', src: P + 'cocodrilo.jpg' },
  { slug: 'patchwork', title: 'Patchwork', style: 'Traditional', zone: 'Manga', note: 'Sol, delfín, vaquero, olas. Una vida en la piel.', src: P + 'patchwork-sleeve.jpg' },
  { slug: 'rosa', title: 'Rosa con Alambre', style: 'Traditional', zone: 'Brazo', src: P + 'rosa-alambre.jpg' },
  { slug: 'alambre-corazon', title: 'Alambre y Corazón', style: 'Color', zone: 'Antebrazo', src: P + 'alambre-daga-corazon.jpg' },
  { slug: 'mariposas', title: 'Mariposas', style: 'Traditional', zone: 'Rodillas', src: P + 'mariposas-rodillas.jpg' },
  { slug: 'conejo', title: 'Conejo', style: 'Black & white', zone: 'Brazo', src: P + 'conejo.jpg' },
  { slug: 'mariposa', title: 'Mariposa', style: 'Traditional', zone: 'Pierna', src: P + 'mariposa-pierna.jpg' },
  { slug: 'mono-corazon', title: 'Moño y Corazón', style: 'Black & white', zone: 'Antebrazo', src: P + 'mono-corazon.jpg' },
  { slug: 'espinas', title: 'Espinas', style: 'Black & white', zone: 'Pierna', src: P + 'espinas.jpg' },
  { slug: 'elefante', title: 'Elefante Skater', style: 'Black & white', zone: 'Antebrazo', src: P + 'elefante-skate.jpg' },
  { slug: 'pinguino', title: 'Pingüino', style: 'Black & white', zone: 'Antebrazo', src: P + 'pinguino.jpg' },
  { slug: 'vegan', title: 'Vegan', style: 'Black & white', zone: 'Pie', src: P + 'vegan-script.jpg' },
]

export const num = (i: number) => String(i + 1).padStart(2, '0')
