import React, { useState, useCallback } from 'react';
import InventoryStatusStatCard from '../component/inventoryStatus/InventoryStatusStatCard';
import InventoryStatusTableRow from '../component/inventoryStatus/InventoryStatusTableRow';
import InventoryStatusModal from '../component/inventoryStatus/InventoryStatusModal';
import { InventoryStatusData } from '../types/inventoryStatus';

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
    backgroundColor: '#7c3aed',
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
const INITIAL_DATA: InventoryStatusData[] = [
  {
    id: 1,
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    category: '전자제품',
    currentStock: 150,
    minStock: 20,
    maxStock: 200,
    reorderPoint: 30,
    status: 'sufficient',
    lastUpdated: '2024-01-15',
    location: 'A-01-01',
    supplier: '케이스코리아',
    unitCost: 15000,
    totalValue: 2250000,
    lastMovementDate: '2024-01-15',
    movementType: 'in',
    movementQuantity: 50,
    notes: '정상 재고 상태',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    productCode: 'PROD002',
    productName: '무선 이어폰',
    category: '전자제품',
    currentStock: 5,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    status: 'low',
    lastUpdated: '2024-01-16',
    location: 'A-01-02',
    supplier: '오디오테크',
    unitCost: 80000,
    totalValue: 400000,
    lastMovementDate: '2024-01-16',
    movementType: 'out',
    movementQuantity: -25,
    notes: '재주문 필요',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 3,
    productCode: 'PROD003',
    productName: '면 티셔츠',
    category: '의류',
    currentStock: 0,
    minStock: 15,
    maxStock: 50,
    reorderPoint: 20,
    status: 'out_of_stock',
    lastUpdated: '2024-01-17',
    location: 'B-02-01',
    supplier: '패션월드',
    unitCost: 8000,
    totalValue: 0,
    lastMovementDate: '2024-01-17',
    movementType: 'out',
    movementQuantity: -30,
    notes: '즉시 재주문 필요',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 4,
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    category: '전자제품',
    currentStock: 35,
    minStock: 5,
    maxStock: 30,
    reorderPoint: 8,
    status: 'overstock',
    lastUpdated: '2024-01-18',
    location: 'A-02-01',
    supplier: '데스크솔루션',
    unitCost: 25000,
    totalValue: 875000,
    lastMovementDate: '2024-01-18',
    movementType: 'in',
    movementQuantity: 20,
    notes: '과재고 상태 - 할인 판매 고려',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  }
];

const InventoryStatusInfo: React.FC = () => {
  // 상태 관리
  const [inventoryData, setInventoryData] = useState<InventoryStatusData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryStatusData>>({});
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
    if (!formData.productCode || !formData.productName || !formData.category) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as InventoryStatusData;
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
        totalValue: (formData.currentStock || 0) * (formData.unitCost || 0)
      } as InventoryStatusData;
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
      [name]: ['currentStock', 'minStock', 'maxStock', 'reorderPoint', 'unitCost', 'totalValue', 'movementQuantity'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalProducts = inventoryData.length;
  const lowStockProducts = inventoryData.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockProducts = inventoryData.filter(item => item.currentStock === 0).length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>재고 상태 관리</h1>
              <p style={STYLES.subtitle}>제품 재고 상태를 실시간으로 모니터링합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <InventoryStatusStatCard
              title="총 제품 수"
              value={totalProducts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#7c3aed' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              color="#7c3aed"
              bgColor="#e9d5ff"
            />
            
            <InventoryStatusStatCard
              title="재고부족 제품"
              value={lowStockProducts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              color="#d97706"
              bgColor="#fef3c7"
            />
            
            <InventoryStatusStatCard
              title="재고없음 제품"
              value={outOfStockProducts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              color="#ef4444"
              bgColor="#fee2e2"
            />
            
            <InventoryStatusStatCard
              title="총 재고 가치"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalValue)}
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
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
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
                }}>재고 상태 목록</h2>
                <p style={{ 
                  color: '#c4b5fd', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 제품의 재고 상태를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#7c3aed',
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
                <span>새 재고 추가</span>
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
                  }}>제품 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>카테고리</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>재고 수량</th>
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
                  }}>위치</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>공급업체</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>총 가치</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>마지막 업데이트</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>최근 이동</th>
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
                  <InventoryStatusTableRow 
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
      <InventoryStatusModal
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

export default InventoryStatusInfo;
