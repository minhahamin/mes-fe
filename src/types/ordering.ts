export interface OrderingData {
  id: number;
  orderId: string; // 발주 ID
  supplierId: string; // 공급업체 ID
  supplierName: string; // 공급업체명
  productCode: string; // 제품 코드
  productName: string; // 제품명
  orderQuantity: number; // 발주 수량
  unitPrice: number; // 단가
  orderDate: string; // 발주 일자
  expectedDeliveryDate: string; // 예상 납기일
  actualDeliveryDate?: string; // 실제 납기일
  status: 'pending' | 'ordered' | 'in_transit' | 'delivered' | 'cancelled'; // 발주 상태
  priority: 'low' | 'medium' | 'high' | 'urgent'; // 우선순위
  purchaser: string; // 구매 담당자
  paymentTerms: string; // 결제 조건
  deliveryAddress: string; // 납품 주소
  specialRequirements?: string; // 특별 요구사항
  notes?: string; // 비고
}
