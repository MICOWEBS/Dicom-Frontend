import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { dicomService } from '../api/dicomService';
import { useSubscription } from '../contexts/SubscriptionContext';

interface UploadZoneProps {
  onUploadComplete: (fileId: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { checkUploadLimit } = useSubscription();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFile(file);
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const canUpload = await checkUploadLimit();
      if (!canUpload) {
        setError('Upload limit reached. Please upgrade your subscription.');
        return;
      }

      const response = await dicomService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.fileId) {
        onUploadComplete(response.fileId);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [checkUploadLimit, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{file?.name}</span>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {uploadProgress}% uploaded
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the DICOM file here'
                  : 'Drag and drop a DICOM file here, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported format: .dcm
              </p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 