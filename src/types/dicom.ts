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

export interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
  [key: string]: any;
}

export interface InferenceResult {
  findings: string[];
  confidence: number;
  measurements?: {
    [key: string]: {
      value: number;
      unit: string;
    };
  };
  recommendations?: string[];
}

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

export interface DicomViewerState {
  previewUrl: string | null;
  metadata: DicomMetadata | null;
  inferenceResults: InferenceResult | null;
  error: string | null;
  loading: boolean;
} 