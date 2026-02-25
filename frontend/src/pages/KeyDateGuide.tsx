import { useState } from 'react'
import { TrendingUp, Eye, DollarSign, AlertTriangle, Star, Gem, ChevronDown, ChevronUp, ShieldCheck, BadgeCheck, Zap, Scale } from 'lucide-react'
import { ALL_KEY_DATES, SeriesKeyDates, Rarity, formatMintage } from '../data/keyDatesData'

// ─── Types ────────────────────────────────────────────────────────────────────

type CardId = 'why' | 'whatToLook' | 'budget' | 'redFlags'
type RarityFilter = 'all' | Rarity

// ─── Key date reference config ────────────────────────────────────────────────

const RARITY_CONFIG: Record<Rarity, { label: string; badgeClass: string; rowClass: string }> = {
  'semi-key':   { label: 'Semi-Key',   badgeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-300', rowClass: 'border-l-4 border-yellow-400' },
  'key':        { label: 'Key Date',   badgeClass: 'bg-orange-100 text-orange-800 border border-orange-300', rowClass: 'border-l-4 border-orange-400' },
  'ultra-rare': { label: 'Ultra-Rare', badgeClass: 'bg-red-100 text-red-800 border border-red-300',          rowClass: 'border-l-4 border-red-500'   },
}

const FILTER_BUTTONS: { value: RarityFilter; label: string; activeClass: string }[] = [
  { value: 'all',        label: 'All',        activeClass: 'bg-slate-700 text-white' },
  { value: 'semi-key',   label: 'Semi-Key',   activeClass: 'bg-yellow-500 text-white' },
  { value: 'key',        label: 'Key Date',   activeClass: 'bg-orange-500 text-white' },
  { value: 'ultra-rare', label: 'Ultra-Rare', activeClass: 'bg-red-600 text-white' },
]

// ─── Hub card definitions ─────────────────────────────────────────────────────

interface HubCard {
  id: CardId
  title: string
  teaser: string
  accentColor: string
  borderColor: string
  bgColor: string
  iconBg: string
  icon: React.ReactNode
}

const HUB_CARDS: HubCard[] = [
  {
    id: 'why',
    title: 'Why Invest in Rare Coins',
    teaser: 'Coins as an asset class — limited supply, tangible value, and a 200-year track record.',
    accentColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    icon: <TrendingUp className="w-6 h-6 text-white" />,
  },
  {
    id: 'whatToLook',
    title: 'What to Look For',
    teaser: 'Grade, certification, strike quality, and eye appeal — what separates a great coin from a mediocre one.',
    accentColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    icon: <Eye className="w-6 h-6 text-white" />,
  },
  {
    id: 'budget',
    title: 'Budget Entry Points',
    teaser: 'From $150 to $15,000+ — specific coin recommendations for every budget level.',
    accentColor: 'text-amber-700',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-500',
    icon: <DollarSign className="w-6 h-6 text-white" />,
  },
  {
    id: 'redFlags',
    title: 'Red Flags & What to Avoid',
    teaser: 'Cleaned coins, known counterfeits, and problem coins — how to protect yourself.',
    accentColor: 'text-red-700',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-500',
    icon: <AlertTriangle className="w-6 h-6 text-white" />,
  },
]

// ─── Expanded card content ────────────────────────────────────────────────────

function WhyInvestContent() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 leading-relaxed text-base">
        Rare coins are one of the few collectible assets with a documented multi-century track record of value retention. Unlike stocks, they carry no counterparty risk — no company can go bankrupt, no government can dilute supply. A key-date coin struck in 1893 cannot be "re-minted." That fixed supply, combined with growing collector demand, creates long-term upward pressure on prices.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: <Scale className="w-5 h-5 text-emerald-600" />, title: 'Tangible Asset', body: 'Physical coins carry no counterparty risk. You own the asset outright — no brokerage, no custodian, no third party required.' },
          { icon: <Zap className="w-5 h-5 text-emerald-600" />, title: 'Fixed Supply', body: 'Key dates can never be re-minted. When a coin like the 1893-S Morgan wears out, the population only shrinks — demand stays or grows.' },
          { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, title: 'Inflation Hedge', body: 'Rare coins are priced in precious metals and collector demand, not dollar value. They have historically tracked or beat inflation over long periods.' },
          { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, title: 'Portfolio Diversification', body: 'Rare coin prices have low correlation to the stock market. They can hold value during equity downturns when other assets fall together.' },
        ].map(item => (
          <div key={item.title} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-emerald-800 mb-1">Best Starting Approach</p>
        <p className="text-sm text-emerald-700">
          Buy coins you genuinely enjoy — the combination of aesthetic pleasure and investment potential is what makes numismatics uniquely rewarding. Focus on certified key dates in popular series (Morgan Dollars, Lincoln Wheat, Buffalo Nickels) where collector demand is deep and liquid.
        </p>
      </div>
    </div>
  )
}

