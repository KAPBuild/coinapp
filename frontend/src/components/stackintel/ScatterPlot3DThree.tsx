import { useMemo, useState, useCallback } from 'react'
import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { MorganScatterPoint, AxisConfig, AXIS_LABELS, AxisVariable } from '../../types/morganScatterData'

interface ScatterPlot3DThreeProps {
  data: MorganScatterPoint[]
  axisConfig: AxisConfig
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

// Color gradient based on outlier score
function getColor(score: number): string {
  if (score < 0.25) return '#3b82f6'      // blue
  if (score < 0.5) return '#06b6d4'       // cyan
  if (score < 0.75) return '#22c55e'      // green
  if (score < 0.9) return '#f59e0b'       // amber
  return '#ef4444'                         // red
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
function normalizeData(values: number[]): { normalized: number[], min: number, max: number } {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return {
    normalized: values.map(v => ((v - min) / range) * 10),
    min,
    max
  }
}

// Calculate outlier scores
function calculateOutlierScores(data: MorganScatterPoint[], axisConfig: AxisConfig): number[] {
  if (data.length === 0) return []
  const yValues = data.map(d => getValue(d, axisConfig.y))
  const sortedY = [...yValues].sort((a, b) => a - b)
  const median = sortedY[Math.floor(sortedY.length / 2)]
  const maxDev = Math.max(...yValues.map(v => Math.abs(v - median)))
  return data.map(d => {
    const yVal = getValue(d, axisConfig.y)
    const deviation = Math.abs(yVal - median)
    return maxDev > 0 ? deviation / maxDev : 0
  })
}

// Single data point sphere
interface DataPointProps {
  position: [number, number, number]
  color: string
  size: number
  coin: MorganScatterPoint
  onHover: (coin: MorganScatterPoint | null, position: { x: number, y: number } | null) => void
}

function DataPoint({ position, color, size, coin, onHover }: DataPointProps) {
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    onHover(coin, { x: e.clientX, y: e.clientY })
  }, [coin, onHover])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    onHover(null, null)
  }, [onHover])

  return (
    <mesh
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[hovered ? size * 1.3 : size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
        transparent
        opacity={0.9}
      />
    </mesh>
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

// Median plane
interface MedianPlaneProps {
  yMedian: number
}

function MedianPlane({ yMedian }: MedianPlaneProps) {
  return (
    <mesh position={[5, yMedian, 5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color="#06b6d4"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Scene content
interface SceneProps {
  data: MorganScatterPoint[]
  axisConfig: AxisConfig
  showTrendPlane: boolean
  onHover: (coin: MorganScatterPoint | null, position: { x: number, y: number } | null) => void
}

function Scene({ data, axisConfig, showTrendPlane, onHover }: SceneProps) {
  const processedData = useMemo(() => {
    if (data.length === 0) return null

    const xValues = data.map(d => getValue(d, axisConfig.x))
    const yValues = data.map(d => getValue(d, axisConfig.y))
    const zValues = axisConfig.z ? data.map(d => getValue(d, axisConfig.z!)) : data.map(() => 0)

    const xNorm = normalizeData(xValues)
    const yNorm = normalizeData(yValues)
    const zNorm = normalizeData(zValues)

    const outlierScores = calculateOutlierScores(data, axisConfig)

    const points = data.map((coin, i) => ({
      coin,
      position: [xNorm.normalized[i], yNorm.normalized[i], zNorm.normalized[i]] as [number, number, number],
      color: getColor(outlierScores[i]),
      size: 0.15 + outlierScores[i] * 0.15,
      score: outlierScores[i]
    }))

    // Calculate median Y for trend plane
    const sortedY = [...yNorm.normalized].sort((a, b) => a - b)
    const yMedian = sortedY[Math.floor(sortedY.length / 2)]

    return {
      points,
      xRange: { min: xNorm.min, max: xNorm.max },
      yRange: { min: yNorm.min, max: yNorm.max },
      zRange: { min: zNorm.min, max: zNorm.max },
      yMedian
    }
  }, [data, axisConfig])

  if (!processedData) return null

  return (
    <>
      <ambientLight intensity={0.6} />
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

      {showTrendPlane && <MedianPlane yMedian={processedData.yMedian} />}

      {processedData.points.map((point) => (
        <DataPoint
          key={point.coin.id}
          position={point.position}
          color={point.color}
          size={point.size}
          coin={point.coin}
          onHover={onHover}
        />
      ))}
    </>
  )
}

// Tooltip overlay
interface TooltipProps {
  coin: MorganScatterPoint | null
  position: { x: number, y: number } | null
}

function Tooltip({ coin, position }: TooltipProps) {
  if (!coin || !position) return null

  return (
    <div
      className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl"
      style={{
        left: position.x + 15,
        top: position.y + 15,
        maxWidth: 200
      }}
    >
      <p className="font-bold text-white text-sm">{coin.id}</p>
      <p className="text-slate-400 text-xs">Mintage: {coin.mintage.toLocaleString()}</p>
      <p className="text-slate-400 text-xs">Survival: {coin.survival.toLocaleString()}</p>
      <p className="text-slate-400 text-xs">MS-65 Pop: {coin.pop65.toLocaleString()}</p>
      <p className="text-green-400 text-xs font-semibold">MS-65 Value: ${coin.value65.toLocaleString()}</p>
      {coin.keyDate && <p className="text-amber-400 text-xs font-semibold">KEY DATE</p>}
    </div>
  )
}

// Color legend
function ColorLegend() {
  const colors = [
    { color: '#3b82f6', label: 'Low' },
    { color: '#06b6d4', label: '' },
    { color: '#22c55e', label: 'Med' },
    { color: '#f59e0b', label: '' },
    { color: '#ef4444', label: 'High' }
  ]

  return (
    <div className="absolute bottom-4 right-4 bg-slate-800/90 rounded-lg p-2 border border-slate-700">
      <p className="text-xs text-slate-400 mb-1 text-center">Outlier Score</p>
      <div className="flex gap-1">
        {colors.map((c, i) => (
          <div key={i} className="text-center">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: c.color }}
            />
            {c.label && <p className="text-[10px] text-slate-400 mt-0.5">{c.label}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScatterPlot3DThree({ data, axisConfig, showTrendPlane }: ScatterPlot3DThreeProps) {
  const [hoveredCoin, setHoveredCoin] = useState<MorganScatterPoint | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null)

  const handleHover = useCallback((coin: MorganScatterPoint | null, position: { x: number, y: number } | null) => {
    setHoveredCoin(coin)
    setHoverPosition(position)
  }, [])

  return (
    <div
      className="relative w-full h-[380px] sm:h-[480px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl"
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
          showTrendPlane={showTrendPlane}
          onHover={handleHover}
        />
      </Canvas>

      <Tooltip coin={hoveredCoin} position={hoverPosition} />
      <ColorLegend />

      {/* Touch hint for mobile */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 sm:hidden">
        1 finger: rotate | 2 fingers: zoom/pan
      </div>
    </div>
  )
}
