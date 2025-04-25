import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { dicomService } from '../api/dicomService';

interface InferenceButtonProps {
  fileId: string;
  onInferenceComplete: (result: any) => void;
}

export const InferenceButton: React.FC<InferenceButtonProps> = ({
  fileId,
  onInferenceComplete,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runInference = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // Start inference
      await dicomService.startInference(fileId);
      
      // Poll for status
      const pollStatus = async () => {
        const status = await dicomService.getInferenceStatus(fileId);
        
        if (status.status === 'completed') {
          const results = await dicomService.getInferenceResults(fileId);
          onInferenceComplete(results);
          setIsRunning(false);
        } else if (status.status === 'failed') {
          setError(status.error || 'Inference failed. Please try again.');
          setIsRunning(false);
        } else {
          // Continue polling
          setTimeout(pollStatus, 2000);
        }
      };

      pollStatus();
    } catch (err) {
      console.error('Inference error:', err);
      setError('Failed to run inference. Please try again.');
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={runInference}
        disabled={isRunning}
        className={`flex items-center justify-center px-4 py-2 rounded-lg text-white
          ${isRunning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Run Inference
          </>
        )}
      </button>
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}; 