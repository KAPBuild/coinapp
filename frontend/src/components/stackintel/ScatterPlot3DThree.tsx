import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { MorganScatterPoint, AxisConfig, InvertConfig, AXIS_LABELS, AxisVariable } from '../../types/morganScatterData'

// Hook to detect mobile viewport - Text component from drei can break WebGL on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

interface ScatterPlot3DThreeProps {
  data: MorganScatterPoint[]
  axisConfig: AxisConfig
  invertConfig: InvertConfig
  showTrendPlane: boolean
}

// Navy professional dark theme
const THEME = {
  bg: '#0f172a',
  plotBg: '#1e293b',
  grid: '#334155',
  text: '#e2e8f0',
  accent: '#3b82f6',
}

// Color gradient based on outlier score - VIBRANT colors
function getColor(score: number): string {
  // Clamp score to 0-1 range
  const s = Math.max(0, Math.min(1, score))

  // Vibrant gradient with high saturation colors
  if (s < 0.25) {
    // Electric blue to bright cyan
    const t = s / 0.25
    const r = Math.round(0 + t * 0)       // 0 -> 0
    const g = Math.round(150 + t * 105)   // 150 -> 255
    const b = Math.round(255 - t * 55)    // 255 -> 200
    return `rgb(${r}, ${g}, ${b})`
  } else if (s < 0.5) {
    // Bright cyan to neon green
    const t = (s - 0.25) / 0.25
    const r = Math.round(0 + t * 50)      // 0 -> 50
    const g = Math.round(255)             // 255
    const b = Math.round(200 - t * 150)   // 200 -> 50
    return `rgb(${r}, ${g}, ${b})`
  } else if (s < 0.7) {
    // Neon green to bright yellow
    const t = (s - 0.5) / 0.2
    const r = Math.round(50 + t * 205)    // 50 -> 255
    const g = Math.round(255)             // 255
    const b = Math.round(50 - t * 50)     // 50 -> 0
    return `rgb(${r}, ${g}, ${b})`
  } else if (s < 0.85) {
    // Bright yellow to hot orange
    const t = (s - 0.7) / 0.15
    const r = Math.round(255)             // 255
    const g = Math.round(255 - t * 125)   // 255 -> 130
    const b = Math.round(0)               // 0
    return `rgb(${r}, ${g}, ${b})`
  } else {
    // Hot orange to blazing red/magenta
    const t = (s - 0.85) / 0.15
    const r = Math.round(255)             // 255
    const g = Math.round(130 - t * 100)   // 130 -> 30
    const b = Math.round(0 + t * 100)     // 0 -> 100
    return `rgb(${r}, ${g}, ${b})`
  }
}

// Get value for a given axis variable
function getValue(coin: MorganScatterPoint, variable: AxisVariable): number {
  switch (variable) {
    case 'survival': return coin.survival
    case 'pop65': return coin.pop65
    case 'value65': return coin.value65
    case 'mintage': return coin.mintage
    case 'survivalRate': return coin.survivalRate || 0
    case 'valuePerPop': return coin.valuePerPop || 0
  }
}

// Normalize data to 0-10 range for visualization
// When invert=true, low real values map to high positions (10) so rare coins stand out at the top
function normalizeData(values: number[], invert: boolean = false): { normalized: number[], min: number, max: number } {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return {
    normalized: values.map(v => {
      const norm = ((v - min) / range) * 10
      return invert ? 10 - norm : norm
    }),
    min,
    max
  }
}

