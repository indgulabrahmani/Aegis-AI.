import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles, ArrowRight, Zap } from 'lucide-react';

const examplePrompts = [
  "Hire our first backend engineer",
  "Prepare investor update for seed round",
  "Set up contractor agreement",
  "Launch product marketing campaign",
  "Review legal compliance checklist",
];

export function MissionInput() {
  const [mission, setMission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission.trim()) return;
    
    setIsSubmitting(true);
    // TODO: Connect to backend API
    setTimeout(() => {
      setIsSubmitting(false);
      setMission('');
    }, 2000);
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
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 glow-primary"
        >
          <Target className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-text mb-3">Define Your Mission</h1>
        <p className="text-textMuted text-lg">
          Describe your goal and Aegis will orchestrate specialized agents to execute it
        </p>
      </motion.div>

      {/* Main Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-3xl p-8 mb-8"
      >
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="What would you like to accomplish today?"
              className="w-full h-40 bg-surface/50 border border-border/50 rounded-2xl p-6 text-text placeholder:text-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none"
              disabled={isSubmitting}
            />
            <motion.div
              className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-textMuted"
              initial={{ opacity: 0 }}
              animate={{ opacity: mission ? 1 : 0 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{mission.length} characters</span>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!mission.trim() || isSubmitting}
            className="mt-6 w-full py-4 px-8 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-primary"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <span>Launching Mission...</span>
              </>
            ) : (
              <>
                <span>Launch Mission</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Example Prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <p className="text-textMuted text-sm mb-4 text-center">Try these examples:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {examplePrompts.map((prompt, index) => (
            <motion.button
              key={prompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMission(prompt)}
              className="glass px-4 py-2 rounded-full text-sm text-textMuted hover:text-text hover:border-primary/50 transition-all duration-300"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { icon: '🤖', title: 'AI-Powered', desc: '4 specialized agents work in parallel' },
          { icon: '⚡', title: 'Lightning Fast', desc: 'Orchestration in seconds, not hours' },
          { icon: '🔒', title: 'Safe & Audited', desc: 'High-stakes actions require approval' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-2xl p-6 text-center cursor-pointer"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-text mb-2">{item.title}</h3>
            <p className="text-sm text-textMuted">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
