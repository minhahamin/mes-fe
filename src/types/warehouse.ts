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

export interface WarehouseReceiptData {
  id: number;
  receiptId: string;
  orderingId: string;
  warehouseId: string;
  warehouseName: string;
  supplierId?: string;
  supplierName: string;
  productName: string;
  productCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  deliveryDate: string;
  receivedDate?: string;
  warehouseLocation: string;
  status: 'pending' | 'partial' | 'received' | 'rejected';
  manager: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}