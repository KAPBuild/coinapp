import { useState } from 'react'
import { X, ExternalLink, HelpCircle, ChevronDown } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectGrade?: (grade: string) => void
  initialCoinType?: string
}

// Coin types available on PCGS Photograde
const COIN_TYPES = [
  { id: 'morgan', label: 'Morgan Dollar', years: '1878-1921' },
  { id: 'peace', label: 'Peace Dollar', years: '1921-1935' },
  { id: 'walking-liberty-half', label: 'Walking Liberty Half', years: '1916-1947' },
  { id: 'franklin-half', label: 'Franklin Half', years: '1948-1963' },
  { id: 'kennedy-half', label: 'Kennedy Half', years: '1964-present' },
  { id: 'standing-liberty-quarter', label: 'Standing Liberty Quarter', years: '1916-1930' },
  { id: 'washington-quarter', label: 'Washington Quarter', years: '1932-present' },
  { id: 'mercury-dime', label: 'Mercury Dime', years: '1916-1945' },
  { id: 'roosevelt-dime', label: 'Roosevelt Dime', years: '1946-present' },
  { id: 'buffalo-nickel', label: 'Buffalo Nickel', years: '1913-1938' },
  { id: 'lincoln-cent', label: 'Lincoln Cent', years: '1909-present' },
  { id: 'indian-head-cent', label: 'Indian Head Cent', years: '1859-1909' },
  { id: 'saint-gaudens', label: 'Saint-Gaudens $20', years: '1907-1933' },
  { id: 'liberty-head-eagle', label: 'Liberty Head Eagle', years: '1838-1907' },
]

// Grade categories with descriptions
const GRADE_CATEGORIES = [
  {
    name: 'Poor to Fair',
    color: 'bg-red-100 border-red-300',
    textColor: 'text-red-800',
    grades: [
      { grade: 'P-1', name: 'Poor', description: 'Barely identifiable, extremely heavy wear' },
      { grade: 'FR-2', name: 'Fair', description: 'Mostly worn smooth, type identifiable' },
    ]
  },
  {
    name: 'About Good to Good',
    color: 'bg-orange-100 border-orange-300',
    textColor: 'text-orange-800',
    grades: [
      { grade: 'AG-3', name: 'About Good', description: 'Very heavily worn, outline visible' },
      { grade: 'G-4', name: 'Good', description: 'Heavily worn, design visible but flat' },
      { grade: 'G-6', name: 'Good+', description: 'Heavily worn, slightly more detail than G-4' },
    ]
  },
  {
    name: 'Very Good',
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-800',
    grades: [
      { grade: 'VG-8', name: 'Very Good', description: 'Well worn, main features clear' },
      { grade: 'VG-10', name: 'Very Good+', description: 'Well worn, slightly sharper than VG-8' },
    ]
  },
  {
    name: 'Fine',
    color: 'bg-lime-100 border-lime-300',
    textColor: 'text-lime-800',
    grades: [
      { grade: 'F-12', name: 'Fine', description: 'Moderate wear on high points, all lettering visible' },
      { grade: 'F-15', name: 'Fine+', description: 'Moderate wear, slightly more detail than F-12' },
    ]
  },
  {
    name: 'Very Fine',
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-800',
    grades: [
      { grade: 'VF-20', name: 'Very Fine', description: 'Light wear on high points, all details sharp' },
      { grade: 'VF-25', name: 'Very Fine+', description: 'Light wear, slightly better than VF-20' },
      { grade: 'VF-30', name: 'Choice VF', description: 'Light wear on highest points only' },
      { grade: 'VF-35', name: 'Choice VF+', description: 'Minimal wear on highest points' },
    ]
  },
  {
    name: 'Extremely Fine',
    color: 'bg-teal-100 border-teal-300',
    textColor: 'text-teal-800',
    grades: [
      { grade: 'EF-40', name: 'Extremely Fine', description: 'Light wear on high points, all features sharp' },
      { grade: 'EF-45', name: 'Choice EF', description: 'Slight wear on highest points, traces of luster' },
    ]
  },
  {
    name: 'About Uncirculated',
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-800',
    grades: [
      { grade: 'AU-50', name: 'About Uncirculated', description: 'Trace wear on high points, half luster' },
      { grade: 'AU-53', name: 'About Unc+', description: 'Obvious wear on high points, partial luster' },
      { grade: 'AU-55', name: 'Choice AU', description: 'Light wear on high points, most luster present' },
      { grade: 'AU-58', name: 'Choice AU+', description: 'Slight wear on highest points, nearly full luster' },
    ]
  },
  {
    name: 'Mint State (Uncirculated)',
    color: 'bg-purple-100 border-purple-300',
    textColor: 'text-purple-800',
    grades: [
      { grade: 'MS-60', name: 'Mint State Basal', description: 'No wear, may have heavy marks/hairlines' },
      { grade: 'MS-61', name: 'Mint State', description: 'No wear, noticeable blemishes' },
      { grade: 'MS-62', name: 'Mint State', description: 'No wear, slightly less marks than MS-61' },
      { grade: 'MS-63', name: 'Choice', description: 'Moderate marks/blemishes, good eye appeal' },
      { grade: 'MS-64', name: 'Choice+', description: 'Few marks, above average eye appeal' },
      { grade: 'MS-65', name: 'Gem', description: 'Strong luster, light marks, excellent appeal' },
      { grade: 'MS-66', name: 'Gem+', description: 'Well struck, very minor marks' },
      { grade: 'MS-67', name: 'Superb Gem', description: 'Sharp strike, virtually no marks' },
      { grade: 'MS-68', name: 'Superb Gem+', description: 'Nearly perfect, slight weakness allowed' },
      { grade: 'MS-69', name: 'Near Perfect', description: 'Near perfect, minute imperfection' },
      { grade: 'MS-70', name: 'Perfect', description: 'Perfect coin, no marks under 5x magnification' },
    ]
  },
  {
    name: 'Proof',
    color: 'bg-indigo-100 border-indigo-300',
    textColor: 'text-indigo-800',
    grades: [
      { grade: 'PF-60', name: 'Proof', description: 'Mirror surface, may have marks' },
      { grade: 'PF-63', name: 'Choice Proof', description: 'Reflective, moderate hairlines' },
      { grade: 'PF-65', name: 'Gem Proof', description: 'Minor hairlines, bright mirrors' },
      { grade: 'PF-67', name: 'Superb Gem Proof', description: 'Exceptional mirrors, minimal flaws' },
      { grade: 'PF-69', name: 'Near Perfect Proof', description: 'Nearly flawless surfaces' },
      { grade: 'PF-70', name: 'Perfect Proof', description: 'Flawless, perfect mirrors' },
    ]
  },
]

