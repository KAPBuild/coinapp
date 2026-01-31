interface ViewModeToggleProps {
  is3D: boolean
  onChange: (is3D: boolean) => void
}

export function ViewModeToggle({ is3D, onChange }: ViewModeToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-600 overflow-hidden bg-slate-800 shadow-lg">
      <button
        onClick={() => onChange(false)}
        className={`px-5 py-2.5 text-sm font-bold transition-all ${
          !is3D
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-inner'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        2D
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-5 py-2.5 text-sm font-bold transition-all ${
          is3D
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-inner'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        3D
      </button>
    </div>
  )
}
