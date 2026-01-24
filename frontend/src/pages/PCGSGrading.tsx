import { useState } from 'react'
import { ExternalLink, HelpCircle, ChevronDown, Search } from 'lucide-react'

// Coin categories with their specific coin types
// PCGS Photograde URL format: https://www.pcgs.com/photograde/#/{slug}/grades
const COIN_CATEGORIES = [
  {
    id: 'dollars',
    label: 'Dollars',
    coins: [
      { id: 'seated-dollar', label: 'Seated Liberty Dollar', years: '1840-1873' },
      { id: 'trade', label: 'Trade Dollar', years: '1873-1885' },
      { id: 'morgan', label: 'Morgan Dollar', years: '1878-1921' },
      { id: 'peace', label: 'Peace Dollar', years: '1921-1935' },
    ]
  },
  {
    id: 'half-dollars',
    label: 'Half Dollars',
    coins: [
      { id: 'capped-bust-half', label: 'Capped Bust Half', years: '1807-1839' },
      { id: 'seated-half', label: 'Seated Liberty Half', years: '1839-1891' },
      { id: 'barber-half', label: 'Barber Half Dollar', years: '1892-1915' },
      { id: 'walker', label: 'Walking Liberty Half', years: '1916-1947' },
      { id: 'franklin', label: 'Franklin Half', years: '1948-1963' },
      { id: 'kennedy', label: 'Kennedy Half', years: '1964-present' },
    ]
  },
  {
    id: 'quarters',
    label: 'Quarters',
    coins: [
      { id: 'capped-bust-quarter', label: 'Capped Bust Quarter', years: '1815-1838' },
      { id: 'seated-quarter', label: 'Seated Liberty Quarter', years: '1838-1891' },
      { id: 'barber-quarter', label: 'Barber Quarter', years: '1892-1916' },
      { id: 'standing-liberty', label: 'Standing Liberty Quarter', years: '1916-1930' },
      { id: 'washington', label: 'Washington Quarter', years: '1932-present' },
    ]
  },
  {
    id: 'dimes',
    label: 'Dimes',
    coins: [
      { id: 'capped-bust-dime', label: 'Capped Bust Dime', years: '1809-1837' },
      { id: 'seated-dime', label: 'Seated Liberty Dime', years: '1837-1891' },
      { id: 'barber-dime', label: 'Barber Dime', years: '1892-1916' },
      { id: 'mercury', label: 'Mercury Dime', years: '1916-1945' },
      { id: 'roosevelt', label: 'Roosevelt Dime', years: '1946-present' },
    ]
  },
  {
    id: 'nickels',
    label: 'Nickels',
    coins: [
      { id: 'shield-nickel', label: 'Shield Nickel', years: '1866-1883' },
      { id: 'liberty-nickel', label: 'Liberty (V) Nickel', years: '1883-1913' },
      { id: 'buffalo', label: 'Buffalo Nickel', years: '1913-1938' },
      { id: 'jefferson', label: 'Jefferson Nickel', years: '1938-present' },
    ]
  },
  {
    id: 'cents',
    label: 'Cents',
    coins: [
      { id: 'classic-head', label: 'Classic Head Large Cent', years: '1808-1814' },
      { id: 'coronet', label: 'Coronet Head Large Cent', years: '1816-1839' },
      { id: 'braided-hair', label: 'Braided Hair Large Cent', years: '1839-1857' },
      { id: 'flying-eagle', label: 'Flying Eagle Cent', years: '1856-1858' },
      { id: 'indian', label: 'Indian Head Cent', years: '1859-1909' },
      { id: 'lincoln', label: 'Lincoln Cent', years: '1909-present' },
    ]
  },
  {
    id: 'gold',
    label: 'Gold',
    coins: [
      { id: 'liberty-eagle', label: 'Liberty $10 Eagle', years: '1838-1907' },
      { id: 'liberty-half-eagle', label: 'Liberty $5 Half Eagle', years: '1839-1908' },
      { id: 'liberty-quarter-eagle', label: 'Liberty $2.50', years: '1840-1907' },
      { id: 'gold-dollar', label: 'Gold Dollar', years: '1849-1889' },
      { id: 'liberty-double-eagle', label: 'Liberty $20', years: '1850-1907' },
      { id: 'saint-gaudens', label: 'Saint-Gaudens $20', years: '1907-1933' },
      { id: 'indian-eagle', label: 'Indian $10 Eagle', years: '1907-1933' },
      { id: 'indian-half-eagle', label: 'Indian $5 Half Eagle', years: '1908-1929' },
      { id: 'indian-quarter-eagle', label: 'Indian $2.50', years: '1908-1929' },
    ]
  },
]

