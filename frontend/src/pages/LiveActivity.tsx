import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { AgentInfo } from '../types';

const mockAgents: AgentInfo[] = [
  {
    id: 'hr',
    name: 'HR Agent',
    icon: '👥',
    color: '#10b981',
    description: 'Handles hiring, onboarding, and team management',
    capabilities: ['Job descriptions', 'Interview scorecards', 'Onboarding checklists'],
    status: 'idle',
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: '💰',
    color: '#f59e0b',
    description: 'Manages financial planning and runway analysis',
    capabilities: ['Runway calculations', 'Budget breakdowns', 'Expense tracking'],
    status: 'idle',
  },
  {
    id: 'legal',
    name: 'Legal Agent',
    icon: '⚖️',
    color: '#ef4444',
    description: 'Drafts contracts and ensures compliance',
    capabilities: ['Contract drafts', 'Compliance checklists', 'Legal reviews'],
    status: 'idle',
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    icon: '📢',
    color: '#8b5cf6',
    description: 'Creates GTM strategies and marketing content',
    capabilities: ['GTM plans', 'Positioning statements', 'Launch checklists'],
    status: 'idle',
  },
];

export function LiveActivity() {
  const [agents, setAgents] = useState<AgentInfo[]>(mockAgents);
  const [currentMission, setCurrentMission] = useState<string | null>(null);

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'working' && Math.random() > 0.7) {
          return { ...agent, status: 'done' as const };
        }
        return agent;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: AgentInfo['status']) => {
    switch (status) {
      case 'thinking':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case 'working':
        return <Loader2 className="w-5 h-5 animate-spin text-accent" />;
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      default:
        return <Clock className="w-5 h-5 text-textMuted" />;
    }
  };

  const getStatusText = (status: AgentInfo['status']) => {
    switch (status) {
      case 'thinking':
        return 'Analyzing task...';
      case 'working':
        return 'Executing...';
      case 'done':
        return 'Completed';
      default:
        return 'Idle';
    }
  };

  const simulateMission = () => {
    setCurrentMission('Hire first backend engineer');
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'thinking' as const,
    })));

    setTimeout(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'working' as const,
      })));
    }, 1500);
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
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Activity className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-text">Live Agent Activity</h1>
            <p className="text-textMuted">Real-time agent orchestration and execution</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={simulateMission}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-semibold flex items-center gap-2 glow-primary"
        >
          <Activity className="w-5 h-5" />
          Simulate Mission
        </motion.button>
      </motion.div>

      {/* Current Mission */}
      {currentMission && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-8 border-l-4 border-primary"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-textMuted">Current Mission</p>
              <p className="text-lg font-semibold text-text">{currentMission}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass rounded-2xl p-6 relative overflow-hidden ${
              agent.status !== 'idle' ? 'border-2' : 'border border-border/50'
            }`}
            style={{
              borderColor: agent.status !== 'idle' ? agent.color : undefined,
            }}
          >
            {/* Glow effect for active agents */}
            {agent.status !== 'idle' && (
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: agent.color }}
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(agent.status)}
                      <span className="text-sm text-textMuted">{getStatusText(agent.status)}</span>
                    </div>
                  </div>
                </div>
                {agent.status !== 'idle' && (
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agent.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              <p className="text-textMuted mb-4">{agent.description}</p>

              <div className="space-y-2">
                <p className="text-xs text-textMuted uppercase tracking-wider">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="px-3 py-1 bg-surface/50 rounded-full text-xs text-textMuted border border-border/30"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4">Activity Timeline</h3>
        <div className="space-y-4">
          {[
            { time: '2 min ago', event: 'Mission launched: Hire first backend engineer', agent: 'Orchestrator' },
            { time: '1 min ago', event: 'Task assigned to HR Agent', agent: 'Orchestrator' },
            { time: '1 min ago', event: 'Task assigned to Finance Agent', agent: 'Orchestrator' },
            { time: '30 sec ago', event: 'Task assigned to Legal Agent', agent: 'Orchestrator' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-surface/30 rounded-xl"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-text">{item.event}</p>
                  <span className="text-xs text-textMuted">{item.time}</span>
                </div>
                <p className="text-sm text-textMuted">by {item.agent}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
