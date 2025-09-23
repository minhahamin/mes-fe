export interface ProductionStatusData {
  id: number;
  orderId: string;
  productCode: string;
  productName: string;
  workCenter: string;
  operator: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  startTime?: string;
  endTime?: string;
  actualQuantity: number;
  plannedQuantity: number;
  defectQuantity: number;
  qualityRate: number;
  efficiency: number;
  currentStep: string;
  nextStep?: string;
  issues: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
