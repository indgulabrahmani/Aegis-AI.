import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Target, 
  Activity, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  Settings,
  Bot
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: 'Mission Input', icon: Target },
  { path: '/activity', label: 'Live Activity', icon: Activity },
  { path: '/agents', label: 'Agents', icon: Bot },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/approvals', label: 'Approval Center', icon: CheckCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="fixed left-0 top-0 h-screen w-64 glass-strong border-r border-border/50 z-50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-b border-border/50"
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-text">Aegis</h1>
              <p className="text-xs text-textMuted">AI CEO Assistant</p>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-textMuted hover:bg-surface hover:text-text"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn(
                    "w-5 h-5 relative z-10 transition-transform group-hover:scale-110",
                    isActive && "text-primary"
                  )} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 border-t border-border/50"
        >
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-textMuted">System Online</span>
            </div>
            <p className="text-xs text-textMuted">v1.0.0 Enterprise</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
