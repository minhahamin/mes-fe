import React, { useState, useCallback } from 'react';
import ShipmentStatCard from '../component/shipment/ShipmentStatCard';
import ShipmentTableRow from '../component/shipment/ShipmentTableRow';
import ShipmentModal from '../component/shipment/ShipmentModal';
import { ShipmentData } from '../types/shipment';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
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
    backgroundColor: '#ef4444',
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

// 초기 데이터 (수주관리 기반)
const INITIAL_DATA: ShipmentData[] = [
  {
    id: 1,
    shipmentId: 'SH001',
    orderId: 'ORDER2024001',
    customerName: '삼성전자',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    quantity: 1000,
    shipmentDate: '2024-01-20',
    expectedDeliveryDate: '2024-01-25',
    actualDeliveryDate: '2024-01-24',
    status: 'delivered',
    priority: 'high',
    carrier: 'CJ대한통운',
    trackingNumber: '1234567890',
    shippingAddress: '경기도 수원시 영통구 삼성로 129',
    shippingCost: 50000,
    responsiblePerson: '김출하',
    notes: 'ORDER2024001 수주 기반 출하 완료 - 스마트폰 케이스 1000개',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-24'
  },
  {
    id: 2,
    shipmentId: 'SH002',
    orderId: 'ORDER2024002',
    customerName: 'LG전자',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    quantity: 500,
    shipmentDate: '2024-01-25',
    expectedDeliveryDate: '2024-01-30',
    status: 'in_transit',
    priority: 'medium',
    carrier: '한진택배',
    trackingNumber: '0987654321',
    shippingAddress: '서울특별시 강남구 테헤란로 152',
    shippingCost: 30000,
    responsiblePerson: '이출하',
    notes: 'ORDER2024002 수주 기반 출하 진행중 - 무선 이어폰 500개',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    shipmentId: 'SH003',
    orderId: 'ORDER2024003',
    customerName: '현대자동차',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    quantity: 2000,
    shipmentDate: '2024-01-15',
    expectedDeliveryDate: '2024-01-20',
    actualDeliveryDate: '2024-01-18',
    status: 'delivered',
    priority: 'low',
    carrier: '로젠택배',
    trackingNumber: '1122334455',
    shippingAddress: '서울특별시 강남구 테헤란로 231',
    shippingCost: 25000,
    responsiblePerson: '박출하',
    notes: 'ORDER2024003 수주 기반 출하 완료 - 면 티셔츠 2000개',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18'
  },
  {
    id: 4,
    shipmentId: 'SH004',
    orderId: 'ORDER2024004',
    customerName: 'SK하이닉스',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    quantity: 300,
    shipmentDate: '2024-01-30',
    expectedDeliveryDate: '2024-02-05',
    status: 'preparing',
    priority: 'low',
    carrier: 'CJ대한통운',
    trackingNumber: '5566778899',
    shippingAddress: '경기도 이천시 부발읍 공단로 209',
    shippingCost: 15000,
    responsiblePerson: '최출하',
    notes: 'ORDER2024004 수주 기반 출하 준비중 - 노트북 스탠드 300개',
    createdAt: '2024-01-30',
    updatedAt: '2024-01-30'
  }
];

const ShipmentInfo: React.FC = () => {
  // 상태 관리
  const [shipmentData, setShipmentData] = useState<ShipmentData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ShipmentData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = shipmentData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [shipmentData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setShipmentData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.shipmentId || !formData.customerName || !formData.productName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as ShipmentData;
      setShipmentData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...shipmentData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now
      } as ShipmentData;
      setShipmentData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, shipmentData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['quantity', 'shippingCost'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalShipments = shipmentData.length;
  const deliveredShipments = shipmentData.filter(item => item.status === 'delivered').length;
  const inTransitShipments = shipmentData.filter(item => item.status === 'in_transit').length;
  const totalShippingCost = shipmentData.reduce((sum, item) => sum + item.shippingCost, 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>출하 관리</h1>
              <p style={STYLES.subtitle}>수주관리 기반으로 제품 출하를 체계적으로 관리하고 추적합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ShipmentStatCard
              title="총 출하 수"
              value={totalShipments}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
              }
              color="#ef4444"
              bgColor="#fee2e2"
            />
            
            <ShipmentStatCard
              title="배송완료"
              value={deliveredShipments}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <ShipmentStatCard
              title="배송중"
              value={inTransitShipments}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <ShipmentStatCard
              title="총 배송비"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalShippingCost)}
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
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
                }}>출하 목록</h2>
                <p style={{ 
                  color: '#fecaca', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 출하를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#ef4444',
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
                  e.currentTarget.style.backgroundColor = '#fef2f2';
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
                <span>새 출하 추가</span>
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
                  }}>출하 정보</th>
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
                  }}>수량</th>
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
                  }}>운송사</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>출하일</th>
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
                  }}>배송비</th>
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
                {shipmentData.map((item, index) => (
                  <ShipmentTableRow 
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
      <ShipmentModal
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

export default ShipmentInfo;
