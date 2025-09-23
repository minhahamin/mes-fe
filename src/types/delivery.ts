export interface DeliveryData {
  id: number;
  deliveryId: string;
  shipmentId: string;
  customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
  expectedTime: string;
  actualTime?: string;
  status: 'scheduled' | 'in_progress' | 'delivered' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  driver: string;
  vehicle: string;
  deliveryFee: number;
  signature?: string;
  photo?: string;
  customerFeedback?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
