import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { X, Loader, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import { shopApi } from '../../lib/api'
import type { EbayShopItem } from '../../types/shopTypes'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null

interface CheckoutModalProps {
  item: EbayShopItem
  onClose: () => void
}

type CheckoutStage = 'details' | 'payment' | 'success' | 'error'

interface ShippingAddress {
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Inner payment form (must be inside Elements provider)
function PaymentForm({
  onSuccess,
  onError,
  amount,
}: {
  onSuccess: () => void
  onError: (msg: string) => void
  amount: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err) {
      onError('Payment processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </button>
    </form>
  )
}

export function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const [stage, setStage] = useState<CheckoutStage>('details')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState<ShippingAddress>({
    line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US',
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const amountInCents = Math.round((item.price || 0) * 100)

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !address.line1 || !address.city || !address.state || !address.postalCode) {
      setErrorMsg('Please fill in all required fields')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const result = await shopApi.createPaymentIntent({
        listingId: item.id,
        customerEmail: email,
        customerName: name || undefined,
        shippingAddress: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      })

      setClientSecret(result.clientSecret)
      setOrderId(result.orderId)
      setStage('payment')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  if (!stripePromise) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
          <p className="text-red-400">Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">
            {stage === 'success' ? 'Order Confirmed' : 'Buy Direct'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Order Summary */}
          <div className="bg-slate-700/50 rounded-lg p-4 flex gap-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm line-clamp-2">{item.title}</p>
              {item.condition && <p className="text-slate-400 text-xs mt-1">{item.condition}</p>}
              <p className="text-green-400 font-bold text-lg mt-1">
                ${item.price?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Details Form */}
          {stage === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div className="border-t border-slate-700 pt-3">
                <p className="text-sm font-medium text-slate-300 mb-2">Shipping Address</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={address.line1}
                    onChange={e => setAddress(prev => ({ ...prev, line1: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address *"
                  />
                  <input
                    type="text"
                    value={address.line2}
                    onChange={e => setAddress(prev => ({ ...prev, line2: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apt, suite, etc."
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City *"
                    />
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      required
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State *"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={e => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      required
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ZIP Code *"
                    />
                    <select
                      value={address.country}
                      onChange={e => setAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Setting up payment...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </form>
          )}

          {/* Payment Form */}
          {stage === 'payment' && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#3b82f6',
                    colorBackground: '#1e293b',
                    colorText: '#e2e8f0',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <PaymentForm
                amount={amountInCents}
                onSuccess={() => setStage('success')}
                onError={(msg) => {
                  setErrorMsg(msg)
                  setStage('error')
                }}
              />
            </Elements>
          )}

          {/* Success */}
          {stage === 'success' && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <div>
                <h4 className="text-xl font-bold text-white">Payment Successful!</h4>
                <p className="text-slate-400 mt-2">
                  Your order has been placed. We'll send shipping details to <span className="text-white">{email}</span>.
                </p>
                {orderId && (
                  <p className="text-slate-500 text-sm mt-2">Order ID: {orderId}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Error */}
          {stage === 'error' && (
            <div className="text-center py-6 space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              <div>
                <h4 className="text-xl font-bold text-white">Payment Failed</h4>
                <p className="text-slate-400 mt-2">{errorMsg || 'Something went wrong. Please try again.'}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setStage('payment'); setErrorMsg('') }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
