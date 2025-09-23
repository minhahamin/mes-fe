export interface InventoryData {
  id: number;
  transactionId: string;
  productCode: string;
  productName: string;
  transactionType: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  unitCost: number;
  totalCost: number;
  transactionDate: string;
  referenceNumber: string;
  location: string;
  reason: string;
  operator: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
