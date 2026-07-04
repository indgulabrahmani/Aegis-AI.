import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

const pendingApprovals = [
  {
    id: '1',
    mission: 'Hire senior backend engineer',
    task: 'Offer letter template',
    agent: 'Legal Agent',
    description: 'Drafted offer letter template with standard terms including salary, equity, and benefits package.',
    requiresApproval: true,
    timestamp: '10 minutes ago',
  },
  {
    id: '2',
    mission: 'Hire senior backend engineer',
    task: 'Runway impact analysis',
    agent: 'Finance Agent',
    description: 'Calculated runway impact of $150k/year hire. Current runway: 18 months → 14 months post-hire.',
    requiresApproval: true,
    timestamp: '15 minutes ago',
  },
];

const approvalHistory = [
  {
    id: '3',
    mission: 'Prepare investor deck',
    task: 'Financial projections',
    agent: 'Finance Agent',
    decision: 'approved',
    timestamp: '2 hours ago',
    comment: 'Numbers look solid, proceed with deck',
  },
  {
    id: '4',
    mission: 'Contractor agreement',
    task: 'NDA template',
    agent: 'Legal Agent',
    decision: 'approved',
    timestamp: '1 day ago',
    comment: 'Standard NDA looks good',
  },
];

export function ApprovalCenter() {
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [history, setHistory] = useState(approvalHistory);

  const handleApprove = (id: string) => {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
      setApprovals(prev => prev.filter(a => a.id !== id));
      setHistory(prev => [{
        ...approval,
        decision: 'approved' as const,
        comment: 'Approved by founder',
      }, ...prev]);
    }
  };

  const handleReject = (id: string) => {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
      setApprovals(prev => prev.filter(a => a.id !== id));
      setHistory(prev => [{
        ...approval,
        decision: 'rejected' as const,
        comment: 'Rejected by founder',
      }, ...prev]);
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
        className="flex items-center gap-4 mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-orange-600 flex items-center justify-center"
        >
          <CheckCircle2 className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-text">Approval Center</h1>
          <p className="text-textMuted">Review and approve high-stakes actions</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          { label: 'Pending', value: approvals.length, color: 'warning' },
          { label: 'Approved Today', value: 8, color: 'success' },
          { label: 'Rejected Today', value: 1, color: 'error' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-sm text-textMuted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending Approvals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          Pending Approvals ({approvals.length})
        </h2>
        
        {approvals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <p className="text-text font-medium mb-2">All caught up!</p>
            <p className="text-textMuted">No pending approvals at this time</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-strong rounded-2xl p-6 border-l-4 border-warning"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">{approval.task}</h3>
                      <p className="text-sm text-textMuted mb-2">{approval.mission}</p>
                      <div className="flex items-center gap-3 text-xs text-textMuted">
                        <span className="px-2 py-1 bg-surface/50 rounded">{approval.agent}</span>
                        <span>{approval.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(approval.id)}
                      className="px-4 py-2 bg-success/20 text-success rounded-xl hover:bg-success/30 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(approval.id)}
                      className="px-4 py-2 bg-error/20 text-error rounded-xl hover:bg-error/30 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </motion.button>
                  </div>
                </div>
                
                <div className="bg-surface/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-textMuted" />
                    <span className="text-sm font-medium text-text">Output</span>
                  </div>
                  <p className="text-sm text-textMuted">{approval.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Approval History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-text mb-4">Approval History</h2>
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="glass rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.decision === 'approved' ? 'bg-success/20' : 'bg-error/20'
                }`}>
                  {item.decision === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-error" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-text">{item.task}</p>
                  <p className="text-sm text-textMuted">{item.mission}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                  item.decision === 'approved' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                }`}>
                  {item.decision}
                </span>
                <p className="text-xs text-textMuted mt-1">{item.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
