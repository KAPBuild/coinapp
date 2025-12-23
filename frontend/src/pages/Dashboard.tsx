import { TrendingUp, DollarSign, Coins, TrendingDown } from 'lucide-react'

// Test data
const testCoins = [
  {
    id: '1',
    name: 'American Eagle Gold Coin',
    quantity: 5,
    purchasePrice: 1500,
    currentPrice: 1650,
  },
  {
    id: '2',
    name: 'British Sovereign',
    quantity: 10,
    purchasePrice: 350,
    currentPrice: 380,
  },
  {
    id: '3',
    name: 'Canadian Maple Leaf',
    quantity: 3,
    purchasePrice: 1200,
    currentPrice: 1300,
  },
]

export function Dashboard() {
  const totalInvested = testCoins.reduce((sum, coin) => sum + (coin.quantity * coin.purchasePrice), 0)
  const totalValue = testCoins.reduce((sum, coin) => sum + (coin.quantity * (coin.currentPrice || coin.purchasePrice)), 0)
  const gainLoss = totalValue - totalInvested

  const stats = [
    {
      label: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Coins',
      value: testCoins.length.toString(),
      icon: Coins,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Invested',
      value: `$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Gain/Loss',
      value: `$${gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: gainLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: gainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Overview</h2>
        <p className="text-gray-600">Track your coin investment portfolio at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className={`${stat.bgColor} rounded-lg p-3 w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Coins</h3>
        <div className="space-y-3">
          {testCoins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{coin.name}</p>
                <p className="text-sm text-gray-600">Qty: {coin.quantity} × ${coin.purchasePrice}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${(coin.quantity * coin.currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className={`text-sm font-semibold ${coin.currentPrice > coin.purchasePrice ? 'text-green-600' : 'text-red-600'}`}>
                  {coin.currentPrice > coin.purchasePrice ? '+' : ''}{(((coin.currentPrice - coin.purchasePrice) / coin.purchasePrice) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
