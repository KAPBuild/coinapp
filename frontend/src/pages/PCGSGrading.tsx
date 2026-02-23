import { useState } from 'react'
import { ExternalLink, HelpCircle, ChevronDown, Search, BookOpen, Target, Zap, Star, Eye, Award } from 'lucide-react'

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

// Most popular coins for quick links (pros who just want the photo comparison)
const QUICK_LINK_COINS = [
  { id: 'morgan', label: 'Morgan Dollar', years: '1878-1921', emoji: '🦅' },
  { id: 'peace', label: 'Peace Dollar', years: '1921-1935', emoji: '🕊️' },
  { id: 'walker', label: 'Walking Liberty Half', years: '1916-1947', emoji: '🗽' },
  { id: 'franklin', label: 'Franklin Half', years: '1948-1963', emoji: '🔔' },
  { id: 'buffalo', label: 'Buffalo Nickel', years: '1913-1938', emoji: '🦬' },
  { id: 'mercury', label: 'Mercury Dime', years: '1916-1945', emoji: '⚡' },
  { id: 'lincoln', label: 'Lincoln Cent', years: '1909-present', emoji: '🪙' },
  { id: 'indian', label: 'Indian Head Cent', years: '1859-1909', emoji: '🪶' },
  { id: 'saint-gaudens', label: 'Saint-Gaudens $20', years: '1907-1933', emoji: '✨' },
  { id: 'washington', label: 'Washington Quarter', years: '1932-present', emoji: '🏛️' },
  { id: 'kennedy', label: 'Kennedy Half', years: '1964-present', emoji: '⭐' },
  { id: 'jefferson', label: 'Jefferson Nickel', years: '1938-present', emoji: '📜' },
]

