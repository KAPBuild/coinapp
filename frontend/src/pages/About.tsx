import { BarChart3, ShoppingBag, Database, Package, BookOpen, Zap } from 'lucide-react'

const PLATFORM_NAME = 'GradePoint'

export function About() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          {PLATFORM_NAME}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The intelligence layer numismatics has been missing.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          PCGS and NGC tell you what a coin grades. We tell you what a coin is worth buying.
        </p>
      </section>

      {/* What We Are */}
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">What {PLATFORM_NAME} Is</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          {PLATFORM_NAME} is an investment intelligence platform for serious coin collectors and investors. Think of it as the Bloomberg Terminal of numismatics — a data-driven layer that sits on top of the existing grading and pricing infrastructure to surface what the market hasn't priced in yet.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Collectors have always had access to prices. What hasn't existed — until now — is a tool that measures whether price reflects rarity. That's the gap {PLATFORM_NAME} fills. We surface coins where population data, survival rates, and market demand are out of alignment: coins that are genuinely rarer than their price suggests.
        </p>
      </section>

      {/* Two Entities */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GradePoint */}
        <div className="bg-slate-800 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{PLATFORM_NAME}</h3>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            The software platform. Investment intelligence tools, portfolio tracking, rarity analysis, and grading references — all in one place. This is the front door.
          </p>
        </div>

        {/* Stoddard Numismatics */}
        <div className="bg-slate-800 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Stoddard Numismatics</h3>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            The rare coin dealer arm. Coins listed in the Shop come directly from our curated personal inventory — selected with the same investment lens the platform teaches.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">What's Inside</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-white">Investment Intelligence</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Stack Intel surfaces undervalued coins using 3D rarity vs. price analysis across population data, survival rates, and grade distributions.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Portfolio Tracker</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Track your collection with full financial detail — purchase price, estimated value, profit/loss, metal content, and more.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Research & Education</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Grading guides, key date references, melt value calculators, and coin lookup tools — the knowledge base serious collectors actually need.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white">The Shop</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Coins curated and sold by Stoddard Numismatics. Every listing is selected for collector and investment merit — not just availability.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-950/40 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Questions or Feedback?</h2>
        <p className="text-slate-400 mb-2">
          We're building this for serious collectors and investors. If you have ideas, research to share, or coins you'd like appraised, reach out.
        </p>
      </section>
    </div>
  )
}
