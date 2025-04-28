import axios from './axiosConfig';

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
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/dicom/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error: any) {
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
      const response = await axios.get('/dicom/files');
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`/dicom/files/${fileId}`);
      return response.data;
    } catch (error: any) {
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
      await axios.delete(`/dicom/files/${fileId}`);
    } catch (error: any) {
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
      const response = await axios.post(`/dicom/inference/${fileId}`);
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`/dicom/inference/status/${fileId}`);
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`/dicom/files/${fileId}/ai-results`);
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`/dicom/files/${fileId}/metadata`);
      return response.data;
    } catch (error: any) {
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
      const response = await axios.get(`/dicom/files/${fileId}`);
      const file = response.data;
      return file.cloudinarySecureUrl;
    } catch (error: any) {
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
      await axios.post(`/dicom/inference/${fileId}`);
    } catch (error: any) {
      throw new DicomServiceError(
        error.response?.data?.message || 'Failed to run inference',
        error.response?.status,
        error.response?.data?.code
      );
    }
  },
}; 