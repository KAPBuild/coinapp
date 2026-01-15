import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to a backend
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="flex justify-center mb-4">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">Thank you! We've received your message and will get back to you soon.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="How can we help?"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">How quickly will I get a response?</h3>
            <p className="text-gray-600">We aim to respond to all inquiries within 24 business hours.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">What's the best way to report a bug?</h3>
            <p className="text-gray-600">Please describe the issue in detail and let us know your device/browser information.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
