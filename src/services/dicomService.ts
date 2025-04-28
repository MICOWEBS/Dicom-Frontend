import axios, { AxiosProgressEvent } from 'axios';
import api from '../api/axios';

interface DicomFile {
  id: string;
  filename: string;
  // Add other properties as needed
}

class DicomServiceError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = 'DicomServiceError';
  }
}

export const uploadDicomFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<DicomFile> => {
  try {
    console.log('Starting DICOM file upload:', {
      filename: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<DicomFile>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent as AxiosProgressEvent;
        if (onProgress && total) {
          const progress = Math.round((loaded * 100) / total);
          onProgress(progress);
        }
      },
    });

    console.log('DICOM file upload successful:', {
      fileId: response.data.id,
      filename: response.data.filename,
    });

    return response.data;
  } catch (error) {
    console.error('DICOM file upload failed:', {
      filename: file.name,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new DicomServiceError(
      'Failed to upload DICOM file',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
