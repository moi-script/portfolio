import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Mesh, ShaderMaterial } from 'three'
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_SEGMENTS,
  makePageMaterial,
} from './pageShader'
import { getParchmentTexture } from './parchment'
import type { SectionId } from './navMap'

const HTML_SCALE = 0.0072 // world units per CSS px, tuned so content fills a page

export function Page({
  turn,
  z = 0,
  content,
  isResting = false,
  onNavigate,
}: {
  turn: number
  z?: number
  content?: (onNavigate?: (s: SectionId) => void) => ReactNode | null
  isResting?: boolean
  onNavigate?: (s: SectionId) => void
}) {
  const meshRef = useRef<Mesh>(null)
  // Materials are cheap and per-page (they hold the per-page uTurn uniform),
  // but the texture map is a single shared instance — never dispose it here.
  const material = useMemo(() => makePageMaterial(getParchmentTexture()), [])

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  useFrame(() => {
    const m = meshRef.current?.material as ShaderMaterial | undefined
    if (m) m.uniforms.uTurn.value = turn
  })

  const node = isResting && content ? content(onNavigate) : null

  return (
    <mesh ref={meshRef} position={[0, 0, z]} material={material}>
      <planeGeometry
        args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]}
        onUpdate={(g) => g.translate(PAGE_WIDTH / 2, 0, 0)}
      />
      {node && (
        <Html
          transform
          position={[PAGE_WIDTH / 2, 0, 0.02]}
          scale={HTML_SCALE}
          distanceFactor={undefined}
          occlude={false}
          style={{
            width: PAGE_WIDTH / HTML_SCALE - 80,
            height: PAGE_HEIGHT / HTML_SCALE - 80,
            padding: 40,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {node}
        </Html>
      )}
    </mesh>
  )
}
