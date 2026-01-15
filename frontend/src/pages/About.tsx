import { Coins, Target, Users, Sparkles } from 'lucide-react'

export function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About CoinApp</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your complete platform for managing, tracking, and showcasing your coin collection with confidence.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-white rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Our Mission
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We believe every coin collector deserves powerful tools to organize, value, and celebrate their collection.
          CoinApp makes it easy to track your coins, monitor their value, and share your passion with others.
        </p>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Coins className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Inventory Management</h3>
            </div>
            <p className="text-gray-600">
              Easily catalog your coins with detailed information about date, mint mark, grade, and more.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Value Tracking</h3>
            </div>
            <p className="text-gray-600">
              Monitor the current market value of your collection and track price movements over time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Community Showcase</h3>
            </div>
            <p className="text-gray-600">
              Share your collection with fellow collectors and discover amazing coins from around the world.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Smart Lookup</h3>
            </div>
            <p className="text-gray-600">
              Instantly look up coin information, pricing, and grading details from our comprehensive database.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">By The Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Coins Tracked</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <p className="text-gray-600">Active Collectors</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">$100M+</div>
            <p className="text-gray-600">Total Value Managed</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
        <p className="text-gray-600 mb-6">
          Check out our FAQ or reach out to our team anytime.
        </p>
      </section>
    </div>
  )
}
