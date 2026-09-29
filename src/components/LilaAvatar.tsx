// Lila, Briza's assistant: a little flash-style portrait (bob with bangs, rosy cheeks, star earring)
export default function LilaAvatar({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="lila-av">
      <circle cx="32" cy="32" r="32" fill="#F4B6C8" />
      <path d="M12 64c2-11 10-17 20-17s18 6 20 17z" fill="#161414" />
      <path d="M26 44h12v6c0 3-12 3-12 0z" fill="#F7E3D3" />
      <path d="M15 33c0-12 7-21 17-21s17 9 17 21c0 6-2 11-4 14H19c-2-3-4-8-4-14z" fill="#161414" />
      <ellipse cx="32" cy="33" rx="11.5" ry="13" fill="#F7E3D3" />
      <path d="M20 30c1-9 6-14 12-14s11 5 12 14c-4-3-7-6-8-9-2 4-8 8-16 9z" fill="#161414" />
      <path d="M26.5 34.5q1.5-1.6 3 0M34.5 34.5q1.5-1.6 3 0" stroke="#161414" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="39" r="2.3" fill="#EE8FB2" opacity=".75" />
      <circle cx="39" cy="39" r="2.3" fill="#EE8FB2" opacity=".75" />
      <path d="M29 41.5q3 2.4 6 0" stroke="#C4546F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20.5 40l1 2.2 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="#F7F1E2" />
      <path d="M44 18c1.5 0 2.5 1 2.5 2.5M47 14l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" stroke="#F7F1E2" strokeWidth="1" fill="#F7F1E2" />
    </svg>
  )
}
