export interface InventoryStatusData {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'sufficient' | 'low' | 'out_of_stock' | 'overstock';
  lastUpdated: string;
  location: string;
  supplier: string;
  unitCost: number;
  totalValue: number;
  lastMovementDate: string;
  movementType: 'in' | 'out' | 'adjustment';
  movementQuantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
