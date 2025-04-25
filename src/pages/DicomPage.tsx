import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadZone } from '../components/UploadZone';
import { DicomViewer } from '../components/DicomViewer';
import { dicomService } from '../api/dicomService';
import { DicomFile } from '../types/dicom';

export const DicomPage: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(fileId || null);
  const [files, setFiles] = useState<DicomFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const loadedFiles = await dicomService.getFiles();
        setFiles(loadedFiles);
      } catch (err) {
        console.error('Error loading files:', err);
        setError('Failed to load files. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  // Update selected file when URL changes
  useEffect(() => {
    if (fileId) {
      setSelectedFileId(fileId);
    }
  }, [fileId]);

  const handleUploadComplete = async (fileId: string) => {
    setSelectedFileId(fileId);
    navigate(`/view/${fileId}`);
    // Refresh files list
    const updatedFiles = await dicomService.getFiles();
    setFiles(updatedFiles);
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await dicomService.deleteFile(fileId);
      const updatedFiles = await dicomService.getFiles();
      setFiles(updatedFiles);
      if (selectedFileId === fileId) {
        setSelectedFileId(null);
        navigate('/');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
    navigate(`/view/${fileId}`);
  };

  const handleRunInference = async (fileId: string) => {
    try {
      await dicomService.runInference(fileId);
      navigate(`/inference/${fileId}`);
    } catch (err) {
      console.error('Error running inference:', err);
      setError('Failed to run inference. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">DICOM Viewer</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar with file list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            <UploadZone onUploadComplete={handleUploadComplete} />
            
            {loading ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFileId === file.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFileId(file.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{file.filename}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          {selectedFileId ? (
            <DicomViewer fileId={selectedFileId} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                Select a file from the list or upload a new one to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 