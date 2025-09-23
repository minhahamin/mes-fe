import React, { useState, useCallback } from 'react';
import WarehouseStatCard from '../component/warehouse/WarehouseStatCard';
import WarehouseTableRow from '../component/warehouse/WarehouseTableRow';
import WarehouseModal from '../component/warehouse/WarehouseModal';
import { WarehouseData } from '../types/warehouse';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
    backgroundColor: '#0ea5e9',
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

// 초기 데이터 (발주관리 기반)
const INITIAL_DATA: WarehouseData[] = [
  {
    id: 1,
    warehouseId: 'WH001',
    warehouseName: '본사 창고 A',
    location: '경기도 안양시 동안구',
    capacity: 10000,
    currentStock: 7500,
    utilizationRate: 75,
    manager: '김창고',
    status: 'active',
    temperature: '20°C',
    humidity: '60%',
    securityLevel: 'high',
    lastInspection: '2024-01-15',
    nextInspection: '2024-02-15',
    notes: 'PO2024001 발주 물품 입고 완료 - 스테인리스 강판 100개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    warehouseId: 'WH002',
    warehouseName: '본사 창고 B',
    location: '경기도 안양시 동안구',
    capacity: 8000,
    currentStock: 8000,
    utilizationRate: 100,
    manager: '이창고',
    status: 'full',
    temperature: '18°C',
    humidity: '55%',
    securityLevel: 'high',
    lastInspection: '2024-01-10',
    nextInspection: '2024-02-10',
    notes: 'PO2024002 발주 물품 입고 대기 중 - 반도체 칩 1000개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    warehouseId: 'WH003',
    warehouseName: '부품 창고',
    location: '경기도 안양시 동안구',
    capacity: 5000,
    currentStock: 2500,
    utilizationRate: 50,
    manager: '박창고',
    status: 'active',
    temperature: '22°C',
    humidity: '45%',
    securityLevel: 'medium',
    lastInspection: '2024-01-20',
    nextInspection: '2024-02-20',
    notes: 'PO2024003 발주 물품 입고 완료 - 포장 박스 5000개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-30'
  },
  {
    id: 4,
    warehouseId: 'WH004',
    warehouseName: '화학 창고',
    location: '경기도 안양시 동안구',
    capacity: 3000,
    currentStock: 600,
    utilizationRate: 20,
    manager: '최창고',
    status: 'active',
    temperature: '15°C',
    humidity: '30%',
    securityLevel: 'high',
    lastInspection: '2024-01-25',
    nextInspection: '2024-02-25',
    notes: 'PO2024004 발주 물품 입고 예정 - 접착제 200개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  }
];

const WarehouseInfo: React.FC = () => {
  // 상태 관리
  const [warehouseData, setWarehouseData] = useState<WarehouseData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<WarehouseData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = warehouseData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [warehouseData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setWarehouseData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.warehouseId || !formData.warehouseName || !formData.manager) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as WarehouseData;
      setWarehouseData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...warehouseData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now
      } as WarehouseData;
      setWarehouseData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, warehouseData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['capacity', 'currentStock', 'utilizationRate'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalWarehouses = warehouseData.length;
  const activeWarehouses = warehouseData.filter(item => item.status === 'active').length;
  const fullWarehouses = warehouseData.filter(item => item.status === 'full').length;
  const totalCapacity = warehouseData.reduce((sum, item) => sum + item.capacity, 0);
  const totalStock = warehouseData.reduce((sum, item) => sum + item.currentStock, 0);
  const avgUtilization = warehouseData.length > 0 ? Math.round(warehouseData.reduce((sum, item) => sum + item.utilizationRate, 0) / warehouseData.length) : 0;

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
              <h1 style={STYLES.title}>입고 관리</h1>
              <p style={STYLES.subtitle}>발주관리 기반으로 창고 입고를 체계적으로 관리하고 추적합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <WarehouseStatCard
              title="총 창고 수"
              value={totalWarehouses}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0ea5e9' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              color="#0ea5e9"
              bgColor="#dbeafe"
            />
            
            <WarehouseStatCard
              title="활성 창고"
              value={activeWarehouses}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <WarehouseStatCard
              title="가득찬 창고"
              value={fullWarehouses}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <WarehouseStatCard
              title="평균 사용률"
              value={`${avgUtilization}%`}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
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
                }}>창고 목록</h2>
                <p style={{ 
                  color: '#bae6fd', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 창고를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#0ea5e9',
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
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
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
                <span>새 창고 추가</span>
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
                  }}>창고 정보</th>
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
                  }}>용량/재고</th>
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
                  }}>담당자</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>환경</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>보안</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>점검일</th>
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
                {warehouseData.map((item, index) => (
                  <WarehouseTableRow 
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
      <WarehouseModal
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

export default WarehouseInfo;
