export interface DicomFile {
  id: string;
  filename: string;
  uploadDate: string;
  size: number;
  status: string;
}

export interface DicomMetadata {
  patientName: string;
  patientId: string;
  studyDate: string;
  studyTime: string;
  modality: string;
  studyDescription: string;
  seriesDescription: string;
  institutionName: string;
  manufacturer: string;
  modelName: string;
  sliceThickness: number;
  pixelSpacing: [number, number];
  rows: number;
  columns: number;
  bitsAllocated: number;
  bitsStored: number;
  highBit: number;
  pixelRepresentation: number;
  samplesPerPixel: number;
  photometricInterpretation: string;
  windowCenter: number;
  windowWidth: number;
  rescaleIntercept: number;
  rescaleSlope: number;
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
  status: 'processing' | 'completed' | 'failed';
  result?: InferenceResult;
  error?: string;
}

export interface DicomViewerState {
  previewUrl: string | null;
  metadata: DicomMetadata | null;
  inferenceResults: InferenceResult | null;
  error: string | null;
  loading: boolean;
} 