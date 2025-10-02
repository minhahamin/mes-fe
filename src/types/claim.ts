export interface ClaimData {
  id: number;
  claimId: string;
  customerName: string;
  productCode: string;
  productName: string;
  orderNumber: string;
  claimType: 'defect' | 'delivery_delay' | 'wrong_product' | 'damaged' | 'missing_parts' | 'other';
  claimDate: string;
  claimDescription: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  resolutionDate?: string;
  resolutionDescription?: string;
  compensationAmount?: number;
  compensationType?: 'refund' | 'replacement' | 'discount' | 'none';
  createdAt: string;
  updatedAt: string;
}
