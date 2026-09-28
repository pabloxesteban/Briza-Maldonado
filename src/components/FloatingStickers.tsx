'use client'

import Image from 'next/image'

const floaters = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png', size: 110, top: '12%', left: '4%', rot: -14, anim: 'floatA 6.5s ease-in-out infinite', delay: '0s' },
  { src: '/Briza-Maldonado/flash/frutilla.png', size: 80, top: '8%', right: '6%', rot: 10, anim: 'floatB 7.2s ease-in-out infinite', delay: '1.1s' },
  { src: '/Briza-Maldonado/flash/gorrion.png', size: 90, top: '38%', right: '2%', rot: -7, anim: 'floatC 8s ease-in-out infinite', delay: '0.4s' },
  { src: '/Briza-Maldonado/flash/flor-hojas.png', size: 75, top: '62%', left: '2%', rot: 8, anim: 'floatA 5.8s ease-in-out infinite', delay: '2s' },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png', size: 68, top: '78%', right: '4%', rot: -12, anim: 'floatB 9s ease-in-out infinite', delay: '0.7s' },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png', size: 85, top: '52%', left: '1%', rot: 5, anim: 'driftRight 7s ease-in-out infinite', delay: '1.8s' },
]

export default function FloatingStickers() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {floaters.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: 'left' in s ? s.left : undefined,
            right: 'right' in s ? s.right : undefined,
            width: s.size,
            height: s.size,
            ['--rot' as string]: `${s.rot}deg`,
            animation: s.anim,
            animationDelay: s.delay,
            opacity: 0.55,
            filter: 'drop-shadow(0 6px 16px rgba(20,14,14,0.15))',
          } as React.CSSProperties}
        >
          <Image
            src={s.src}
            alt=""
            fill
            style={{ objectFit: 'contain' }}
            sizes={`${s.size}px`}
          />
        </div>
      ))}
    </div>
  )
}
