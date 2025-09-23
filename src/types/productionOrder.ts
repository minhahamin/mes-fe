export interface ProductionOrderData {
  id: number;
  orderId: string;
  planId: string;
  productCode: string;
  productName: string;
  orderQuantity: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workCenter: string;
  supervisor: string;
  operator: string;
  estimatedHours: number;
  actualHours?: number;
  qualityStandard: string;
  materials: string[];
  instructions: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
