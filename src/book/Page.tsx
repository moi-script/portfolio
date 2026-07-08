import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_SEGMENTS,
  makePageMaterial,
} from './pageShader'
import { makeParchmentTexture } from './parchment'

export function Page({
  turn,
  z = 0,
  children,
}: {
  turn: number
  z?: number
  children?: ReactNode
}) {
  const meshRef = useRef<Mesh>(null)
  const material = useMemo(() => makePageMaterial(makeParchmentTexture()), [])

  useFrame(() => {
    const m = meshRef.current?.material as ShaderMaterial | undefined
    if (m) m.uniforms.uTurn.value = turn
  })

  return (
    <mesh ref={meshRef} position={[0, 0, z]} material={material}>
      {/* plane spans x in [0, W] with spine at x=0: translate so left edge = 0 */}
      <planeGeometry
        args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]}
        onUpdate={(g) => g.translate(PAGE_WIDTH / 2, 0, 0)}
      />
      {children}
    </mesh>
  )
}
