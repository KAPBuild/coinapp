import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Globe, Lock, User } from 'lucide-react'

export function Settings() {
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    language: 'English',
  })

  const [saved, setSaved] = useState(false)

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to a backend
    console.log('Preferences saved:', preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="flex justify-center mb-4">
          <SettingsIcon className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and application settings</p>
      </section>

      {/* Success Message */}
      {saved && (
        <div className="max-w-2xl mx-auto p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Grid */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Preferences Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Preferences
          </h2>

          <div className="space-y-6">
            {/* Currency Preference */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-900 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
                <option>CAD - Canadian Dollar</option>
                <option>AUD - Australian Dollar</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">Display all prices in this currency</p>
            </div>

            {/* Language Preference */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">Interface language</p>
            </div>

            {/* Dark Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Dark Mode</label>
              <button
                onClick={() => handlePreferenceChange('darkMode', !preferences.darkMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {preferences.darkMode ? 'Enabled' : 'Disabled'}
              </button>
              <p className="text-sm text-gray-600 mt-1">Enable dark theme for the application</p>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notifications
          </h2>

          <div className="space-y-4">
            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive alerts about price changes and collection updates</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.notifications
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {preferences.notifications ? 'On' : 'Off'}
              </button>
            </div>

            {/* Email Updates Toggle */}
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Updates</h3>
                <p className="text-sm text-gray-600">Get weekly summaries and important announcements</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('emailUpdates', !preferences.emailUpdates)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.emailUpdates
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {preferences.emailUpdates ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Privacy & Security
          </h2>

          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add extra security to your account</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900">Privacy Policy</h3>
              <p className="text-sm text-gray-600">View our privacy practices</p>
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Account
          </h2>

          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-600">Update your name and profile information</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <h3 className="font-medium text-gray-900">Download Data</h3>
              <p className="text-sm text-gray-600">Get a copy of all your collection data</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600">
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm">Permanently delete your account and all data</p>
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
