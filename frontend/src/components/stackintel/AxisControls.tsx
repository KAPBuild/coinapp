import { AxisConfig, AxisVariable, AXIS_LABELS } from '../../types/morganScatterData'

interface AxisControlsProps {
  axisConfig: AxisConfig
  onChange: (config: AxisConfig) => void
}

const AXIS_OPTIONS: AxisVariable[] = ['survival', 'pop65', 'value65', 'mintage', 'survivalRate', 'valuePerPop']

export function AxisControls({ axisConfig, onChange }: AxisControlsProps) {
  const is3D = axisConfig.z !== null

  const handleChange = (axis: 'x' | 'y' | 'z', value: AxisVariable) => {
    onChange({
      ...axisConfig,
      [axis]: value
    })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* X-Axis */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">X:</label>
        <select
          value={axisConfig.x}
          onChange={(e) => handleChange('x', e.target.value as AxisVariable)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {AXIS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{AXIS_LABELS[opt]}</option>
          ))}
        </select>
      </div>

      {/* Y-Axis */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Y:</label>
        <select
          value={axisConfig.y}
          onChange={(e) => handleChange('y', e.target.value as AxisVariable)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {AXIS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{AXIS_LABELS[opt]}</option>
          ))}
        </select>
      </div>

      {/* Z-Axis (only in 3D mode) */}
      {is3D && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Z:</label>
          <select
            value={axisConfig.z || 'pop65'}
            onChange={(e) => handleChange('z', e.target.value as AxisVariable)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {AXIS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{AXIS_LABELS[opt]}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
