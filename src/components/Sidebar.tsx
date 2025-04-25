import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Settings, LogOut, ChevronRight } from 'lucide-react';
import { SubscriptionInfo } from './SubscriptionInfo';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="h-screen bg-card border-r border-text/10 flex flex-col"
    >
      <div className="p-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="text-xl font-semibold"
        >
          DICOM Viewer
        </motion.div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-text/10 rounded-lg transition-colors"
        >
          <ChevronRight
            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <a
          href="/"
          className="flex items-center p-2 hover:bg-text/10 rounded-lg transition-colors"
        >
          <Upload className="mr-3" />
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
          >
            Upload
          </motion.span>
        </a>
        <a
          href="/settings"
          className="flex items-center p-2 hover:bg-text/10 rounded-lg transition-colors"
        >
          <Settings className="mr-3" />
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
          >
            Settings
          </motion.span>
        </a>
      </nav>

      <div className="p-4 border-t border-text/10">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
        >
          <SubscriptionInfo />
        </motion.div>
      </div>

      <div className="p-4 border-t border-text/10">
        <button className="flex items-center p-2 hover:bg-text/10 rounded-lg transition-colors w-full">
          <LogOut className="mr-3" />
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
          >
            Logout
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}; 