// Calculate outlier scores based on how "rare/notable" a coin is
// Uses a composite score across all visible axes, weighted by inversion direction
function calculateOutlierScores(data: MorganScatterPoint[], axisConfig: AxisConfig, invertConfig: InvertConfig): number[] {
  if (data.length === 0) return []

  // Helper: for a given axis, compute a 0-1 score where higher = more notable
  // When inverted, LOW real values are notable (rare); otherwise HIGH values are notable
  function axisScore(values: number[], invert: boolean): number[] {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    return values.map(v => {
      const norm = (v - min) / range  // 0 (lowest) to 1 (highest)
      return invert ? 1 - norm : norm // if inverted, low values → high score
    })
  }

  const xValues = data.map(d => getValue(d, axisConfig.x))
  const yValues = data.map(d => getValue(d, axisConfig.y))
  const xScores = axisScore(xValues, invertConfig.x)
  const yScores = axisScore(yValues, invertConfig.y)

  let zScores: number[] | null = null
  if (axisConfig.z) {
    const zValues = data.map(d => getValue(d, axisConfig.z!))
    zScores = axisScore(zValues, invertConfig.z)
  }

  // Composite: average across visible axes, with Y weighted heavier (primary interest axis)
  return data.map((_, i) => {
    const x = xScores[i]
    const y = yScores[i]
    if (zScores) {
      return x * 0.25 + y * 0.5 + zScores[i] * 0.25
    }
    return x * 0.35 + y * 0.65
  })
}

// Single data point sphere
interface DataPointProps {
  position: [number, number, number]
  color: string
  size: number
  coin: MorganScatterPoint
  isSelected: boolean
  showLabel: boolean // Only show labels on desktop - drei Text breaks mobile WebGL
  onSelect: (coin: MorganScatterPoint, position: { x: number, y: number }) => void
}

