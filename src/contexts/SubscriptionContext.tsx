import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/config';

interface SubscriptionStatus {
  tier: 'free' | 'pro' | 'enterprise';
  uploadCount: number;
  uploadLimit: number;
  features: {
    [key: string]: boolean;
  };
}

interface SubscriptionContextType {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkUploadLimit: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscription');
      setStatus(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  const checkUploadLimit = async (): Promise<boolean> => {
    try {
      const response = await api.get('/subscription/limits');
      return response.data.canUpload;
    } catch (err) {
      console.error('Failed to check upload limit:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const value = {
    status,
    loading,
    error,
    checkUploadLimit,
    refreshStatus: fetchStatus,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 