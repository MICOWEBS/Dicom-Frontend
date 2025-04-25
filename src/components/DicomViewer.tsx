import React, { useState, useEffect } from 'react';
import { Image, Info, AlertCircle } from 'lucide-react';
import { dicomService } from '../api/dicomService';
import { InferenceButton } from './InferenceButton';
import { DicomMetadata, InferenceResult, DicomViewerState } from '../types/dicom';

interface DicomViewerProps {
  fileId: string;
}

export const DicomViewer: React.FC<DicomViewerProps> = ({ fileId }) => {
  const [state, setState] = useState<DicomViewerState>({
    previewUrl: null,
    metadata: null,
    inferenceResults: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const loadDicomData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Load preview
        const preview = await dicomService.getPreview(fileId);
        
        // Load metadata
        const meta = await dicomService.getMetadata(fileId);
        
        // Try to load existing inference results
        let results: InferenceResult | null = null;
        try {
          results = await dicomService.getInferenceResults(fileId);
        } catch (err) {
          console.log('No inference results available');
        }

        setState({
          previewUrl: preview,
          metadata: meta,
          inferenceResults: results,
          error: null,
          loading: false,
        });
      } catch (err) {
        console.error('Error loading DICOM data:', err);
        setState(prev => ({
          ...prev,
          error: 'Failed to load DICOM data. Please try again.',
          loading: false,
        }));
      }
    };

    loadDicomData();

    return () => {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
    };
  }, [fileId]);

  const handleInferenceComplete = (results: InferenceResult) => {
    setState(prev => ({ ...prev, inferenceResults: results }));
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {state.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Image className="w-5 h-5 mr-2 text-gray-500" />
          <h2 className="text-lg font-semibold">DICOM Preview</h2>
        </div>
        {state.previewUrl && (
          <div className="flex justify-center">
            <img
              src={state.previewUrl}
              alt="DICOM Preview"
              className="max-h-96 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-4">
          <Info className="w-5 h-5 mr-2 text-gray-500" />
          <h2 className="text-lg font-semibold">Metadata</h2>
        </div>
        {state.metadata && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(state.metadata).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-sm text-gray-500">{key}</div>
                <div className="text-sm font-medium">{String(value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inference Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AI Analysis</h2>
          <InferenceButton
            fileId={fileId}
            onInferenceComplete={handleInferenceComplete}
          />
        </div>
        {state.inferenceResults && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Findings</div>
              <div className="text-sm font-medium">
                {state.inferenceResults.findings.join(', ')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="text-sm font-medium">
                {(state.inferenceResults.confidence * 100).toFixed(2)}%
              </div>
            </div>
            {state.inferenceResults.measurements && (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Measurements</div>
                <div className="text-sm font-medium">
                  {Object.entries(state.inferenceResults.measurements).map(
                    ([key, { value, unit }]) => (
                      <div key={key}>
                        {key}: {value} {unit}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {state.inferenceResults.recommendations && (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Recommendations</div>
                <div className="text-sm font-medium">
                  {state.inferenceResults.recommendations.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 