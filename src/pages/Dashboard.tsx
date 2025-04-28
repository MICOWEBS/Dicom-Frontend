import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { UploadZone } from '../components/UploadZone';
import { SubscriptionInfo } from '../components/SubscriptionInfo';

interface Stats {
  totalFiles: number;
  totalInferences: number;
  successfulInferences: number;
  failedInferences: number;
  storageUsed: number;
  lastUpload: string | null;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalFiles: 0,
    totalInferences: 0,
    successfulInferences: 0,
    failedInferences: 0,
    storageUsed: 0,
    lastUpload: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUploadComplete = (fileId: string) => {
    // Refresh stats after successful upload
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Files</h3>
          <p className="text-3xl font-bold">{stats.totalFiles}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.storageUsed.toFixed(2)} MB used
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Inferences</h3>
          <p className="text-3xl font-bold">{stats.totalInferences}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.successfulInferences} successful
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          {stats.lastUpload ? (
            <p className="text-sm">
              Last upload: {new Date(stats.lastUpload).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-text/60">Total Uploads</h3>
            <p className="text-2xl font-medium">{stats.totalFiles}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-text/60">Total Storage</h3>
            <p className="text-2xl font-medium">
              {(stats.storageUsed || 0).toFixed(2)} MB
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <SubscriptionInfo />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Upload DICOM</h2>
            <UploadZone onUploadComplete={handleUploadComplete} />
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Recent Uploads</h2>
            <div className="bg-card rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-text/10">
                    <th className="text-left p-4">Filename</th>
                    <th className="text-left p-4">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lastUpload && (
                    <tr className="border-b border-text/10">
                      <td className="p-4">{stats.lastUpload}</td>
                      <td className="p-4">
                        {new Date(stats.lastUpload).toLocaleDateString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 