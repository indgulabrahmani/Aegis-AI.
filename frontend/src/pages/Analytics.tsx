import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';

const stats = [
  { label: 'Missions Completed', value: 47, icon: CheckCircle2, color: '#10b981' },
  { label: 'Tasks Executed', value: 234, icon: Zap, color: '#8b5cf6' },
  { label: 'Time Saved', value: 89, suffix: 'hrs', icon: Clock, color: '#f59e0b' },
  { label: 'Approval Rate', value: 94, suffix: '%', icon: TrendingUp, color: '#6366f1' },
];

const agentStats = [
  { agent: 'HR Agent', tasks: 58, color: '#10b981' },
  { agent: 'Finance Agent', tasks: 62, color: '#f59e0b' },
  { agent: 'Legal Agent', tasks: 45, color: '#ef4444' },
  { agent: 'Marketing Agent', tasks: 69, color: '#8b5cf6' },
];

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function Analytics() {
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
        className="flex items-center gap-4 mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <BarChart3 className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-text">Analytics</h1>
          <p className="text-textMuted">Performance metrics and insights</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
              <p className="text-3xl font-bold text-text mb-1">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-textMuted">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-text mb-6">Agent Performance</h3>
        <div className="space-y-4">
          {agentStats.map((stat, index) => (
            <motion.div
              key={stat.agent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text font-medium">{stat.agent}</span>
                <span className="text-textMuted text-sm">{stat.tasks} tasks</span>
              </div>
              <div className="h-3 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.tasks / 70) * 100}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { mission: 'Hire senior engineer', time: '2 hours ago', status: 'completed' },
            { mission: 'Prepare investor deck', time: '5 hours ago', status: 'completed' },
            { mission: 'Review legal contracts', time: '1 day ago', status: 'completed' },
            { mission: 'Launch marketing campaign', time: '2 days ago', status: 'completed' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="flex items-center justify-between p-4 bg-surface/30 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div>
                  <p className="font-medium text-text">{item.mission}</p>
                  <p className="text-sm text-textMuted">{item.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs capitalize">
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
