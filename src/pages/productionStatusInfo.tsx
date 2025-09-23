import React, { useState, useCallback } from 'react';
import ProductionStatusStatCard from '../component/productionStatus/ProductionStatusStatCard';
import ProductionStatusTableRow from '../component/productionStatus/ProductionStatusTableRow';
import ProductionStatusModal from '../component/productionStatus/ProductionStatusModal';
import { ProductionStatusData } from '../types/productionStatus';

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
    backgroundColor: '#10b981',
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
const INITIAL_DATA: ProductionStatusData[] = [
  {
    id: 1,
    orderId: 'ORDER2024001',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    workCenter: 'A라인',
    operator: '김작업',
    status: 'in_progress',
    progress: 75,
    startTime: '2024-01-15T09:00:00',
    actualQuantity: 750,
    plannedQuantity: 1000,
    defectQuantity: 15,
    qualityRate: 98,
    efficiency: 85,
    currentStep: '조립',
    nextStep: '품질검사',
    issues: ['원자재 지연'],
    notes: '정상 진행 중',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    orderId: 'ORDER2024002',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    workCenter: 'B라인',
    operator: '이작업',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-10T08:00:00',
    endTime: '2024-01-18T17:00:00',
    actualQuantity: 500,
    plannedQuantity: 500,
    defectQuantity: 5,
    qualityRate: 99,
    efficiency: 92,
    currentStep: '완료',
    issues: [],
    notes: '계획대로 완료',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    orderId: 'ORDER2024003',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    workCenter: 'C라인',
    operator: '박작업',
    status: 'paused',
    progress: 45,
    startTime: '2024-01-12T10:00:00',
    actualQuantity: 900,
    plannedQuantity: 2000,
    defectQuantity: 20,
    qualityRate: 97,
    efficiency: 78,
    currentStep: '재봉',
    nextStep: '세탁',
    issues: ['기계 고장', '원자재 부족'],
    notes: '기계 수리 대기 중',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: 4,
    orderId: 'ORDER2024004',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    workCenter: 'D라인',
    operator: '최작업',
    status: 'not_started',
    progress: 0,
    actualQuantity: 0,
    plannedQuantity: 300,
    defectQuantity: 0,
    qualityRate: 0,
    efficiency: 0,
    currentStep: '대기',
    nextStep: '가공',
    issues: [],
    notes: '원자재 공급 대기',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

const ProductionStatusInfo: React.FC = () => {
  // 상태 관리
  const [productionData, setProductionData] = useState<ProductionStatusData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProductionStatusData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = productionData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [productionData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setProductionData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.orderId || !formData.productCode || !formData.productName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as ProductionStatusData;
      setProductionData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...productionData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now,
        issues: formData.issues || []
      } as ProductionStatusData;
      setProductionData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, productionData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['progress', 'actualQuantity', 'plannedQuantity', 'defectQuantity', 'qualityRate', 'efficiency'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalOrders = productionData.length;
  const inProgressOrders = productionData.filter(item => item.status === 'in_progress').length;
  const completedOrders = productionData.filter(item => item.status === 'completed').length;
  const averageEfficiency = productionData.length > 0 
    ? Math.round(productionData.reduce((sum, item) => sum + item.efficiency, 0) / productionData.length)
    : 0;

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>생산현황 관리</h1>
              <p style={STYLES.subtitle}>실시간 생산 현황을 모니터링하고 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ProductionStatusStatCard
              title="총 작업 수"
              value={totalOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <ProductionStatusStatCard
              title="진행중 작업"
              value={inProgressOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3b82f6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#3b82f6"
              bgColor="#dbeafe"
            />
            
            <ProductionStatusStatCard
              title="완료된 작업"
              value={completedOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#059669' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="#059669"
              bgColor="#d1fae5"
            />
            
            <ProductionStatusStatCard
              title="평균 효율"
              value={`${averageEfficiency}%`}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
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
                }}>생산현황 목록</h2>
                <p style={{ 
                  color: '#a7f3d0', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 생산현황을 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#10b981',
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
                <span>새 현황 추가</span>
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
                  }}>작업 정보</th>
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
                  }}>상태</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>진행률</th>
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
                  }}>품질/효율</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>작업자</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>현재 단계</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>시작 시간</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>완료 시간</th>
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
                {productionData.map((item, index) => (
                  <ProductionStatusTableRow 
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
      <ProductionStatusModal
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

export default ProductionStatusInfo;
