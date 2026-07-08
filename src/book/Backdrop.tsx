import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'

function randomDustPositions(n: number): number[] {
  const pos: number[] = []
  for (let i = 0; i < n; i++) {
    pos.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6)
  }
  return pos
}

function Dust() {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const pos = randomDustPositions(120)
    g.setAttribute('position', new Float32BufferAttribute(pos, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.03} color="#f2c14e" transparent opacity={0.4} />
    </points>
  )
}

export function Backdrop() {
  return (
    <>
      <color attach="background" args={['#0a0705']} />
      <fog attach="fog" args={['#0a0705', 8, 18]} />
      <ambientLight intensity={0.35} color="#ffe9c2" />
      <pointLight position={[3, 4, 6]} intensity={40} color="#ffd9a0" distance={30} decay={2} />
      <pointLight position={[-4, 2, 4]} intensity={12} color="#88bbff" distance={25} decay={2} />
      <Dust />
    </>
  )
}
