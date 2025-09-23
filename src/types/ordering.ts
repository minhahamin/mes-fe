export interface OrderingData {
  id: number;
  orderId: string;
  supplierId: string;
  supplierName: string;
  productCode: string;
  productName: string;
  orderQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'pending' | 'approved' | 'ordered' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  purchaser: string;
  paymentTerms: string;
  deliveryAddress: string;
  specialRequirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