// Grade categories with descriptions
const GRADE_CATEGORIES = [
  {
    name: 'Poor to Fair',
    range: '1–2',
    color: 'bg-red-100 border-red-300',
    textColor: 'text-red-800',
    barColor: 'bg-red-400',
    summary: 'Barely identifiable. Coin is extremely worn — type may be the only thing readable.',
    grades: [
      { grade: 'P-1', name: 'Poor', description: 'Barely identifiable, extremely heavy wear' },
      { grade: 'FR-2', name: 'Fair', description: 'Mostly worn smooth, type identifiable' },
    ]
  },
  {
    name: 'About Good to Good',
    range: '3–6',
    color: 'bg-orange-100 border-orange-300',
    textColor: 'text-orange-800',
    barColor: 'bg-orange-400',
    summary: 'Very heavily worn. Design outline is visible but details are flat.',
    grades: [
      { grade: 'AG-3', name: 'About Good', description: 'Very heavily worn, outline visible' },
      { grade: 'G-4', name: 'Good', description: 'Heavily worn, design visible but flat' },
      { grade: 'G-6', name: 'Good+', description: 'Heavily worn, slightly more detail than G-4' },
    ]
  },
  {
    name: 'Very Good',
    range: '8–10',
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-800',
    barColor: 'bg-yellow-400',
    summary: 'Well worn but main features are clear. Letters and date fully readable.',
    grades: [
      { grade: 'VG-8', name: 'Very Good', description: 'Well worn, main features clear' },
      { grade: 'VG-10', name: 'Very Good+', description: 'Well worn, slightly sharper than VG-8' },
    ]
  },
  {
    name: 'Fine',
    range: '12–15',
    color: 'bg-lime-100 border-lime-300',
    textColor: 'text-lime-800',
    barColor: 'bg-lime-500',
    summary: 'Moderate wear on high points. All lettering and design details visible.',
    grades: [
      { grade: 'F-12', name: 'Fine', description: 'Moderate wear on high points, all lettering visible' },
      { grade: 'F-15', name: 'Fine+', description: 'Moderate wear, slightly more detail than F-12' },
    ]
  },
  {
    name: 'Very Fine',
    range: '20–35',
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-800',
    barColor: 'bg-green-500',
    summary: 'Light wear only on high points. All major details sharp and clear.',
    grades: [
      { grade: 'VF-20', name: 'Very Fine', description: 'Light wear on high points, all details sharp' },
      { grade: 'VF-25', name: 'Very Fine+', description: 'Light wear, slightly better than VF-20' },
      { grade: 'VF-30', name: 'Choice VF', description: 'Light wear on highest points only' },
      { grade: 'VF-35', name: 'Choice VF+', description: 'Minimal wear on highest points' },
    ]
  },
  {
    name: 'Extremely Fine',
    range: '40–45',
    color: 'bg-teal-100 border-teal-300',
    textColor: 'text-teal-800',
    barColor: 'bg-teal-500',
    summary: 'Slight wear on the very highest points only. Traces of original luster visible.',
    grades: [
      { grade: 'EF-40', name: 'Extremely Fine', description: 'Light wear on high points, all features sharp' },
      { grade: 'EF-45', name: 'Choice EF', description: 'Slight wear on highest points, traces of luster' },
    ]
  },
  {
    name: 'About Uncirculated',
    range: '50–58',
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-800',
    barColor: 'bg-blue-500',
    summary: 'Almost no wear. Luster is present but friction is visible on the high points.',
    grades: [
      { grade: 'AU-50', name: 'About Uncirculated', description: 'Trace wear on high points, half luster' },
      { grade: 'AU-53', name: 'About Unc+', description: 'Obvious wear on high points, partial luster' },
      { grade: 'AU-55', name: 'Choice AU', description: 'Light wear on high points, most luster present' },
      { grade: 'AU-58', name: 'Choice AU+', description: 'Slight wear on highest points, nearly full luster' },
    ]
  },
  {
    name: 'Mint State (Uncirculated)',
    range: '60–70',
    color: 'bg-purple-100 border-purple-300',
    textColor: 'text-purple-800',
    barColor: 'bg-purple-500',
    summary: 'No wear at all. Differences between grades are based on marks, luster, and eye appeal.',
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
    range: '60–70',
    color: 'bg-indigo-100 border-indigo-300',
    textColor: 'text-indigo-800',
    barColor: 'bg-indigo-500',
    summary: 'Specially struck for collectors with mirror-like fields. Graded on surface quality.',
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

// Beginner tips
const BEGINNER_TIPS = [
  {
    icon: Eye,
    title: 'Look at the High Points',
    body: 'Wear shows up first on the highest parts of the design — a cheek, a shoulder, a feather tip. If those areas are smooth and flat, the coin has been circulated.',
  },
  {
    icon: Star,
    title: 'Luster Matters a Lot',
    body: 'Luster is the cartwheel-like shine on an uncirculated coin. It comes from the metal flow during striking. Once a coin is handled or circulated, luster is gone and cannot come back.',
  },
  {
    icon: Search,
    title: 'Marks vs. Wear',
    body: 'Mint State (MS) coins have no wear, but they can still have bag marks or contact marks from other coins. These are different from wear — they matter, but they don\'t drop a coin out of the MS tier.',
  },
  {
    icon: Zap,
    title: 'The Sheldon Scale (1–70)',
    body: 'All U.S. coins are graded on a 1–70 scale created by Dr. William Sheldon. Lower numbers = more wear. 70 is a theoretically perfect coin. Most circulated coins fall between G-4 and EF-45.',
  },
]

export function PCGSGrading() {
  const [selectedCategory, setSelectedCategory] = useState('dollars')
  const [selectedCoinType, setSelectedCoinType] = useState('morgan')
  const [expandedGradeCategories, setExpandedGradeCategories] = useState<string[]>(['Mint State (Uncirculated)', 'About Uncirculated', 'Extremely Fine'])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'learn' | 'reference' | 'browse'>('learn')

  const currentCategory = COIN_CATEGORIES.find(c => c.id === selectedCategory)
  const selectedCoin = ALL_COINS.find(c => c.id === selectedCoinType)

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

  const expandAll = () => setExpandedGradeCategories(GRADE_CATEGORIES.map(c => c.name))
  const collapseAll = () => setExpandedGradeCategories([])

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
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="text-center space-y-3 pt-2">
        <div className="flex items-center justify-center gap-3">
          <Award className="w-9 h-9 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Coin Grading Guide</h1>
        </div>
        <p className="text-gray-500 max-w-xl mx-auto">
          Everything from "what does VF-30 mean?" to quick photo comparisons for any coin type.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'learn' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Learn Grading
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'reference' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Grade Chart
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'browse' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          Photo Compare
        </button>
      </div>

      {/* ══════════════════════════════════════
          TAB: LEARN GRADING
      ══════════════════════════════════════ */}
      {activeTab === 'learn' && (
        <div className="space-y-6">

          {/* Beginner intro banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">New to coin grading?</h2>
            <p className="text-blue-100 text-base max-w-2xl">
              Coin grading is the process of assessing a coin's condition and assigning it a numeric grade.
              A higher grade means less wear and better preservation — and usually a higher value.
              U.S. coins are graded on the <strong className="text-white">Sheldon 1–70 scale</strong>.
            </p>
          </div>

          {/* Visual grade spectrum bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">The Grading Spectrum at a Glance</h3>
            <div className="flex rounded-lg overflow-hidden h-8 mb-3">
              <div className="bg-red-400 flex-none w-[5%]" title="P-1 to FR-2" />
              <div className="bg-orange-400 flex-none w-[5%]" title="AG-3 to G-6" />
              <div className="bg-yellow-400 flex-none w-[7%]" title="VG-8 to VG-10" />
              <div className="bg-lime-500 flex-none w-[8%]" title="F-12 to F-15" />
              <div className="bg-green-500 flex-none w-[15%]" title="VF-20 to VF-35" />
              <div className="bg-teal-500 flex-none w-[10%]" title="EF-40 to EF-45" />
              <div className="bg-blue-500 flex-none w-[10%]" title="AU-50 to AU-58" />
              <div className="bg-purple-500 flex-1" title="MS-60 to MS-70" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>P-1 (Poorest)</span>
              <span className="text-green-700">VF-30 (Average circulated)</span>
              <span className="text-purple-700">MS-65 (Gem uncirculated)</span>
              <span>MS-70 (Perfect)</span>
            </div>
          </div>

          {/* Four tips grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {BEGINNER_TIPS.map(tip => {
              const Icon = tip.icon
              return (
                <div key={tip.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{tip.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Common circulated grades explained visually */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-1">What Do the Numbers Actually Mean?</h3>
            <p className="text-sm text-gray-500 mb-5">Here's a plain-English breakdown of the most common grades you'll encounter.</p>
            <div className="space-y-3">
              {[
                { grade: 'G-4', label: 'Good', bar: 10, color: 'bg-orange-400', desc: 'Very heavy wear. Design is flat but recognizable. Often the lowest collectible grade for common coins.' },
                { grade: 'VG-8', label: 'Very Good', bar: 20, color: 'bg-yellow-400', desc: 'Main design features are clear. Letters and date fully readable. A decent "filler" grade.' },
                { grade: 'F-12', label: 'Fine', bar: 30, color: 'bg-lime-500', desc: 'All details visible with moderate wear on the high points. Nice honest coin.' },
                { grade: 'VF-30', label: 'Very Fine', bar: 50, color: 'bg-green-500', desc: 'Light wear on the very tops only. All details sharp. Solid mid-grade collectible.' },
                { grade: 'EF-45', label: 'Extremely Fine', bar: 65, color: 'bg-teal-500', desc: 'Slight wear traces on the absolute highest points. Luster may be visible in protected areas.' },
                { grade: 'AU-58', label: 'Choice About Unc.', bar: 80, color: 'bg-blue-500', desc: 'Just a whisper of friction. Nearly full luster. Hard to tell from MS without experience.' },
                { grade: 'MS-63', label: 'Choice Mint State', bar: 90, color: 'bg-purple-500', desc: 'No wear at all. Some contact marks from the mint bag. Solid uncirculated coin.' },
                { grade: 'MS-65', label: 'Gem', bar: 96, color: 'bg-purple-600', desc: 'Strong luster, well struck, very minor marks. This is the most-requested grade for type sets.' },
              ].map(item => (
                <div key={item.grade} className="flex items-center gap-4">
                  <span className="font-mono font-bold text-blue-700 text-sm w-14 flex-shrink-0">{item.grade}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.bar}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-36 flex-shrink-0">{item.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game CTA */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <p className="font-bold text-xl mb-1">Test Your Eye — Guess the Grade</p>
              <p className="text-amber-100 text-sm">Read coin descriptions and pick the right grade. Track your accuracy and streaks.</p>
            </div>
            <button
              onClick={() => setActiveTab('reference')}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors shadow"
            >
              <Target className="w-5 h-5" />
              Practice Grading
            </button>
          </div>

          {/* Navigate to other tabs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('reference')}
              className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Full Grade Reference Chart</p>
                <p className="text-sm text-gray-500">All 30+ grades with descriptions, searchable</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">PCGS Photo Comparisons</p>
                <p className="text-sm text-gray-500">Pick a coin type and see actual grade photos</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: GRADE REFERENCE CHART
      ══════════════════════════════════════ */}
      {activeTab === 'reference' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Grade Reference Chart</h2>
              <p className="text-sm text-gray-500 mt-0.5">All Sheldon scale grades with plain-English descriptions</p>
            </div>
            <div className="flex items-center gap-3">
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
              <button onClick={expandAll} className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                Expand All
              </button>
              <button onClick={collapseAll} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap">
                Collapse
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <div key={category.name} className={`border-2 rounded-xl overflow-hidden ${category.color}`}>
                <button
                  onClick={() => toggleGradeCategory(category.name)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`font-bold text-base ${category.textColor}`}>{category.name}</span>
                    <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full font-mono flex-shrink-0">
                      {category.range}
                    </span>
                    {!expandedGradeCategories.includes(category.name) && (
                      <span className="text-xs text-gray-600 hidden sm:block truncate">{category.summary}</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 ml-2 transition-transform ${expandedGradeCategories.includes(category.name) ? 'rotate-180' : ''}`} />
                </button>

                {expandedGradeCategories.includes(category.name) && (
                  <div className="bg-white border-t border-gray-200">
                    {/* Summary row */}
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-600 italic">{category.summary}</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {category.grades.map((gradeInfo) => (
                        <div
                          key={gradeInfo.grade}
                          className="px-5 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-mono font-bold text-blue-600 text-base w-16 flex-shrink-0 pt-0.5">
                            {gradeInfo.grade}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{gradeInfo.name}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{gradeInfo.description}</p>
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

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Grading standards based on the PCGS/NGC Sheldon scale (1–70)</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: PHOTO COMPARE (PCGS Photograde)
      ══════════════════════════════════════ */}
      {activeTab === 'browse' && (
        <div className="space-y-6">

          {/* Quick links for most popular coins */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Quick Jump — Popular Coins</h2>
            </div>
            <p className="text-slate-400 text-sm mb-5">Click any coin to open PCGS Photograde directly — shows actual photos at every grade.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {QUICK_LINK_COINS.map(coin => (
                <a
                  key={coin.id}
                  href={`https://www.pcgs.com/photograde/#/${coin.id}/grades`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-slate-700 hover:bg-blue-600 rounded-xl px-4 py-3 transition-all group"
                >
                  <span className="text-xl leading-none">{coin.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{coin.label}</p>
                    <p className="text-xs text-slate-400 group-hover:text-blue-200">{coin.years}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-200 flex-shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* Full coin type browser */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Browse All Coin Types</h2>
            <p className="text-sm text-gray-500 mb-5">Select a category, then choose a specific coin to open its PCGS Photograde page.</p>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {COIN_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Coins in selected category */}
            {currentCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                {currentCategory.coins.map(coin => (
                  <a
                    key={coin.id}
                    href={`https://www.pcgs.com/photograde/#/${coin.id}/grades`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelectedCoinType(coin.id)}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700">{coin.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{coin.years}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}

            {/* Selected coin CTA */}
            <div className="bg-blue-600 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <p className="text-blue-200 text-sm font-medium">Selected Coin</p>
                <p className="text-xl font-bold">{selectedCoin?.label}</p>
                <p className="text-blue-200 text-sm">{selectedCoin?.years}</p>
              </div>
              <a
                href={`https://www.pcgs.com/photograde/#/${selectedCoinType}/grades`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-blue-700 rounded-xl font-bold transition-colors shadow whitespace-nowrap"
              >
                Open PCGS Photograde
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* External resources */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Other Grading Resources</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://www.pcgs.com/photograde"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">PCGS Photograde</p>
                  <p className="text-sm text-gray-500">Full database of grade photos by coin type</p>
                </div>
              </a>
              <a
                href="https://www.ngccoin.com/coin-grading/grading-scale/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">NGC Grading Scale</p>
                  <p className="text-sm text-gray-500">NGC's explanation of the Sheldon scale</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
