import profilePic from '../../assets/profile_pic_5.png'

export function ProfileMedallion({ size = 180 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        padding: 6,
        background: 'radial-gradient(circle at 30% 25%, var(--gold), var(--gold-deep))',
        boxShadow: '0 0 30px rgba(242,193,78,0.35)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 35%, #2a2f3a 0%, #05070c 80%)',
        }}
      >
        <img
          src={profilePic}
          alt="Moises Nugal"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      </div>
    </div>
  )
}
