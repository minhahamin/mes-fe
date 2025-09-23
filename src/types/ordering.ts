export interface OrderingData {
  id: number;
  orderId: string; // 발주 ID
  supplierName: string; // 공급업체명
  productName: string; // 제품명
  productCode: string; // 제품 코드
  quantity: number; // 발주 수량
  unitPrice: number; // 단가
  totalAmount: number; // 총 금액
  orderDate: string; // 발주 일자
  expectedDeliveryDate: string; // 예상 납기일
  actualDeliveryDate?: string; // 실제 납기일
  status: '대기' | '발주됨' | '부분입고' | '입고완료' | '취소'; // 발주 상태
  priority: '낮음' | '보통' | '높음' | '긴급'; // 우선순위
  purchasePerson: string; // 구매 담당자
  paymentStatus: '미결제' | '부분결제' | '완료'; // 결제 상태
  notes?: string; // 비고
}
