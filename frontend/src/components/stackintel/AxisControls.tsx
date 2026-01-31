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

  const selectClass = "flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-600 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
  const labelClass = "text-sm font-semibold text-slate-300 uppercase tracking-wide min-w-[20px]"

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      {/* X-Axis */}
      <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto">
        <label className={labelClass}>X</label>
        <select
          value={axisConfig.x}
          onChange={(e) => handleChange('x', e.target.value as AxisVariable)}
          className={selectClass}
        >
          {AXIS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{AXIS_LABELS[opt]}</option>
          ))}
        </select>
      </div>

      {/* Y-Axis */}
      <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto">
        <label className={labelClass}>Y</label>
        <select
          value={axisConfig.y}
          onChange={(e) => handleChange('y', e.target.value as AxisVariable)}
          className={selectClass}
        >
          {AXIS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{AXIS_LABELS[opt]}</option>
          ))}
        </select>
      </div>

      {/* Z-Axis (only in 3D mode) */}
      {is3D && (
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto">
          <label className={labelClass}>Z</label>
          <select
            value={axisConfig.z || 'pop65'}
            onChange={(e) => handleChange('z', e.target.value as AxisVariable)}
            className={selectClass}
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
