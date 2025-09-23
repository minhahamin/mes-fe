export interface QualityData {
  id: number;
  qualityId: string;
  productCode: string;
  productName: string;
  batchNumber: string;
  inspectionDate: string;
  inspector: string;
  inspectionType: 'incoming' | 'in_process' | 'final' | 'outgoing';
  status: 'pass' | 'fail' | 'pending' | 'rework';
  defectType?: string;
  defectDescription?: string;
  quantityInspected: number;
  quantityPassed: number;
  quantityFailed: number;
  passRate: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}
