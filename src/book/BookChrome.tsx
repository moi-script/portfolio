import { Text } from '@react-three/drei'
import { PAGE_WIDTH, PAGE_HEIGHT } from './pageShader'

const WOOD = '#6b4a2b'
const GOLD = '#f2c14e'

function GoldCorner({ x, y }: { x: number; y: number }) {
  return (
    <mesh position={[x, y, -0.05]}>
      <boxGeometry args={[0.5, 0.5, 0.12]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
    </mesh>
  )
}

export function BookChrome({ progress }: { progress: number }) {
  const halfW = PAGE_WIDTH
  const cx = halfW // corners near outer edges of the open spread
  const cy = PAGE_HEIGHT / 2 - 0.1
  return (
    <group position={[0, 0, -0.1]}>
      {/* wooden back board spanning both pages, slightly larger than the paper */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[PAGE_WIDTH * 2 + 0.5, PAGE_HEIGHT + 0.5, 0.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* spine */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.18, PAGE_HEIGHT + 0.5, 0.24]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* gold corner caps on the two outer corners of each side */}
      <GoldCorner x={-cx} y={cy} />
      <GoldCorner x={-cx} y={-cy} />
      <GoldCorner x={cx} y={cy} />
      <GoldCorner x={cx} y={-cy} />
      {progress < 0.5 && (
        <group position={[0, 0, 0.2]}>
          <Text position={[0, 0.6, 0]} fontSize={0.5} color="#f2c14e" anchorX="center" anchorY="middle" font={undefined}>
            The Codex
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.22} color="#e9d6ad" anchorX="center" anchorY="middle">
            Moises Nugal · Portfolio
          </Text>
          <Text position={[0, -1.4, 0]} fontSize={0.14} color="#cdb488" anchorX="center" anchorY="middle">
            scroll to open ↓
          </Text>
        </group>
      )}
      {progress > 7.5 && (
        <group position={[0, 0, 0.2]}>
          <Text position={[0, 0, 0]} fontSize={0.2} color="#e9d6ad" anchorX="center" anchorY="middle">
            Thanks for reading.
          </Text>
        </group>
      )}
    </group>
  )
}
