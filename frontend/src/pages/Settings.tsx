import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Key, Bell, Shield, Moon, Sun, Save, Check } from 'lucide-react';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <SettingsIcon className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-text">Settings</h1>
          <p className="text-textMuted">Configure your Aegis experience</p>
        </div>
      </motion.div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">API Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">LLM API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Anthropic or OpenAI API key"
                className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-textMuted hover:text-text transition-colors"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
            <p className="text-xs text-textMuted mt-2">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">API Provider</label>
            <select className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300">
              <option value="anthropic">Anthropic Claude</option>
              <option value="openai">OpenAI GPT-4</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text">Preferences</h2>
        </div>

        <div className="space-y-4">
          {/* Auto Approve */}
          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl">
            <div>
              <p className="font-medium text-text">Auto-approve low-risk tasks</p>
              <p className="text-sm text-textMuted">Automatically approve tasks marked as low-risk</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setAutoApprove(!autoApprove)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                autoApprove ? 'bg-primary' : 'bg-surface'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ x: autoApprove ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl">
            <div>
              <p className="font-medium text-text">Enable notifications</p>
              <p className="text-sm text-textMuted">Get notified when missions complete</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                notifications ? 'bg-primary' : 'bg-surface'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ x: notifications ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl">
            <div>
              <p className="font-medium text-text">Dark mode</p>
              <p className="text-sm text-textMuted">Toggle between light and dark themes</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-primary' : 'bg-surface'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: darkMode ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold text-text">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl">
            <div>
              <p className="font-medium text-text">Audit logging</p>
              <p className="text-sm text-textMuted">Log all agent decisions for compliance</p>
            </div>
            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl">
            <div>
              <p className="font-medium text-text">Approval gates</p>
              <p className="text-sm text-textMuted">Require approval for high-stakes actions</p>
            </div>
            <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">Enabled</span>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-semibold flex items-center gap-2 glow-primary"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.26 13.26 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
