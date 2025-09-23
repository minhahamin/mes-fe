export interface WarehouseData {
  id: number;
  warehouseId: string;
  warehouseName: string;
  location: string;
  capacity: number;
  currentStock: number;
  utilizationRate: number;
  manager: string;
  status: 'active' | 'maintenance' | 'inactive' | 'full';
  temperature?: string;
  humidity?: string;
  securityLevel: 'low' | 'medium' | 'high';
  lastInspection: string;
  nextInspection: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