// Flatten all coins for easy lookup
const ALL_COINS = COIN_CATEGORIES.flatMap(cat => cat.coins)

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

export function PCGSGrading() {
  const [selectedCategory, setSelectedCategory] = useState('dollars')
  const [selectedCoinType, setSelectedCoinType] = useState('morgan')
  const [expandedGradeCategories, setExpandedGradeCategories] = useState<string[]>(['Mint State (Uncirculated)', 'About Uncirculated'])
  const [searchQuery, setSearchQuery] = useState('')

  const currentCategory = COIN_CATEGORIES.find(c => c.id === selectedCategory)
  const selectedCoin = ALL_COINS.find(c => c.id === selectedCoinType)
  const pcgsUrl = `https://www.pcgs.com/photograde/#/${selectedCoinType}/grades`

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const category = COIN_CATEGORIES.find(c => c.id === categoryId)
    if (category && category.coins.length > 0) {
      setSelectedCoinType(category.coins[0].id)
    }
  }

  const toggleGradeCategory = (categoryName: string) => {
    setExpandedGradeCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    )
  }

  const expandAll = () => {
    setExpandedGradeCategories(GRADE_CATEGORIES.map(c => c.name))
  }

  const collapseAll = () => {
    setExpandedGradeCategories([])
  }

  // Filter grades based on search query
  const filteredCategories = GRADE_CATEGORIES.map(category => ({
    ...category,
    grades: category.grades.filter(g =>
      searchQuery === '' ||
      g.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.grades.length > 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <HelpCircle className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">PCGS Grading Guide</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use this guide to understand coin grading standards. Select a coin type and click to view detailed photos on PCGS Photograde.
        </p>
      </div>

      {/* Coin Type Selection */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Select Coin Type</h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {COIN_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Coins in Selected Category */}
        {currentCategory && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentCategory.coins.map(coin => (
                <a
                  key={coin.id}
                  href={`https://www.pcgs.com/photograde/#/${coin.id}/grades`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedCoinType(coin.id)}
                  className={`p-4 rounded-lg text-left transition-all block ${
                    selectedCoinType === coin.id
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-bold">{coin.label}</p>
                      <p className={`text-sm mt-1 ${selectedCoinType === coin.id ? 'text-blue-200' : 'text-slate-400'}`}>
                        {coin.years}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-60" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* PCGS Link Button */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium">Selected Coin</p>
              <h3 className="text-2xl font-bold text-white">{selectedCoin?.label}</h3>
              <p className="text-blue-200 mt-1">{selectedCoin?.years}</p>
            </div>
            <a
              href={pcgsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-gray-100 text-blue-700 rounded-lg font-bold text-lg transition-colors shadow-lg whitespace-nowrap"
            >
              Open PCGS Photograde
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grade Reference Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Grade Reference Chart</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search grades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-40 sm:w-48"
              />
            </div>
            {/* Expand/Collapse buttons */}
            <button
              onClick={expandAll}
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Grade Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.name} className={`border-2 rounded-xl overflow-hidden ${category.color}`}>
              {/* Category Header */}
              <button
                onClick={() => toggleGradeCategory(category.name)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${category.textColor}`}>{category.name}</span>
                  <span className="text-sm text-gray-600 bg-white/70 px-2 py-0.5 rounded-full">
                    {category.grades.length} grades
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedGradeCategories.includes(category.name) ? 'rotate-180' : ''}`} />
              </button>

              {/* Grades */}
              {expandedGradeCategories.includes(category.name) && (
                <div className="bg-white border-t border-gray-200">
                  <div className="grid gap-0 divide-y divide-gray-100">
                    {category.grades.map((gradeInfo) => (
                      <div
                        key={gradeInfo.grade}
                        className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-mono font-bold text-blue-600 text-lg w-16 flex-shrink-0">
                          {gradeInfo.grade}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{gradeInfo.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{gradeInfo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No grades found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">External Resources</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.pcgs.com/photograde"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
          >
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600">PCGS Photograde</p>
              <p className="text-sm text-gray-500">View detailed grade photos for all coin types</p>
            </div>
          </a>
          <a
            href="https://www.ngccoin.com/coin-grading/grading-scale/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
          >
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600">NGC Grading Scale</p>
              <p className="text-sm text-gray-500">Learn about the Sheldon grading scale</p>
            </div>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Grading standards based on the PCGS/NGC Sheldon scale (1-70).
        </p>
      </div>
    </div>
  )
}
