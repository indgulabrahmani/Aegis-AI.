import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Tag } from 'lucide-react';

const documents = [
  {
    id: '1',
    title: 'Backend Engineer Job Description',
    type: 'Job Description',
    agent: 'HR Agent',
    date: '2 hours ago',
    size: '12 KB',
    status: 'approved',
  },
  {
    id: '2',
    title: 'Q3 Budget Breakdown',
    type: 'Financial Summary',
    agent: 'Finance Agent',
    date: '5 hours ago',
    size: '8 KB',
    status: 'approved',
  },
  {
    id: '3',
    title: 'NDA Template',
    type: 'Legal Document',
    agent: 'Legal Agent',
    date: '1 day ago',
    size: '15 KB',
    status: 'approved',
  },
  {
    id: '4',
    title: 'GTM Strategy - Product Launch',
    type: 'Marketing Plan',
    agent: 'Marketing Agent',
    date: '2 days ago',
    size: '24 KB',
    status: 'approved',
  },
  {
    id: '5',
    title: 'Interview Scorecard - Senior Role',
    type: 'HR Document',
    agent: 'HR Agent',
    date: '3 days ago',
    size: '10 KB',
    status: 'approved',
  },
  {
    id: '6',
    title: 'Runway Analysis',
    type: 'Financial Report',
    agent: 'Finance Agent',
    date: '4 days ago',
    size: '18 KB',
    status: 'approved',
  },
];

export function Documents() {
  const getTypeColor = (type: string) => {
    if (type.includes('Job') || type.includes('HR')) return '#10b981';
    if (type.includes('Financial') || type.includes('Budget')) return '#f59e0b';
    if (type.includes('Legal')) return '#ef4444';
    return '#8b5cf6';
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
            <FileText className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-text">Documents</h1>
            <p className="text-textMuted">Repository of all generated artifacts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 glass rounded-xl text-textMuted hover:text-text transition-colors"
          >
            Filter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-medium"
          >
            Export All
          </motion.button>
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
          { label: 'Total Documents', value: documents.length },
          { label: 'This Week', value: 12 },
          { label: 'Total Size', value: '2.4 MB' },
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-2xl p-6 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${getTypeColor(doc.type)}20` }}
              >
                <FileText className="w-6 h-6" style={{ color: getTypeColor(doc.type) }} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-surface rounded-lg"
              >
                <Download className="w-5 h-5 text-textMuted" />
              </motion.button>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-text mb-2 line-clamp-2">{doc.title}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-textMuted">
                <Tag className="w-4 h-4" />
               <span>{doc.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-textMuted">
                <Calendar className="w-4 h-4" />
                <span>{doc.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-textMuted">
                <span className="px-2 py-0.5 bg-surface/50 rounded text-xs">{doc.agent}</span>
                <span>•</span>
                <span>{doc.size}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 bg-surface/50 rounded-xl text-sm text-text hover:bg-surface transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 bg-primary/20 rounded-xl text-sm text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
