import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: 'gettingstarted-1',
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Simply click the Login button in the top right corner of the page, then select "Sign Up" to create a new account. You\'ll need a valid email address and a secure password.',
  },
  {
    id: 'gettingstarted-2',
    category: 'Getting Started',
    question: 'Is CoinApp free to use?',
    answer: 'Yes! CoinApp is completely free to use. We offer all core features at no cost. There may be premium features in the future, but the basic inventory and tracking will always be free.',
  },
  {
    id: 'inventory-1',
    category: 'Inventory Management',
    question: 'How do I add coins to my collection?',
    answer: 'Go to your Portfolio or Inventory section and click the "Add Coin" button. Fill in the details like date, mint mark, denomination, and condition. You can also upload photos of your coins.',
  },
  {
    id: 'inventory-2',
    category: 'Inventory Management',
    question: 'Can I import coins from other apps?',
    answer: 'We\'re working on import features for popular coin collecting apps. For now, you\'ll need to add coins manually. We apologize for any inconvenience!',
  },
  {
    id: 'inventory-3',
    category: 'Inventory Management',
    question: 'How do I edit or delete a coin?',
    answer: 'In your Portfolio, click on any coin to view its details. You\'ll see options to edit the information or delete the coin from your collection.',
  },
  {
    id: 'lookup-1',
    category: 'Coin Lookup',
    question: 'How accurate is the Lookup tool?',
    answer: 'Our Lookup tool uses data from multiple sources including the PCGS and NGC grading databases. Prices are updated regularly based on market data, but current market prices may vary.',
  },
  {
    id: 'lookup-2',
    category: 'Coin Lookup',
    question: 'Can I search by coin image?',
    answer: 'Not yet, but this is on our roadmap! For now, you can search by year, mint mark, denomination, and other identifying features.',
  },
  {
    id: 'pricing-1',
    category: 'Pricing & Values',
    question: 'How are coin values calculated?',
    answer: 'Values are based on recent sales data, auction results, and market conditions for coins in similar grades. Different grades can have significantly different values.',
  },
  {
    id: 'pricing-2',
    category: 'Pricing & Values',
    question: 'Why does my coin\'s value differ from other websites?',
    answer: 'Coin values vary based on condition, rarity, and market demand. The grade of your coin has a huge impact on its value. We recommend checking multiple sources for valuation.',
  },
  {
    id: 'showcase-1',
    category: 'Showcase & Community',
    question: 'Can I share my collection publicly?',
    answer: 'Yes! The Showcase feature allows you to share selected coins from your collection. You control what\'s visible, and your personal information remains private.',
  },
  {
    id: 'showcase-2',
    category: 'Showcase & Community',
    question: 'Can other people see my portfolio?',
    answer: 'By default, your portfolio is private. You can choose to make specific coins visible in the Showcase feature. Your inventory details are always private.',
  },
  {
    id: 'technical-1',
    category: 'Technical Support',
    question: 'What browsers does CoinApp support?',
    answer: 'CoinApp works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
  },
  {
    id: 'technical-2',
    category: 'Technical Support',
    question: 'Is my data backed up?',
    answer: 'Yes, all your data is automatically backed up and secure. You can rest assured that your collection is safe.',
  },
  {
    id: 'technical-3',
    category: 'Technical Support',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email. If you don\'t receive an email, check your spam folder.',
  },
]

export function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = Array.from(new Set(faqItems.map(item => item.category)))

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="flex justify-center mb-4">
          <HelpCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about CoinApp. Can't find what you're looking for?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact us
          </a>
          .
        </p>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
            <div className="space-y-3">
              {faqItems
                .filter(item => item.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-colors hover:border-gray-300"
                  >
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900">{item.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                          expandedId === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedId === item.id && (
                      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Still Have Questions */}
      <section className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
        <p className="text-gray-600 mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Contact Support
        </button>
      </section>
    </div>
  )
}