function DataPoint({ position, color, size, coin, isSelected, showLabel, onSelect }: DataPointProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(coin, { x: e.clientX, y: e.clientY })
  }, [coin, onSelect])

  const handlePointerOver = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  const isHighlighted = hovered || isSelected
  const visualSize = isHighlighted ? size * 1.5 : size
  const hitAreaSize = size * 2.5 // Larger invisible hit area for easier tapping

  return (
    <group position={position}>
      {/* Invisible larger hit area for easier tapping */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[hitAreaSize, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Visible sphere */}
      <mesh>
        <sphereGeometry args={[visualSize, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : color}
          emissive={isHighlighted ? color : '#000000'}
          emissiveIntensity={isHighlighted ? 0.5 : 0.15}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Date & mint mark label for outliers - only on desktop (drei Text breaks mobile WebGL) */}
      {showLabel && (
        <Text
          position={[0, visualSize + 0.5, 0]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {coin.id}
        </Text>
      )}
    </group>
  )
}

// Axis lines and labels
interface AxesProps {
  xLabel: string
  yLabel: string
  zLabel: string
  xRange: { min: number, max: number }
  yRange: { min: number, max: number }
  zRange: { min: number, max: number }
}

function Axes({ xLabel, yLabel, zLabel, xRange, yRange, zRange }: AxesProps) {
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`
    return val.toFixed(0)
  }

  return (
    <group>
      {/* X Axis */}
      <Line
        points={[[0, 0, 0], [10, 0, 0]]}
        color={THEME.accent}
        lineWidth={2}
      />
      <Text
        position={[5, -0.8, 0]}
        fontSize={0.4}
        color={THEME.text}
        anchorX="center"
      >
        {xLabel}
      </Text>
      <Text position={[0, -0.5, 0]} fontSize={0.25} color={THEME.text} anchorX="center">
        {formatValue(xRange.min)}
      </Text>
      <Text position={[10, -0.5, 0]} fontSize={0.25} color={THEME.text} anchorX="center">
        {formatValue(xRange.max)}
      </Text>

      {/* Y Axis (vertical) */}
      <Line
        points={[[0, 0, 0], [0, 10, 0]]}
        color="#22c55e"
        lineWidth={2}
      />
      <Text
        position={[-1.2, 5, 0]}
        fontSize={0.4}
        color={THEME.text}
        anchorX="center"
        rotation={[0, 0, Math.PI / 2]}
      >
        {yLabel}
      </Text>
      <Text position={[-0.5, 0, 0]} fontSize={0.25} color={THEME.text} anchorX="right">
        {formatValue(yRange.min)}
      </Text>
      <Text position={[-0.5, 10, 0]} fontSize={0.25} color={THEME.text} anchorX="right">
        {formatValue(yRange.max)}
      </Text>

      {/* Z Axis (depth) */}
      <Line
        points={[[0, 0, 0], [0, 0, 10]]}
        color="#f59e0b"
        lineWidth={2}
      />
      <Text
        position={[0, -0.8, 5]}
        fontSize={0.4}
        color={THEME.text}
        anchorX="center"
        rotation={[0, Math.PI / 2, 0]}
      >
        {zLabel}
      </Text>
      <Text position={[0, -0.5, 0]} fontSize={0.25} color={THEME.text} anchorX="center">
        {formatValue(zRange.min)}
      </Text>
      <Text position={[0, -0.5, 10]} fontSize={0.25} color={THEME.text} anchorX="center">
        {formatValue(zRange.max)}
      </Text>

      {/* Grid lines on XZ plane */}
      {[2, 4, 6, 8].map(i => (
        <group key={`grid-${i}`}>
          <Line points={[[i, 0, 0], [i, 0, 10]]} color={THEME.grid} lineWidth={0.5} />
          <Line points={[[0, 0, i], [10, 0, i]]} color={THEME.grid} lineWidth={0.5} />
        </group>
      ))}

      {/* Grid lines on XY plane (back) */}
      {[2, 4, 6, 8].map(i => (
        <group key={`grid-xy-${i}`}>
          <Line points={[[i, 0, 0], [i, 10, 0]]} color={THEME.grid} lineWidth={0.3} opacity={0.5} />
          <Line points={[[0, i, 0], [10, i, 0]]} color={THEME.grid} lineWidth={0.3} opacity={0.5} />
        </group>
      ))}
    </group>
  )
}

// Calculate terrain surface using Inverse Distance Weighting interpolation
function calculateTerrainGrid(
  points: { x: number, y: number, z: number }[],
  gridSize: number = 30
): { vertices: Float32Array, indices: Uint16Array, colors: Float32Array } {
  const step = 10 / (gridSize - 1)
  const power = 2 // IDW power parameter
  const smoothRadius = 1.5 // Radius for smoothing influence

  // Build height grid using IDW
  const heights: number[][] = []
  for (let zi = 0; zi < gridSize; zi++) {
    heights[zi] = []
    for (let xi = 0; xi < gridSize; xi++) {
      const gx = xi * step
      const gz = zi * step

      let weightSum = 0
      let valueSum = 0

      for (const p of points) {
        const dx = gx - p.x
        const dz = gz - p.z
        const dist = Math.sqrt(dx * dx + dz * dz)

        if (dist < 0.001) {
          // Exactly on a data point
          weightSum = 1
          valueSum = p.y
          break
        }

        const w = 1 / Math.pow(dist, power)
        weightSum += w
        valueSum += w * p.y
      }

      heights[zi][xi] = weightSum > 0 ? valueSum / weightSum : 0
    }
  }

  // Gaussian smoothing pass for organic look
  const smoothed: number[][] = []
  for (let zi = 0; zi < gridSize; zi++) {
    smoothed[zi] = []
    for (let xi = 0; xi < gridSize; xi++) {
      let wSum = 0
      let vSum = 0
      const radius = Math.ceil(smoothRadius / step)

      for (let dz = -radius; dz <= radius; dz++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nz = zi + dz
          const nx = xi + dx
          if (nz < 0 || nz >= gridSize || nx < 0 || nx >= gridSize) continue

          const dist = Math.sqrt(dx * dx + dz * dz) * step
          const w = Math.exp(-(dist * dist) / (2 * smoothRadius * smoothRadius))
          wSum += w
          vSum += w * heights[nz][nx]
        }
      }

      smoothed[zi][xi] = Math.max(0, Math.min(10, wSum > 0 ? vSum / wSum : 0))
    }
  }

  // Build vertex buffer and color buffer
  const vertexCount = gridSize * gridSize
  const vertices = new Float32Array(vertexCount * 3)
  const colors = new Float32Array(vertexCount * 3)

  // Find height range for color mapping
  let minH = Infinity, maxH = -Infinity
  for (let zi = 0; zi < gridSize; zi++) {
    for (let xi = 0; xi < gridSize; xi++) {
      minH = Math.min(minH, smoothed[zi][xi])
      maxH = Math.max(maxH, smoothed[zi][xi])
    }
  }
  const hRange = maxH - minH || 1

  for (let zi = 0; zi < gridSize; zi++) {
    for (let xi = 0; xi < gridSize; xi++) {
      const idx = zi * gridSize + xi
      const h = smoothed[zi][xi]

      vertices[idx * 3] = xi * step       // x
      vertices[idx * 3 + 1] = h           // y (height)
      vertices[idx * 3 + 2] = zi * step   // z

      // Color by height: deep blue (valleys) -> bright cyan (peaks)
      const t = (h - minH) / hRange
      colors[idx * 3] = 0.02 + t * 0.02     // R: very low
      colors[idx * 3 + 1] = 0.15 + t * 0.55 // G: 0.15 -> 0.70
      colors[idx * 3 + 2] = 0.35 + t * 0.48 // B: 0.35 -> 0.83
    }
  }

  // Build index buffer (two triangles per grid cell)
  const cellCount = (gridSize - 1) * (gridSize - 1)
  const indices = new Uint16Array(cellCount * 6)
  let idx = 0

  for (let zi = 0; zi < gridSize - 1; zi++) {
    for (let xi = 0; xi < gridSize - 1; xi++) {
      const topLeft = zi * gridSize + xi
      const topRight = topLeft + 1
      const bottomLeft = (zi + 1) * gridSize + xi
      const bottomRight = bottomLeft + 1

      indices[idx++] = topLeft
      indices[idx++] = bottomLeft
      indices[idx++] = topRight

      indices[idx++] = topRight
      indices[idx++] = bottomLeft
      indices[idx++] = bottomRight
    }
  }

  return { vertices, indices, colors }
}

// Holographic terrain surface - Star Wars hologram style
interface TerrainSurfaceProps {
  points: { x: number, y: number, z: number }[]
}

function TerrainSurface({ points }: TerrainSurfaceProps) {
  const terrain = useMemo(() => calculateTerrainGrid(points, 30), [points])

  const vertexCount = terrain.vertices.length / 3
  const indexCount = terrain.indices.length

  return (
    <group>
      {/* Solid transparent fill */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={terrain.vertices}
            count={vertexCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={terrain.colors}
            count={vertexCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={terrain.indices}
            count={indexCount}
            itemSize={1}
          />
        </bufferGeometry>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.10}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Wireframe overlay for hologram grid-line effect */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={terrain.vertices}
            count={vertexCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={terrain.colors}
            count={vertexCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={terrain.indices}
            count={indexCount}
            itemSize={1}
          />
        </bufferGeometry>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.35}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Scene content
interface SceneProps {
  data: MorganScatterPoint[]
  axisConfig: AxisConfig
  invertConfig: InvertConfig
  showTrendPlane: boolean
  selectedCoinId: string | null
  isMobile: boolean
  onSelect: (coin: MorganScatterPoint, position: { x: number, y: number }) => void
}

function Scene({ data, axisConfig, invertConfig, showTrendPlane, selectedCoinId, isMobile, onSelect }: SceneProps) {
  const processedData = useMemo(() => {
    if (data.length === 0) return null

    const xValues = data.map(d => getValue(d, axisConfig.x))
    const yValues = data.map(d => getValue(d, axisConfig.y))
    const zValues = axisConfig.z ? data.map(d => getValue(d, axisConfig.z!)) : data.map(() => 0)

    const xNorm = normalizeData(xValues, invertConfig.x)
    const yNorm = normalizeData(yValues, invertConfig.y)
    const zNorm = normalizeData(zValues, invertConfig.z)

    const outlierScores = calculateOutlierScores(data, axisConfig, invertConfig)

    const points = data.map((coin, i) => ({
      coin,
      position: [xNorm.normalized[i], yNorm.normalized[i], zNorm.normalized[i]] as [number, number, number],
      color: getColor(outlierScores[i]),
      size: 0.32 + outlierScores[i] * 0.22,
      score: outlierScores[i]
    }))

    // Extract normalized positions for terrain surface
    const terrainPoints = points.map(p => ({
      x: p.position[0],
      y: p.position[1],
      z: p.position[2]
    }))

    return {
      points,
      // When inverted, low values are at top (position 10), so swap labels
      xRange: invertConfig.x
        ? { min: xNorm.max, max: xNorm.min }
        : { min: xNorm.min, max: xNorm.max },
      yRange: invertConfig.y
        ? { min: yNorm.max, max: yNorm.min }
        : { min: yNorm.min, max: yNorm.max },
      zRange: invertConfig.z
        ? { min: zNorm.max, max: zNorm.min }
        : { min: zNorm.min, max: zNorm.max },
      terrainPoints
    }
  }, [data, axisConfig, invertConfig])

  if (!processedData) return null

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[15, 15, 15]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      <Axes
        xLabel={AXIS_LABELS[axisConfig.x]}
        yLabel={AXIS_LABELS[axisConfig.y]}
        zLabel={axisConfig.z ? AXIS_LABELS[axisConfig.z] : ''}
        xRange={processedData.xRange}
        yRange={processedData.yRange}
        zRange={processedData.zRange}
      />

      {showTrendPlane && <TerrainSurface points={processedData.terrainPoints} />}

      {processedData.points.map((point) => (
        <DataPoint
          key={point.coin.id}
          position={point.position}
          color={point.color}
          size={point.size}
          coin={point.coin}
          isSelected={selectedCoinId === point.coin.id}
          showLabel={!isMobile && point.score >= 0.50}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

// Info card overlay (dismissible)
interface InfoCardProps {
  coin: MorganScatterPoint | null
  onClose: () => void
}

function InfoCard({ coin, onClose }: InfoCardProps) {
  if (!coin) return null

  return (
    <div className="absolute top-4 left-4 z-50 bg-slate-800/95 border border-slate-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-[280px]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-white text-lg">{coin.id}</h3>
          {coin.keyDate && (
            <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full mt-1">
              KEY DATE
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Mintage</span>
          <span className="text-white font-medium">{coin.mintage.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Est. Survival</span>
          <span className="text-white font-medium">{coin.survival.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Survival Rate</span>
          <span className="text-white font-medium">{((coin.survival / coin.mintage) * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">MS-65 Pop</span>
          <span className="text-white font-medium">{coin.pop65.toLocaleString()}</span>
        </div>
        <div className="border-t border-slate-700 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">MS-65 Value</span>
            <span className="text-green-400 font-bold text-lg">${coin.value65.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Color legend with gradient bar
function ColorLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-slate-800/95 rounded-lg p-2.5 border border-slate-700 shadow-lg">
      <p className="text-xs text-slate-400 mb-1.5 text-center font-medium">Outlier Score</p>
      <div
        className="w-24 h-3 rounded-full"
        style={{
          background: 'linear-gradient(to right, #0096ff, #00ffc8, #32ff50, #ffff00, #ff8200, #ff1e64)'
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-500">Low</span>
        <span className="text-[10px] text-slate-500">High</span>
      </div>
    </div>
  )
}

export function ScatterPlot3DThree({ data, axisConfig, invertConfig, showTrendPlane }: ScatterPlot3DThreeProps) {
  const [selectedCoin, setSelectedCoin] = useState<MorganScatterPoint | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const handleSelect = useCallback((coin: MorganScatterPoint) => {
    setSelectedCoin(prev => prev?.id === coin.id ? null : coin)
  }, [])

  const handleCloseInfo = useCallback(() => {
    setSelectedCoin(null)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden shadow-2xl ${
        isFullscreen ? 'h-screen' : 'h-[420px] sm:h-[480px] md:h-[600px]'
      }`}
      style={{ background: THEME.bg }}
    >
      <Canvas
        camera={{
          position: [15, 12, 15],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={[THEME.bg]} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          target={[5, 5, 5]}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />

        <Scene
          data={data}
          axisConfig={axisConfig}
          invertConfig={invertConfig}
          showTrendPlane={showTrendPlane}
          selectedCoinId={selectedCoin?.id || null}
          isMobile={isMobile}
          onSelect={handleSelect}
        />
      </Canvas>

      <InfoCard coin={selectedCoin} onClose={handleCloseInfo} />
      <ColorLegend />

      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors shadow-lg"
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      {/* Touch hint for mobile */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 sm:hidden">
        Tap coin for info | 2 fingers: zoom/pan
      </div>
    </div>
  )
}
