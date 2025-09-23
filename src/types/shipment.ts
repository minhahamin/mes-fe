export interface ShipmentData {
  id: number;
  shipmentId: string;
  orderId: string;
  customerName: string;
  productCode: string;
  productName: string;
  quantity: number;
  shipmentDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  carrier: string;
  trackingNumber?: string;
  shippingAddress: string;
  shippingCost: number;
  responsiblePerson: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
