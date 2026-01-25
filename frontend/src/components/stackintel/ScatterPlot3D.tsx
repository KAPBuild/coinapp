import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { MorganScatterPoint, AxisConfig, AXIS_LABELS, AxisVariable } from '../../types/morganScatterData'

interface ScatterPlot3DProps {
  data: MorganScatterPoint[]
  axisConfig: AxisConfig
  showTrendPlane: boolean
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

// Calculate outlier scores based on distance from median
function calculateOutlierScores(data: MorganScatterPoint[], axisConfig: AxisConfig): number[] {
  if (data.length === 0) return []

  const yValues = data.map(d => getValue(d, axisConfig.y))
  const median = yValues.sort((a, b) => a - b)[Math.floor(yValues.length / 2)]
  const maxDev = Math.max(...yValues.map(v => Math.abs(v - median)))

  return data.map(d => {
    const yVal = getValue(d, axisConfig.y)
    const deviation = Math.abs(yVal - median)
    return maxDev > 0 ? deviation / maxDev : 0
  })
}

export function ScatterPlot3D({ data, axisConfig, showTrendPlane }: ScatterPlot3DProps) {
  const is3D = axisConfig.z !== null

  const plotData = useMemo(() => {
    const xData = data.map(d => getValue(d, axisConfig.x))
    const yData = data.map(d => getValue(d, axisConfig.y))
    const zData = axisConfig.z ? data.map(d => getValue(d, axisConfig.z!)) : data.map(() => 0)

    const outlierScores = calculateOutlierScores(data, axisConfig)

    // Size based on outlier score: 8-20px
    const sizes = outlierScores.map(score => 8 + score * 12)

    // Hover text with coin details
    const hoverText = data.map((d) =>
      `<b>${d.id}</b><br>` +
      `Mintage: ${d.mintage.toLocaleString()}<br>` +
      `Survival: ${d.survival.toLocaleString()}<br>` +
      `MS-65 Pop: ${d.pop65.toLocaleString()}<br>` +
      `MS-65 Value: $${d.value65.toLocaleString()}<br>` +
      `${d.keyDate ? '<b>KEY DATE</b>' : ''}`
    )

    const trace: Partial<Plotly.Data> = is3D ? {
      type: 'scatter3d',
      mode: 'markers',
      x: xData,
      y: yData,
      z: zData,
      marker: {
        size: sizes,
        color: outlierScores,
        colorscale: 'YlOrRd',
        opacity: 0.85,
        line: { color: 'white', width: 1 }
      },
      text: hoverText,
      hoverinfo: 'text',
      name: 'Morgan Dollars'
    } : {
      type: 'scatter',
      mode: 'markers',
      x: xData,
      y: yData,
      marker: {
        size: sizes,
        color: outlierScores,
        colorscale: 'YlOrRd',
        opacity: 0.85,
        line: { color: 'white', width: 1 }
      },
      text: hoverText,
      hoverinfo: 'text',
      name: 'Morgan Dollars'
    }

    const traces: Partial<Plotly.Data>[] = [trace]

    // Add trend plane in 3D mode
    if (is3D && showTrendPlane && data.length > 3) {
      const xMin = Math.min(...xData)
      const xMax = Math.max(...xData)
      const zMin = Math.min(...zData)
      const zMax = Math.max(...zData)

      // Simple plane at median Y value
      const yMedian = yData.sort((a, b) => a - b)[Math.floor(yData.length / 2)]

      // Use scatter3d with a surface-like representation for the plane
      const planeTrace = {
        type: 'mesh3d' as const,
        x: [xMin, xMax, xMax, xMin],
        y: [yMedian, yMedian, yMedian, yMedian],
        z: [zMin, zMin, zMax, zMax],
        i: new Int32Array([0, 0]),
        j: new Int32Array([1, 2]),
        k: new Int32Array([2, 3]),
        opacity: 0.3,
        color: '#3b82f6',
        name: 'Median Plane',
        hoverinfo: 'skip' as const
      }
      traces.push(planeTrace as Plotly.Data)
    }

    return traces
  }, [data, axisConfig, showTrendPlane, is3D])

  const layout: Partial<Plotly.Layout> = useMemo(() => {
    const baseLayout = {
      autosize: true,
      margin: { l: 50, r: 30, b: 50, t: 30 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(249, 250, 251, 0.8)',
      hovermode: 'closest' as const,
      showlegend: false,
    }

    if (is3D) {
      return {
        ...baseLayout,
        scene: {
          xaxis: {
            title: { text: AXIS_LABELS[axisConfig.x] },
            gridcolor: '#e5e7eb',
            showbackground: true,
            backgroundcolor: 'rgba(249, 250, 251, 0.5)'
          },
          yaxis: {
            title: { text: AXIS_LABELS[axisConfig.y] },
            gridcolor: '#e5e7eb',
            showbackground: true,
            backgroundcolor: 'rgba(249, 250, 251, 0.5)'
          },
          zaxis: {
            title: { text: AXIS_LABELS[axisConfig.z!] },
            gridcolor: '#e5e7eb',
            showbackground: true,
            backgroundcolor: 'rgba(249, 250, 251, 0.5)'
          },
          camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
        }
      }
    } else {
      return {
        ...baseLayout,
        xaxis: {
          title: { text: AXIS_LABELS[axisConfig.x] },
          gridcolor: '#e5e7eb',
          zeroline: false
        },
        yaxis: {
          title: { text: AXIS_LABELS[axisConfig.y] },
          gridcolor: '#e5e7eb',
          zeroline: false
        }
      }
    }
  }, [axisConfig, is3D])

  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
  }

  return (
    <div className="w-full h-[500px] md:h-[600px] bg-gray-50 rounded-xl overflow-hidden">
      <Plot
        data={plotData as Plotly.Data[]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </div>
  )
}
