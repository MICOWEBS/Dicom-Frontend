import { useSubscription } from '../contexts/SubscriptionContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const SubscriptionInfo = () => {
  const { status, loading, error } = useSubscription();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-text/10 rounded w-1/4" />
        <div className="h-4 bg-text/10 rounded w-1/2" />
        <div className="h-4 bg-text/10 rounded w-3/4" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-alert/20 text-alert p-4 rounded-lg">
        <AlertCircle className="inline-block mr-2" />
        {error || 'Failed to load subscription information'}
      </div>
    );
  }

  const getTierFeatures = (tier: string) => {
    switch (tier) {
      case 'free':
        return [
          { name: '5 DICOM uploads per month', enabled: true },
          { name: 'Basic DICOM viewer', enabled: true },
          { name: 'Standard support', enabled: true },
          { name: 'Advanced analytics', enabled: false },
          { name: 'Priority support', enabled: false },
          { name: 'Unlimited uploads', enabled: false }
        ];
      case 'pro':
        return [
          { name: '50 DICOM uploads per month', enabled: true },
          { name: 'Advanced DICOM viewer', enabled: true },
          { name: 'Priority support', enabled: true },
          { name: 'Basic analytics', enabled: true },
          { name: 'API access', enabled: true },
          { name: 'Unlimited uploads', enabled: false }
        ];
      case 'enterprise':
        return [
          { name: 'Unlimited DICOM uploads', enabled: true },
          { name: 'Enterprise viewer', enabled: true },
          { name: '24/7 support', enabled: true },
          { name: 'Advanced analytics', enabled: true },
          { name: 'Custom integrations', enabled: true },
          { name: 'Dedicated account manager', enabled: true }
        ];
      default:
        return [];
    }
  };

  const features = getTierFeatures(status.tier);
  const usagePercentage = (status.uploadCount / status.uploadLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-6 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {status.tier.charAt(0).toUpperCase() + status.tier.slice(1)} Plan
        </h2>
        <div className="text-text/60">
          Current usage: {status.uploadCount} / {status.uploadLimit} uploads
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-text/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercentage >= 90 ? 'bg-alert' : 'bg-healthy'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        {usagePercentage >= 90 && (
          <div className="text-alert text-sm flex items-center">
            <AlertCircle className="inline-block mr-2" size={16} />
            You're approaching your upload limit. Consider upgrading your plan.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Plan Features</h3>
        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex items-center">
              {feature.enabled ? (
                <CheckCircle className="text-healthy mr-2" size={20} />
              ) : (
                <XCircle className="text-text/40 mr-2" size={20} />
              )}
              <span className={feature.enabled ? '' : 'text-text/60'}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {status.tier !== 'enterprise' && (
        <div className="pt-4 border-t border-text/10">
          <a
            href="/subscription/upgrade"
            className="inline-flex items-center justify-center px-4 py-2 bg-healthy text-white rounded-lg hover:bg-healthy/90 transition-colors"
          >
            Upgrade Plan
          </a>
        </div>
      )}
    </motion.div>
  );
}; 