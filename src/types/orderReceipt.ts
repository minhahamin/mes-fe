export interface OrderReceiptData {
  id: number;
  orderId: string;
  customerId: string;
  customerName: string;
  productCode: string;
  productName: string;
  orderQuantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  salesPerson: string;
  paymentTerms: string;
  shippingAddress: string;
  specialInstructions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
