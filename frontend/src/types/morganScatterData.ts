export interface MorganScatterPoint {
  id: string           // "1893-S"
  year: number
  mint: string         // "P", "S", "O", "CC"
  mintage: number      // Original mintage
  survival: number     // Estimated survivors
  pop65: number        // MS-65 population
  value65: number      // MS-65 value in USD
  keyDate: boolean
  outlierScore?: number // Computed: 0-1 distance from trend plane
  survivalRate?: number // Computed: survival/mintage percentage
  valuePerPop?: number  // Computed: value65/pop65 ratio
}

export type AxisVariable = 'survival' | 'pop65' | 'value65' | 'mintage' | 'survivalRate' | 'valuePerPop'

export interface AxisConfig {
  x: AxisVariable
  y: AxisVariable
  z: AxisVariable | null  // null = 2D mode
}

export interface FilterConfig {
  keyDatesOnly: boolean
  mints: string[]         // ['P', 'S', 'O', 'CC']
  yearRange: [number, number]  // [1878, 1921]
}

export const AXIS_LABELS: Record<AxisVariable, string> = {
  survival: 'Estimated Survival',
  pop65: 'MS-65 Population',
  value65: 'MS-65 Value ($)',
  mintage: 'Original Mintage',
  survivalRate: 'Survival Rate (%)',
  valuePerPop: 'Value per Pop ($)'
}
