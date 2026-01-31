import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FilterConfig } from '../../types/morganScatterData'

interface FilterControlsProps {
  filters: FilterConfig
  onChange: (filters: FilterConfig) => void
}

const MINTS = ['P', 'S', 'O', 'CC']

export function FilterControls({ filters, onChange }: FilterControlsProps) {
  const [expanded, setExpanded] = useState(false)

  const handleMintToggle = (mint: string) => {
    const newMints = filters.mints.includes(mint)
      ? filters.mints.filter(m => m !== mint)
      : [...filters.mints, mint]
    onChange({ ...filters, mints: newMints })
  }

  const handleYearChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.yearRange] as [number, number]
    newRange[index] = value
    onChange({ ...filters, yearRange: newRange })
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg">
      {/* Mobile toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300"
      >
        Filters
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Filter content */}
      <div className={`${expanded ? 'block' : 'hidden'} md:block px-4 py-3 space-y-4 md:space-y-0 md:flex md:items-center md:gap-6`}>
        {/* Key Dates Only */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.keyDatesOnly}
            onChange={(e) => onChange({ ...filters, keyDatesOnly: e.target.checked })}
            className="w-4 h-4 text-cyan-500 rounded border-slate-500 bg-slate-700 focus:ring-cyan-500"
          />
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Key Dates Only</span>
        </label>

        {/* Mint Marks */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">Mints:</span>
          <div className="flex gap-1">
            {MINTS.map(mint => (
              <button
                key={mint}
                onClick={() => handleMintToggle(mint)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.mints.includes(mint)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                }`}
              >
                {mint}
              </button>
            ))}
          </div>
        </div>

        {/* Year Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">Years:</span>
          <input
            type="number"
            min={1878}
            max={1921}
            value={filters.yearRange[0]}
            onChange={(e) => handleYearChange(0, parseInt(e.target.value) || 1878)}
            className="w-16 px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <span className="text-slate-500">—</span>
          <input
            type="number"
            min={1878}
            max={1921}
            value={filters.yearRange[1]}
            onChange={(e) => handleYearChange(1, parseInt(e.target.value) || 1921)}
            className="w-16 px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  )
}
