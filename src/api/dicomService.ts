import api from './axios';
import { AxiosProgressEvent } from 'axios';

export interface UploadResponse {
  fileId: string;
  message: string;
}

export interface InferenceStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  results?: any[];
  error?: string;
}

export interface DicomFile {
  id: string;
  filename: string;
  cloudinaryPublicId: string;
  cloudinarySecureUrl: string;
  metadata: {
    patientId?: string;
    studyDate?: string;
    modality?: string;
    [key: string]: any;
  };
  aiResults: {
    predictions?: any[];
    annotations?: any[];
    [key: string]: any;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class DicomServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'DicomServiceError';
  }
}

export const dicomService = {
  // Upload a DICOM file
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    try {
      console.log('Starting file upload...');
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/dicom/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      console.log('File upload successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('File upload failed:', error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to upload file',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get list of uploaded DICOM files
  getFiles: async (): Promise<DicomFile[]> => {
    try {
      console.log('Fetching files...');
      const response = await api.get('/api/dicom/files');
      console.log('Files fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch files:', error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to fetch files',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get a specific DICOM file
  getFile: async (fileId: string): Promise<DicomFile> => {
    try {
      console.log(`Fetching file ${fileId}...`);
      const response = await api.get(`/api/dicom/files/${fileId}`);
      console.log('File fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to fetch file',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Delete a DICOM file
  deleteFile: async (fileId: string): Promise<void> => {
    try {
      console.log(`Deleting file ${fileId}...`);
      await api.delete(`/api/dicom/files/${fileId}`);
      console.log('File deleted successfully');
    } catch (error: any) {
      console.error(`Failed to delete file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to delete file',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Start inference on a DICOM file
  startInference: async (fileId: string): Promise<{ fileId: string }> => {
    try {
      console.log(`Starting inference for file ${fileId}...`);
      const response = await api.post(`/api/dicom/inference/${fileId}`);
      console.log('Inference started successfully');
      return response.data;
    } catch (error: any) {
      console.error(`Failed to start inference for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to start inference',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get inference status
  getInferenceStatus: async (fileId: string): Promise<InferenceStatus> => {
    try {
      console.log(`Getting inference status for file ${fileId}...`);
      const response = await api.get(`/api/dicom/inference/status/${fileId}`);
      console.log('Inference status fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error(`Failed to get inference status for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to get inference status',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get inference results
  getInferenceResults: async (fileId: string): Promise<any> => {
    try {
      console.log(`Getting inference results for file ${fileId}...`);
      const response = await api.get(`/api/dicom/files/${fileId}/ai-results`);
      console.log('Inference results fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error(`Failed to get inference results for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to get inference results',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get DICOM metadata
  getMetadata: async (fileId: string): Promise<any> => {
    try {
      console.log(`Getting metadata for file ${fileId}...`);
      const response = await api.get(`/api/dicom/files/${fileId}/metadata`);
      console.log('Metadata fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error(`Failed to get metadata for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to get metadata',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Get DICOM image preview
  getPreview: async (fileId: string): Promise<string> => {
    try {
      console.log(`Getting preview for file ${fileId}...`);
      const response = await api.get(`/api/dicom/files/${fileId}`);
      const file = response.data;
      console.log('Preview fetched successfully');
      return file.cloudinarySecureUrl;
    } catch (error: any) {
      console.error(`Failed to get preview for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to get preview',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },

  // Run inference on a DICOM file
  runInference: async (fileId: string): Promise<void> => {
    try {
      console.log(`Running inference for file ${fileId}...`);
      await api.post(`/api/dicom/inference/${fileId}`);
      console.log('Inference completed successfully');
    } catch (error: any) {
      console.error(`Failed to run inference for file ${fileId}:`, error);
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to run inference',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },
}; 