function WhatToLookContent() {
  const sections = [
    {
      title: 'Grade',
      icon: <Star className="w-4 h-4 text-blue-600" />,
      body: `The Sheldon scale runs from Poor-1 to Mint State-70. For most key dates, each grade jump multiplies value — a 1914-D Lincoln in Good-4 might be $250, but in Fine-12 it's $700, and MS-63 is $8,000+. Focus on the highest grade you can afford within your budget. Even in low grades, key dates carry premium value over common dates.`,
    },
    {
      title: 'Certification (Slabs)',
      icon: <BadgeCheck className="w-4 h-4 text-blue-600" />,
      body: `For any key date purchase, only buy PCGS or NGC certified coins. A "slab" is a sealed, tamper-evident plastic holder issued by the grading service that permanently identifies the coin, its grade, and authenticity. Never buy a raw (uncertified) key date — the counterfeiting risk is too high. The 1914-D Lincoln and 1916-D Mercury dime are among the most counterfeited US coins ever made.`,
    },
    {
      title: 'Strike Quality',
      icon: <Zap className="w-4 h-4 text-blue-600" />,
      body: `Beyond grade, certain series reward collectors who seek superior strike. Standing Liberty Quarters in "Full Head" grade (FH designation from PCGS/NGC) carry massive premiums. Mercury Dimes with "Full Bands" (FB) command 5-10x the price of a coin graded identically without it. Jefferson Nickels reward "Full Steps" (FS). Always look for these designations in popular series.`,
    },
    {
      title: 'Eye Appeal & Originality',
      icon: <Eye className="w-4 h-4 text-blue-600" />,
      body: `Two coins with the same grade can look very different. Original luster — that cartwheel shine on Mint State coins — is the single most important visual attribute. Natural toning (amber, gold, blue) on silver coins is desirable and protective. Artificial toning (applied chemically) is a serious red flag. Above all, a coin that has never been cleaned commands a massive premium over one that has.`,
    },
  ]

  return (
    <div className="space-y-5">
      {sections.map(s => (
        <div key={s.title} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BudgetContent() {
  const tiers = [
    {
      label: 'Under $500',
      color: 'border-amber-300 bg-amber-50',
      headerColor: 'text-amber-800',
      intro: 'Great key dates exist even at entry-level budgets. Focus on circulated examples of famous series.',
      coins: [
        { coin: '1909-S VDB Lincoln Cent', grade: 'AG–Good', price: '$150–$350', why: 'The most famous US penny. Even heavily worn examples are prized by collectors.' },
        { coin: '1916-D Mercury Dime', grade: 'AG (Poor)', price: '$400–$500', why: 'The key date of the Mercury series. Even worn examples are highly sought after — always buy certified.' },
        { coin: '1913-S Buffalo Nickel (T2)', grade: 'G–VG', price: '$200–$400', why: 'Key date first year. Low-grade examples are still meaningful collector pieces.' },
        { coin: '1921-P Morgan Dollar', grade: 'VG–F', price: '$35–$80', why: 'High-mintage but popular. A great entry into the Morgan series at low cost.' },
      ],
    },
    {
      label: '$500 – $5,000',
      color: 'border-orange-300 bg-orange-50',
      headerColor: 'text-orange-800',
      intro: 'This range opens access to true key dates in Fine–AU grades, where coins start appreciating meaningfully.',
      coins: [
        { coin: '1914-D Lincoln Cent', grade: 'F–VF', price: '$600–$1,200', why: 'Premier Lincoln key date. VF examples have strong long-term demand from set builders.' },
        { coin: '1921 Standing Liberty Quarter', grade: 'VG–F', price: '$700–$1,500', why: 'Depression-era key with low mintage. Affordable in lower grades, extremely rare above VF.' },
        { coin: '1879-CC Morgan Dollar', grade: 'VF–EF', price: '$1,500–$3,500', why: 'First Carson City key date. Low mintage of 756K. Strong upside in higher circulated grades.' },
        { coin: '1931-S Lincoln Cent', grade: 'EF–AU', price: '$100–$300', why: 'Key date with lowest San Francisco wheat mintage. Surprisingly affordable in AU.' },
      ],
    },
    {
      label: '$5,000+',
      color: 'border-red-300 bg-red-50',
      headerColor: 'text-red-800',
      intro: 'Investment-grade coins in Mint State or problem-free higher circulated grades. These are true numismatic assets.',
      coins: [
        { coin: '1889-CC Morgan Dollar', grade: 'EF–AU', price: '$8,000–$25,000', why: 'Premier Morgan key date. Only 350K struck, most circulated hard. Any EF example is exceptional.' },
        { coin: '1916 Standing Liberty Quarter', grade: 'VG–VF', price: '$5,000–$15,000', why: 'Only 52,000 struck in the first year. One of the most desirable 20th-century rarities.' },
        { coin: '1909-S VDB Lincoln Cent', grade: 'MS-63 RB', price: '$5,000–$9,000', why: 'The king of Lincoln cents in Mint State. Red-brown examples have superb eye appeal and strong auction records.' },
        { coin: '1893-S Morgan Dollar', grade: 'Good–Fine', price: '$15,000–$60,000', why: 'The most famous Morgan key date. Even problem-free Fine examples are museum-quality rarities.' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-sm">
        All price ranges are approximate retail — actual prices vary by grade, eye appeal, and current market. Always cross-reference recent PCGS auction results before buying.
      </p>
      {tiers.map(tier => (
        <div key={tier.label} className={`rounded-xl border-2 ${tier.color} overflow-hidden`}>
          <div className={`px-5 py-3 border-b border-current/20`}>
            <p className={`font-bold text-lg ${tier.headerColor}`}>{tier.label}</p>
            <p className="text-sm text-gray-600 mt-0.5">{tier.intro}</p>
          </div>
          <div className="divide-y divide-white/60">
            {tier.coins.map(c => (
              <div key={c.coin} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <div className="sm:w-64 flex-shrink-0">
                  <p className="font-semibold text-gray-900 text-sm">{c.coin}</p>
                  <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                    <span>{c.grade}</span>
                    <span className="font-medium text-gray-700">{c.price}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.why}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function RedFlagsContent() {
  const flags = [
    {
      title: 'Cleaned Coins',
      severity: 'Always Avoid',
      severityColor: 'bg-red-100 text-red-700',
      body: 'Cleaning removes original surfaces and destroys luster permanently. Signs: unnatural brightness, fine hairlines visible under a loupe, dull cartwheel, flat look. PCGS/NGC will label these as "Cleaned" or "Details" grade and they trade at a steep discount — often 50–80% below a problem-free example. Walk away from any key date with a "Details" designation unless you\'re paying a deep discount and understand what you\'re getting.',
    },
    {
      title: 'Known Counterfeits & Altered Dates',
      severity: 'High Risk',
      severityColor: 'bg-orange-100 text-orange-700',
      body: 'The most counterfeited US coins include: the 1916-D Mercury Dime (a D mint mark is added to a Philadelphia coin), the 1914-D Lincoln Cent (altered 1944-D date), the 1943 bronze cent (copper-plated steel 1943), and the 1955 Doubled Die Lincoln (faked with a die polish). Never buy these raw. A PCGS or NGC slab is the only protection against these forgeries.',
    },
    {
      title: 'Problem Coins',
      severity: 'Significant Discount',
      severityColor: 'bg-yellow-100 text-yellow-700',
      body: 'Holes (used as jewelry), rim damage, scratches, environmental damage (corrosion, verdigris on copper), and PVC damage (green slime from old holders) all destroy collector value. PCGS/NGC will net-grade or "Details" these coins. They may still have numismatic interest but expect 60–90% discounts vs. problem-free.',
    },
    {
      title: 'Raw Key Dates from Unknown Sellers',
      severity: 'Always Avoid',
      severityColor: 'bg-red-100 text-red-700',
      body: 'A raw (unslabbed) 1916-D Mercury or 1914-D Lincoln cent is a counterfeit until proven otherwise. Even from estate sales, flea markets, or reputable-seeming dealers — always insist on third-party certification before paying key-date money. Submitting a coin to PCGS costs $30–$50 and is worth every cent.',
    },
    {
      title: 'Artificial Toning',
      severity: 'Buyer Beware',
      severityColor: 'bg-yellow-100 text-yellow-700',
      body: 'Natural toning (from original album or envelope storage) is protective and desirable. Artificially toned coins (chemically colored to look original) are deceptive. Signs: overly vivid or "electric" colors, colors in unusual patterns, inconsistent toning for the coin\'s history. PCGS/NGC will sometimes note "questionable toning" on slabs. When in doubt, buy original surfaces.',
    },
    {
      title: '"Too Good to Be True" Deals',
      severity: 'Use Caution',
      severityColor: 'bg-yellow-100 text-yellow-700',
      body: 'If a key date is priced significantly below market — even from a reputable eBay seller or coin show dealer — be skeptical. Verify against PCGS or NGC\'s online price guide and recent auction results. Coin values are well-documented; no one accidentally sells a 1893-S Morgan for $500.',
    },
  ]

  return (
    <div className="space-y-4">
      {flags.map(f => (
        <div key={f.title} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.severityColor}`}>{f.severity}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>
  )
}

const CARD_CONTENT: Record<CardId, React.ReactNode> = {
  why: <WhyInvestContent />,
  whatToLook: <WhatToLookContent />,
  budget: <BudgetContent />,
  redFlags: <RedFlagsContent />,
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function KeyDateGuide() {
  const [activeCard, setActiveCard] = useState<CardId | null>(null)
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(ALL_KEY_DATES[0].seriesId)
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')

  const selectedSeries: SeriesKeyDates | undefined = ALL_KEY_DATES.find(s => s.seriesId === selectedSeriesId)
  const filteredEntries = selectedSeries
    ? selectedSeries.entries.filter(e => rarityFilter === 'all' || e.rarity === rarityFilter)
    : []

  const totalKeyDates = ALL_KEY_DATES.reduce((sum, s) => sum + s.entries.filter(e => e.rarity === 'key' || e.rarity === 'ultra-rare').length, 0)
  const totalUltraRare = ALL_KEY_DATES.reduce((sum, s) => sum + s.entries.filter(e => e.rarity === 'ultra-rare').length, 0)

  const handleCardClick = (id: CardId) => {
    setActiveCard(prev => (prev === id ? null : id))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rare Coin Investment Hub</h1>
            <p className="text-slate-300 mt-1 max-w-2xl">
              Learn what to buy, what to avoid, and how to build a rare coin portfolio that holds value — from first-time buyers to seasoned collectors.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{ALL_KEY_DATES.length}</p>
            <p className="text-xs text-slate-400">Series Covered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{totalKeyDates}</p>
            <p className="text-xs text-slate-400">Key Dates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{totalUltraRare}</p>
            <p className="text-xs text-slate-400">Ultra-Rare</p>
          </div>
        </div>
      </div>

      {/* ── Topic Cards Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HUB_CARDS.map(card => {
          const isActive = activeCard === card.id
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                isActive
                  ? `${card.borderColor} ${card.bgColor} shadow-md`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-bold text-base ${isActive ? card.accentColor : 'text-gray-900'}`}>
                      {card.title}
                    </p>
                    {isActive
                      ? <ChevronUp className={`w-4 h-4 flex-shrink-0 ${card.accentColor}`} />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    }
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{card.teaser}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Expanded Card Content ────────────────────────────────────────── */}
      {activeCard && (
        <div className={`rounded-2xl border-2 p-6 transition-all ${
          HUB_CARDS.find(c => c.id === activeCard)?.borderColor ?? 'border-gray-200'
        } ${HUB_CARDS.find(c => c.id === activeCard)?.bgColor ?? 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-5 ${HUB_CARDS.find(c => c.id === activeCard)?.accentColor ?? 'text-gray-900'}`}>
            {HUB_CARDS.find(c => c.id === activeCard)?.title}
          </h2>
          {CARD_CONTENT[activeCard]}
        </div>
      )}

      {/* ── Key Date Reference ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-xl font-bold text-gray-900">Key Date Reference</h2>
          <span className="text-sm text-gray-400">— browse by series</span>
        </div>

        {/* Rarity Filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 mr-1">Filter:</span>
          {FILTER_BUTTONS.map(btn => (
            <button
              key={btn.value}
              onClick={() => setRarityFilter(btn.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                rarityFilter === btn.value ? btn.activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Series Selector */}
          <div className="lg:w-52 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Series</p>
            </div>
            {/* Mobile */}
            <div className="flex lg:hidden gap-2 overflow-x-auto p-3">
              {ALL_KEY_DATES.map(s => (
                <button
                  key={s.seriesId}
                  onClick={() => setSelectedSeriesId(s.seriesId)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedSeriesId === s.seriesId ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s.seriesName}
                </button>
              ))}
            </div>
            {/* Desktop */}
            <div className="hidden lg:block divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {ALL_KEY_DATES.map(s => {
                const ultraCount = s.entries.filter(e => e.rarity === 'ultra-rare').length
                const keyCount = s.entries.filter(e => e.rarity === 'key').length
                return (
                  <button
                    key={s.seriesId}
                    onClick={() => setSelectedSeriesId(s.seriesId)}
                    className={`w-full text-left px-4 py-2.5 transition-colors ${
                      selectedSeriesId === s.seriesId ? 'bg-amber-50 border-r-2 border-amber-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedSeriesId === s.seriesId ? 'text-amber-700' : 'text-gray-800'}`}>
                      {s.seriesName}
                    </p>
                    <div className="flex gap-2 mt-0.5 text-xs">
                      {keyCount > 0 && <span className="text-orange-500">{keyCount} key</span>}
                      {ultraCount > 0 && <span className="text-red-500">{ultraCount} ultra</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Key Dates List */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {selectedSeries && (
              <>
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{selectedSeries.seriesName}</p>
                    <p className="text-xs text-gray-400">{filteredEntries.length} of {selectedSeries.entries.length} dates</p>
                  </div>
                  {rarityFilter !== 'all' && (
                    <button onClick={() => setRarityFilter('all')} className="text-xs text-gray-400 hover:text-gray-600 underline">
                      Clear
                    </button>
                  )}
                </div>

                {filteredEntries.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">
                    No {rarityFilter} dates in this series.{' '}
                    <button onClick={() => setRarityFilter('all')} className="text-amber-600 hover:underline">Show all</button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                    {filteredEntries.map(entry => {
                      const config = RARITY_CONFIG[entry.rarity]
                      const displayId = entry.mintMark ? `${entry.year}-${entry.mintMark}` : `${entry.year}`
                      return (
                        <div key={entry.id} className={`px-5 py-3 ${config.rowClass}`}>
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
                              <span className="text-base font-black text-gray-900 tabular-nums">{displayId}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>{config.label}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">{entry.notes}</p>
                              <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-1">
                                <span>Mintage: <strong className="text-gray-600">{formatMintage(entry.mintage)}</strong></span>
                                {entry.estimatedSurvivors !== undefined && entry.estimatedSurvivors > 0 && (
                                  <span>Survivors: <strong className="text-gray-600">{formatMintage(entry.estimatedSurvivors)}</strong></span>
                                )}
                                {entry.estimatedSurvivors !== undefined && entry.estimatedSurvivors > 0 && (
                                  <span>Survival: <strong className="text-gray-600">{((entry.estimatedSurvivors / entry.mintage) * 100).toFixed(1)}%</strong></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Data from PCGS population reports and numismatic references. Verify before purchase.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
