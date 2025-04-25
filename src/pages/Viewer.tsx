import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/config';
import { DicomViewer } from '../components/DicomViewer';
import { AIResultPanel } from '../components/AIResultPanel';

interface DicomData {
  id: string;
  filename: string;
  metadata: {
    patientId?: string;
    studyDate?: string;
    modality?: string;
    [key: string]: any;
  };
  aiResults?: {
    predictions?: any[];
    annotations?: any[];
    [key: string]: any;
  };
}

export const Viewer = () => {
  const { id } = useParams<{ id: string }>();
  const [dicomData, setDicomData] = useState<DicomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDicomData = async () => {
      try {
        setLoading(true);
        const [metadataResponse, aiResponse] = await Promise.all([
          api.get(`/viewer/${id}/metadata`),
          api.get(`/viewer/${id}/ai-results`),
        ]);
        setDicomData({
          id: id!, 
          filename: metadataResponse.data.filename,
          metadata: metadataResponse.data.metadata,
          aiResults: aiResponse.data,
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch DICOM data:', err);
        setError('Failed to load DICOM data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDicomData();
    }
  }, [id]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error || !dicomData) {
    return <div className="text-red-500">{error || 'Failed to load DICOM data'}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <DicomViewer fileId={dicomData.id} />
      </div>
      <div className="lg:col-span-1">
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium mb-2">Metadata</h3>
            <dl className="space-y-2">
              {Object.entries(dicomData.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-text/60">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {dicomData.aiResults && (
            <AIResultPanel results={dicomData.aiResults.predictions || []} />
          )}
        </div>
      </div>
    </div>
  );
}; 