export function GradingChartModal({ isOpen, onClose, onSelectGrade, initialCoinType }: Props) {
  const [selectedCoinType, setSelectedCoinType] = useState(initialCoinType || 'morgan')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Mint State (Uncirculated)')

  if (!isOpen) return null

  const selectedCoin = COIN_TYPES.find(c => c.id === selectedCoinType)
  const pcgsUrl = `https://www.pcgs.com/photograde/#/${selectedCoinType}/grades`

  const handleGradeClick = (grade: string) => {
    if (onSelectGrade) {
      onSelectGrade(grade)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">PCGS Grading Reference</h3>
              <p className="text-blue-100 text-sm">Select a grade or view photos on PCGS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Coin Type Selector */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Coin Type</label>
              <select
                value={selectedCoinType}
                onChange={(e) => setSelectedCoinType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {COIN_TYPES.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.label} ({coin.years})
                  </option>
                ))}
              </select>
            </div>
            <a
              href={pcgsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" />
              View Photos on PCGS
            </a>
          </div>
          {selectedCoin && (
            <p className="text-sm text-gray-500 mt-2">
              Click any grade below to select it, or view detailed photos on PCGS Photograde.
            </p>
          )}
        </div>

        {/* Grade List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {GRADE_CATEGORIES.map((category) => (
              <div key={category.name} className={`border rounded-lg overflow-hidden ${category.color}`}>
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <span className={`font-semibold ${category.textColor}`}>{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.grades.length} grades</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Grades */}
                {expandedCategory === category.name && (
                  <div className="bg-white border-t border-gray-200">
                    {category.grades.map((gradeInfo) => (
                      <button
                        key={gradeInfo.grade}
                        onClick={() => handleGradeClick(gradeInfo.grade)}
                        className="w-full px-4 py-3 flex items-start gap-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-colors"
                      >
                        <span className="font-mono font-bold text-blue-600 w-16 flex-shrink-0">
                          {gradeInfo.grade}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{gradeInfo.name}</p>
                          <p className="text-sm text-gray-600">{gradeInfo.description}</p>
                        </div>
                        {onSelectGrade && (
                          <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded">
                            Select
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Grading standards based on PCGS/NGC Sheldon scale. Photos available on PCGS.com.
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.pcgs.com/photograde"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                PCGS Photograde
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://www.ngccoin.com/coin-grading/grading-scale/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                NGC Grading Scale
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
