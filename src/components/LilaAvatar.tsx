// Lila, Briza's assistant, wears the studio's mermaid
export default function LilaAvatar({ size = 36 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/Briza-Maldonado/brand/sirena-badge.png" alt="" width={size} height={size} className="lila-av" />
  )
}
