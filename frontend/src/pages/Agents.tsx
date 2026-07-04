import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Clock, Zap } from 'lucide-react';
import type { AgentInfo } from '../types';

const agents: AgentInfo[] = [
  {
    id: 'hr',
    name: 'HR Agent',
    icon: '👥',
    color: '#10b981',
    description: 'Specializes in human resources, talent acquisition, and team management. Handles all aspects of hiring from job descriptions to onboarding.',
    capabilities: [
      'Job description drafting',
      'Interview scorecard creation',
      'Onboarding checklist generation',
      'Compensation analysis',
      'Team structure planning',
    ],
    status: 'idle',
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: '💰',
    color: '#f59e0b',
    description: 'Expert in financial planning, budgeting, and runway analysis. Provides data-driven insights for financial decision-making.',
    capabilities: [
      'Runway calculations',
      'Budget breakdowns',
      'Expense categorization',
      'Financial summaries',
      'Cash flow projections',
    ],
    status: 'idle',
  },
  {
    id: 'legal',
    name: 'Legal Agent',
    icon: '⚖️',
    color: '#ef4444',
    description: 'Handles contract drafting, compliance checks, and legal documentation. All legal outputs require founder approval for safety.',
    capabilities: [
      'NDA drafting',
      'Offer letter templates',
      'Terms of Service skeletons',
      'Compliance checklists',
      'Contract reviews',
    ],
    status: 'idle',
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    icon: '📢',
    color: '#8b5cf6',
    description: 'Creates go-to-market strategies, positioning statements, and marketing content. Focuses on growth and brand awareness.',
    capabilities: [
      'GTM strategy development',
      'Positioning statements',
      'Launch checklists',
      'Social media content',
      'Marketing campaign plans',
    ],
    status: 'idle',
  },
];

export function Agents() {
  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'thinking':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
            <Zap className="w-4 h-4" />
            Thinking
          </span>
        );
      case 'working':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
            <Zap className="w-4 h-4 animate-pulse" />
            Working
          </span>
        );
      case 'done':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-success/20 text-success rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Done
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-surface text-textMuted rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Idle
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
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
          <Bot className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-text mb-3">Specialized Agents</h1>
        <p className="text-textMuted text-lg max-w-2xl mx-auto">
          Four AI-powered specialists working in harmony to execute your missions
        </p>
      </motion.div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-strong rounded-3xl p-8 relative overflow-hidden group"
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${agent.color}20, transparent)` }}
            />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text">{agent.name}</h3>
                    {getStatusBadge(agent.status)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-textMuted mb-6 leading-relaxed">{agent.description}</p>

              {/* Capabilities */}
              <div>
                <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-3">
                  Capabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability) => (
                    <motion.span
                      key={capability}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-surface/50 rounded-xl text-sm text-textMuted border border-border/30"
                    >
                      {capability}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-text">24</p>
                  <p className="text-xs text-textMuted">Tasks Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text">98%</p>
                  <p className="text-xs text-textMuted">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text">1.2s</p>
                  <p className="text-xs text-textMuted">Avg Time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4">System Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-text mb-2">Orchestrator</h4>
            <p className="text-sm text-textMuted">
              Coordinates agents and breaks down missions into actionable tasks
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-semibold text-text mb-2">Parallel Execution</h4>
            <p className="text-sm text-textMuted">
              Agents work simultaneously for maximum efficiency
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h4 className="font-semibold text-text mb-2">Safety Gates</h4>
            <p className="text-sm text-textMuted">
              High-stakes actions require founder approval before execution
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
