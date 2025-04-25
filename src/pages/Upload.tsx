import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadZone } from '../components/UploadZone';

interface Metadata {
  patientName: string;
  studyDate: string;
  modality: string;
  studyDescription: string;
}

export const Upload = () => {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadComplete = async (fileId: string) => {
    setIsProcessing(true);
    try {
      // Fetch metadata after upload
      const response = await fetch(`/api/dicom/${fileId}/metadata`);
      const data = await response.json();
      setMetadata(data);
      
      // Navigate to viewer after a short delay
      setTimeout(() => {
        navigate(`/viewer/${fileId}`);
      }, 2000);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Upload DICOM File</h2>
          <UploadZone onUploadComplete={handleUploadComplete} />
        </div>

        {metadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-medium mb-4">File Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text/60">Patient Name</p>
                <p className="font-mono">{metadata.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-text/60">Study Date</p>
                <p className="font-mono">{metadata.studyDate}</p>
              </div>
              <div>
                <p className="text-sm text-text/60">Modality</p>
                <p className="font-mono">{metadata.modality}</p>
              </div>
              <div>
                <p className="text-sm text-text/60">Study Description</p>
                <p className="font-mono">{metadata.studyDescription}</p>
              </div>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card bg-warning/20 text-warning text-center"
          >
            <p className="font-medium">Processing your DICOM file...</p>
            <p className="text-sm mt-2">You will be redirected to the viewer shortly.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}; 