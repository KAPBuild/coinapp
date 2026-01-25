interface ViewModeToggleProps {
  is3D: boolean
  onChange: (is3D: boolean) => void
}

export function ViewModeToggle({ is3D, onChange }: ViewModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          !is3D
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        2D
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          is3D
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        3D
      </button>
    </div>
  )
}
