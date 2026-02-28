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
    question: 'Is GradePoint free to use?',
    answer: 'GradePoint offers a free tier with core tools — inventory tracking, coin lookup, melt value calculator, grading references, and Key Dates. Premium features including advanced investment intelligence tools are available through a membership. The free tier will always remain genuinely useful for collectors at any level.',
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
    answer: 'Yes — GradePoint supports CSV import from the Inventory page. Click the Import button and upload a spreadsheet with your coin data. You can also export your inventory to CSV at any time. Direct import from other coin apps is on the roadmap.',
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
    question: 'What browsers does GradePoint support?',
    answer: 'GradePoint works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
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
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Find answers to common questions about GradePoint. Can't find what you're looking for?{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
            Contact us
          </a>
          .
        </p>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
            <div className="space-y-3">
              {faqItems
                .filter(item => item.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden transition-colors hover:border-slate-600"
                  >
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <h3 className="font-semibold text-white">{item.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                          expandedId === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedId === item.id && (
                      <div className="border-t border-slate-700 px-6 py-4 bg-slate-700/30">
                        <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Still Have Questions */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
        <p className="text-slate-400 mb-6">
          Can't find the answer you're looking for? Reach out and we'll get back to you.
        </p>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
          Contact Support
        </button>
      </section>
    </div>
  )
}
