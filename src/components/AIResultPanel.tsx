import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIResult {
  label: string;
  confidence: number;
  description: string;
  findings: string[];
}

interface AIResultPanelProps {
  results: AIResult[];
}

export const AIResultPanel = ({ results }: AIResultPanelProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'healthy';
    if (confidence >= 0.6) return 'warning';
    return 'alert';
  };

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">AI Analysis Results</h3>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-text/10 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 flex items-center justify-between hover:bg-text/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`badge badge-${getConfidenceColor(result.confidence)}`}>
                  {(result.confidence * 100).toFixed(1)}%
                </div>
                <span className="font-medium">{result.label}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
                  <p className="text-text/80 mb-3">{result.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Findings:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.findings.map((finding, i) => (
                        <li key={i} className="text-text/80">
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 