export interface ProductionPlanData {
  id: number;
  planId: string;
  productCode: string;
  productName: string;
  planQuantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workCenter: string;
  responsiblePerson: string;
  estimatedHours: number;
  actualHours?: number;
  materials: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
