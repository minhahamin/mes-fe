import React, { useState, useCallback } from 'react';
import OrderingStatCard from '../component/ordering/OrderingStatCard';
import OrderingTableRow from '../component/ordering/OrderingTableRow';
import OrderingModal from '../component/ordering/OrderingModal';
import { OrderingData } from '../types/ordering';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
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
    backgroundColor: '#f59e0b',
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
const INITIAL_DATA: OrderingData[] = [
  {
    id: 1,
    orderId: 'PO2024001',
    supplierId: 'SUP001',
    supplierName: 'ABC 원자재',
    productCode: 'MAT001',
    productName: '스테인리스 강판',
    orderQuantity: 100,
    unitPrice: 50000,
    totalAmount: 5000000,
    orderDate: '2024-01-15',
    expectedDeliveryDate: '2024-02-15',
    actualDeliveryDate: '2024-02-10',
    status: 'delivered',
    priority: 'high',
    purchaser: '김구매',
    paymentTerms: '계산서 발행 후 30일',
    deliveryAddress: '경기도 안양시 동안구 시민대로 123',
    specialRequirements: 'ISO 인증 제품만',
    notes: '긴급 주문',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-10'
  },
  {
    id: 2,
    orderId: 'PO2024002',
    supplierId: 'SUP002',
    supplierName: 'XYZ 전자부품',
    productCode: 'MAT002',
    productName: '반도체 칩',
    orderQuantity: 1000,
    unitPrice: 2000,
    totalAmount: 2000000,
    orderDate: '2024-01-20',
    expectedDeliveryDate: '2024-02-20',
    status: 'ordered',
    priority: 'medium',
    purchaser: '이구매',
    paymentTerms: '선불',
    deliveryAddress: '경기도 안양시 동안구 시민대로 123',
    specialRequirements: '품질 보증서 필수',
    notes: '정기 주문',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    orderId: 'PO2024003',
    supplierId: 'SUP003',
    supplierName: 'DEF 포장재',
    productCode: 'MAT003',
    productName: '포장 박스',
    orderQuantity: 5000,
    unitPrice: 500,
    totalAmount: 2500000,
    orderDate: '2024-01-10',
    expectedDeliveryDate: '2024-02-10',
    actualDeliveryDate: '2024-02-08',
    status: 'delivered',
    priority: 'low',
    purchaser: '박구매',
    paymentTerms: '계산서 발행 후 15일',
    deliveryAddress: '경기도 안양시 동안구 시민대로 123',
    specialRequirements: '친환경 재질',
    notes: '기업복 주문',
    createdAt: '2024-01-10',
    updatedAt: '2024-02-08'
  },
  {
    id: 4,
    orderId: 'PO2024004',
    supplierId: 'SUP004',
    supplierName: 'GHI 화학',
    productCode: 'MAT004',
    productName: '접착제',
    orderQuantity: 200,
    unitPrice: 15000,
    totalAmount: 3000000,
    orderDate: '2024-01-25',
    expectedDeliveryDate: '2024-02-25',
    status: 'pending',
    priority: 'low',
    purchaser: '최구매',
    paymentTerms: '계산서 발행 후 30일',
    deliveryAddress: '경기도 안양시 동안구 시민대로 123',
    specialRequirements: 'MSDS 제공 필수',
    notes: '신규 공급업체',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

const OrderingInfo: React.FC = () => {
  // 상태 관리
  const [orderingData, setOrderingData] = useState<OrderingData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<OrderingData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = orderingData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [orderingData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setOrderingData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.orderId || !formData.supplierName || !formData.productName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as OrderingData;
      setOrderingData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...orderingData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now
      } as OrderingData;
      setOrderingData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, orderingData]);

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
  const totalOrders = orderingData.length;
  const orderedOrders = orderingData.filter(item => item.status === 'ordered').length;
  const deliveredOrders = orderingData.filter(item => item.status === 'delivered').length;
  const totalAmount = orderingData.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>발주 관리</h1>
              <p style={STYLES.subtitle}>공급업체 발주를 체계적으로 관리하고 추적합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <OrderingStatCard
              title="총 발주 수"
              value={totalOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <OrderingStatCard
              title="발주된 주문"
              value={orderedOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3b82f6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#3b82f6"
              bgColor="#dbeafe"
            />
            
            <OrderingStatCard
              title="납품된 주문"
              value={deliveredOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <OrderingStatCard
              title="총 발주 금액"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalAmount)}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="#8b5cf6"
              bgColor="#ede9fe"
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
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
                }}>발주 목록</h2>
                <p style={{ 
                  color: '#fed7aa', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 발주를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#f59e0b',
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
                  e.currentTarget.style.backgroundColor = '#fffbeb';
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
                <span>새 발주 추가</span>
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
                  }}>발주 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>공급업체 정보</th>
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
                  }}>발주일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>예상 납기일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>실제 납기일</th>
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
                {orderingData.map((item, index) => (
                  <OrderingTableRow 
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
      <OrderingModal
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

export default OrderingInfo;
