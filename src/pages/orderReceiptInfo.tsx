import React, { useState, useCallback } from 'react';
import OrderReceiptStatCard from '../component/orderReceipt/OrderReceiptStatCard';
import OrderReceiptTableRow from '../component/orderReceipt/OrderReceiptTableRow';
import OrderReceiptModal from '../component/orderReceipt/OrderReceiptModal';
import { OrderReceiptData } from '../types/orderReceipt';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    padding: '24px'
  },
  content: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  iconContainer: {
    padding: '12px',
    backgroundColor: '#8b5cf6',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '18px',
    margin: 0
  }
} as const;

// 초기 데이터
const INITIAL_DATA: OrderReceiptData[] = [
  {
    id: 1,
    orderId: 'ORDER2024001',
    customerId: 'CUST001',
    customerName: '삼성전자',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    orderQuantity: 1000,
    unitPrice: 15000,
    totalAmount: 15000000,
    orderDate: '2024-01-15',
    deliveryDate: '2024-02-15',
    status: 'confirmed',
    priority: 'high',
    salesPerson: '김영업',
    paymentTerms: '계산서 발행 후 30일',
    shippingAddress: '경기도 수원시 영통구 삼성로 129',
    specialInstructions: '품질 검사 강화 필요',
    notes: 'VIP 고객 주문',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    orderId: 'ORDER2024002',
    customerId: 'CUST002',
    customerName: 'LG전자',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    orderQuantity: 500,
    unitPrice: 80000,
    totalAmount: 40000000,
    orderDate: '2024-01-20',
    deliveryDate: '2024-02-20',
    status: 'in_production',
    priority: 'medium',
    salesPerson: '이영업',
    paymentTerms: '선불',
    shippingAddress: '서울특별시 강남구 테헤란로 152',
    specialInstructions: '음질 테스트 필수',
    notes: '정기 주문',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    orderId: 'ORDER2024003',
    customerId: 'CUST003',
    customerName: '현대자동차',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    orderQuantity: 2000,
    unitPrice: 8000,
    totalAmount: 16000000,
    orderDate: '2024-01-10',
    deliveryDate: '2024-02-10',
    status: 'completed',
    priority: 'low',
    salesPerson: '박영업',
    paymentTerms: '계산서 발행 후 15일',
    shippingAddress: '서울특별시 강남구 테헤란로 231',
    specialInstructions: '색상 일치 확인',
    notes: '기업복 주문',
    createdAt: '2024-01-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 4,
    orderId: 'ORDER2024004',
    customerId: 'CUST004',
    customerName: 'SK하이닉스',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    orderQuantity: 300,
    unitPrice: 25000,
    totalAmount: 7500000,
    orderDate: '2024-01-25',
    deliveryDate: '2024-02-25',
    status: 'pending',
    priority: 'low',
    salesPerson: '최영업',
    paymentTerms: '계산서 발행 후 30일',
    shippingAddress: '경기도 이천시 부발읍 공단로 209',
    specialInstructions: '안정성 테스트 필수',
    notes: '신규 고객',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

const OrderReceiptInfo: React.FC = () => {
  // 상태 관리
  const [orderData, setOrderData] = useState<OrderReceiptData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<OrderReceiptData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = orderData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [orderData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setOrderData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.orderId || !formData.customerName || !formData.productName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as OrderReceiptData;
      setOrderData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...orderData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now
      } as OrderReceiptData;
      setOrderData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, orderData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['orderQuantity', 'unitPrice', 'totalAmount'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalOrders = orderData.length;
  const confirmedOrders = orderData.filter(item => item.status === 'confirmed').length;
  const inProductionOrders = orderData.filter(item => item.status === 'in_production').length;
  const totalAmount = orderData.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>수주 관리</h1>
              <p style={STYLES.subtitle}>고객 주문을 체계적으로 관리하고 추적합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <OrderReceiptStatCard
              title="총 주문 수"
              value={totalOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="#8b5cf6"
              bgColor="#ede9fe"
            />
            
            <OrderReceiptStatCard
              title="확정된 주문"
              value={confirmedOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3b82f6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#3b82f6"
              bgColor="#dbeafe"
            />
            
            <OrderReceiptStatCard
              title="생산중 주문"
              value={inProductionOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <OrderReceiptStatCard
              title="총 주문 금액"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalAmount)}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
          </div>
        </div>

        {/* 메인 테이블 카드 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>수주 목록</h2>
                <p style={{ 
                  color: '#c4b5fd', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 수주를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#8b5cf6',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#faf5ff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>새 수주 추가</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
                }}>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>주문 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>고객 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>제품 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>수량/단가</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>상태</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>우선순위</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>총 금액</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>주문일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>납기일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>결제 조건</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>작업</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {orderData.map((item, index) => (
                  <OrderReceiptTableRow 
                    key={item.id} 
                    item={item} 
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <OrderReceiptModal
        show={showForm}
        editingId={editingId}
        formData={formData}
        onClose={handleCloseForm}
        onSave={handleSave}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default OrderReceiptInfo;
