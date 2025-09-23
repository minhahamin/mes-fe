import React, { useState, useCallback } from 'react';
import InventoryStatCard from '../component/inventory/InventoryStatCard';
import InventoryTableRow from '../component/inventory/InventoryTableRow';
import InventoryModal from '../component/inventory/InventoryModal';
import { InventoryData } from '../types/inventory';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
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
    backgroundColor: '#059669',
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
const INITIAL_DATA: InventoryData[] = [
  {
    id: 1,
    transactionId: 'TXN2024001',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    transactionType: 'in',
    quantity: 50,
    unitCost: 15000,
    totalCost: 750000,
    transactionDate: '2024-01-15',
    referenceNumber: 'REF2024001',
    location: 'A-01-01',
    reason: '신규 입고',
    operator: '김창고',
    notes: '정상 입고 완료',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    transactionId: 'TXN2024002',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    transactionType: 'out',
    quantity: -25,
    unitCost: 80000,
    totalCost: 2000000,
    transactionDate: '2024-01-16',
    referenceNumber: 'REF2024002',
    location: 'A-01-02',
    reason: '주문 출고',
    operator: '이배송',
    notes: '고객 주문에 따른 출고',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 3,
    transactionId: 'TXN2024003',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    transactionType: 'adjustment',
    quantity: -5,
    unitCost: 8000,
    totalCost: 40000,
    transactionDate: '2024-01-17',
    referenceNumber: 'REF2024003',
    location: 'B-02-01',
    reason: '재고 조정',
    operator: '박관리',
    notes: '불량품 제거',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 4,
    transactionId: 'TXN2024004',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    transactionType: 'transfer',
    quantity: 10,
    unitCost: 25000,
    totalCost: 250000,
    transactionDate: '2024-01-18',
    referenceNumber: 'REF2024004',
    location: 'A-02-01',
    reason: '창고 간 이동',
    operator: '최이동',
    notes: 'A창고에서 B창고로 이동',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  }
];

const InventoryInfo: React.FC = () => {
  // 상태 관리
  const [inventoryData, setInventoryData] = useState<InventoryData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = inventoryData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [inventoryData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setInventoryData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.transactionId || !formData.productCode || !formData.productName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as InventoryData;
      setInventoryData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...inventoryData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now,
        totalCost: (formData.quantity || 0) * (formData.unitCost || 0)
      } as InventoryData;
      setInventoryData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, inventoryData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['quantity', 'unitCost', 'totalCost'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalTransactions = inventoryData.length;
  const inTransactions = inventoryData.filter(item => item.transactionType === 'in').length;
  const outTransactions = inventoryData.filter(item => item.transactionType === 'out').length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>재고 이동 관리</h1>
              <p style={STYLES.subtitle}>재고 입출고 및 이동 내역을 체계적으로 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <InventoryStatCard
              title="총 거래 수"
              value={totalTransactions}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#059669' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              color="#059669"
              bgColor="#d1fae5"
            />
            
            <InventoryStatCard
              title="입고 거래"
              value={inTransactions}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <InventoryStatCard
              title="출고 거래"
              value={outTransactions}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              }
              color="#ef4444"
              bgColor="#fee2e2"
            />
            
            <InventoryStatCard
              title="총 거래 금액"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalValue)}
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
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
                }}>재고 이동 목록</h2>
                <p style={{ 
                  color: '#a7f3d0', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 재고 이동 내역을 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#059669',
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
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
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
                <span>새 이동 추가</span>
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
                  }}>거래 정보</th>
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
                  }}>거래 유형</th>
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
                  }}>총 비용</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>거래일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>위치</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>사유</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>담당자</th>
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
                {inventoryData.map((item, index) => (
                  <InventoryTableRow 
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
      <InventoryModal
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

export default InventoryInfo;
