import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { MorganScatterPoint, AxisConfig, AXIS_LABELS, AxisVariable } from '../../types/morganScatterData'

// Hook to detect mobile viewport
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

interface ScatterPlot3DProps {
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
  const isMobile = useIsMobile()

  const plotData = useMemo(() => {
    const xData = data.map(d => getValue(d, axisConfig.x))
    const yData = data.map(d => getValue(d, axisConfig.y))
    const zData = axisConfig.z ? data.map(d => getValue(d, axisConfig.z!)) : data.map(() => 0)

    const outlierScores = calculateOutlierScores(data, axisConfig)

    // Size based on outlier score: 10-28px for better visibility
    const sizes = outlierScores.map(score => 10 + score * 18)

    // Hover text with coin details - styled
    const hoverText = data.map((d) =>
      `<b style="font-size:14px">${d.id}</b><br>` +
      `<span style="color:#94a3b8">Mintage:</span> ${d.mintage.toLocaleString()}<br>` +
      `<span style="color:#94a3b8">Survival:</span> ${d.survival.toLocaleString()}<br>` +
      `<span style="color:#94a3b8">MS-65 Pop:</span> ${d.pop65.toLocaleString()}<br>` +
      `<span style="color:#22c55e;font-weight:bold">MS-65 Value: $${d.value65.toLocaleString()}</span><br>` +
      `${d.keyDate ? '<span style="color:#f59e0b;font-weight:bold">⭐ KEY DATE</span>' : ''}`
    )

    // Custom colorscale: blue -> cyan -> gold -> orange for outliers
    const customColorscale: [number, string][] = [
      [0, '#3b82f6'],
      [0.25, '#06b6d4'],
      [0.5, '#22c55e'],
      [0.75, '#f59e0b'],
      [1, '#ef4444']
    ]

    // Responsive colorbar config
    const colorbarConfig = isMobile ? {
      title: { text: '', font: { color: THEME.text } },
      tickfont: { color: THEME.text, size: 8 },
      bgcolor: 'rgba(0,0,0,0)',
      bordercolor: THEME.grid,
      thickness: 10,
      len: 0.4,
      x: 1.02
    } : {
      title: { text: 'Outlier Score', font: { color: THEME.text } },
      tickfont: { color: THEME.text },
      bgcolor: 'rgba(0,0,0,0)',
      bordercolor: THEME.grid,
      thickness: 15,
      len: 0.6
    }

    const trace: Partial<Plotly.Data> = is3D ? {
      type: 'scatter3d',
      mode: 'markers',
      x: xData,
      y: yData,
      z: zData,
      marker: {
        size: isMobile ? sizes.map(s => s * 0.8) : sizes,
        color: outlierScores,
        colorscale: customColorscale,
        opacity: 0.9,
        line: { color: 'rgba(255,255,255,0.3)', width: 1 },
        colorbar: colorbarConfig
      },
      text: hoverText,
      hoverinfo: 'text',
      hoverlabel: {
        bgcolor: '#1e293b',
        bordercolor: '#475569',
        font: { color: '#f1f5f9', size: isMobile ? 10 : 12 }
      },
      name: 'Morgan Dollars'
    } : {
      type: 'scatter',
      mode: 'markers',
      x: xData,
      y: yData,
      marker: {
        size: isMobile ? sizes.map(s => s * 0.8) : sizes,
        color: outlierScores,
        colorscale: customColorscale,
        opacity: 0.9,
        line: { color: 'rgba(255,255,255,0.4)', width: 1.5 },
        colorbar: colorbarConfig
      },
      text: hoverText,
      hoverinfo: 'text',
      hoverlabel: {
        bgcolor: '#1e293b',
        bordercolor: '#475569',
        font: { color: '#f1f5f9', size: isMobile ? 10 : 12 }
      },
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
        opacity: 0.25,
        color: '#06b6d4',
        name: 'Median Plane',
        flatshading: true,
        hoverinfo: 'skip' as const
      }
      traces.push(planeTrace as Plotly.Data)
    }

    return traces
  }, [data, axisConfig, showTrendPlane, is3D, isMobile])

  const layout: Partial<Plotly.Layout> = useMemo(() => {
    const tickSize = isMobile ? 9 : 11
    const titleSize = isMobile ? 11 : 13

    const axisStyle = {
      gridcolor: THEME.grid,
      linecolor: THEME.grid,
      zerolinecolor: THEME.grid,
      showbackground: true,
      backgroundcolor: THEME.plotBg,
      tickfont: { color: THEME.text, size: tickSize },
      titlefont: { color: THEME.text, size: titleSize }
    }

    const baseLayout = {
      autosize: true,
      margin: isMobile ? { l: 35, r: 25, b: 40, t: 25 } : { l: 60, r: 50, b: 60, t: 40 },
      paper_bgcolor: THEME.bg,
      plot_bgcolor: THEME.plotBg,
      hovermode: 'closest' as const,
      showlegend: false,
      font: { color: THEME.text, size: isMobile ? 10 : 12 }
    }

    if (is3D) {
      return {
        ...baseLayout,
        scene: {
          xaxis: {
            title: { text: AXIS_LABELS[axisConfig.x], font: { color: THEME.text, size: titleSize } },
            ...axisStyle,
            spikecolor: THEME.accent,
            spikethickness: 1,
            nticks: isMobile ? 4 : 6,
            showspikes: false
          },
          yaxis: {
            title: { text: AXIS_LABELS[axisConfig.y], font: { color: THEME.text, size: titleSize } },
            ...axisStyle,
            spikecolor: THEME.accent,
            spikethickness: 1,
            nticks: isMobile ? 4 : 6,
            showspikes: false
          },
          zaxis: {
            title: { text: AXIS_LABELS[axisConfig.z!], font: { color: THEME.text, size: titleSize } },
            ...axisStyle,
            spikecolor: THEME.accent,
            spikethickness: 1,
            nticks: isMobile ? 4 : 6,
            showspikes: false
          },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.2 },
            center: { x: 0, y: 0, z: 0 },
            up: { x: 0, y: 0, z: 1 },
            projection: { type: 'perspective' }
          },
          aspectmode: 'cube' as const,
          dragmode: 'turntable' as const,
          hovermode: 'closest' as const
        },
        dragmode: 'turntable' as const
      }
    } else {
      return {
        ...baseLayout,
        xaxis: {
          title: { text: AXIS_LABELS[axisConfig.x], font: { color: THEME.text } },
          gridcolor: THEME.grid,
          linecolor: THEME.grid,
          tickfont: { color: THEME.text },
          zeroline: false
        },
        yaxis: {
          title: { text: AXIS_LABELS[axisConfig.y], font: { color: THEME.text } },
          gridcolor: THEME.grid,
          linecolor: THEME.grid,
          tickfont: { color: THEME.text },
          zeroline: false
        }
      }
    }
  }, [axisConfig, is3D, isMobile])

  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: !isMobile,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false,
    scrollZoom: true,
    doubleClick: 'reset' as const
  }

  return (
    <div
      className="w-full h-[380px] sm:h-[480px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl"
      style={{ background: THEME.bg, touchAction: 'none' }}
    >
      <Plot
        data={plotData as Plotly.Data[]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        useResizeHandler
      />
    </div>
  )
}
