import React, { useState, useEffect, useCallback } from 'react';
import ProductionPlanStatCard from '../component/productionPlan/ProductionPlanStatCard';
import ProductionPlanTableRow from '../component/productionPlan/ProductionPlanTableRow';
import ProductionPlanModal from '../component/productionPlan/ProductionPlanModal';
import { ProductionPlanData } from '../types/productionPlan';
import { getBusinesses, deleteBusiness } from '../api/productionPlanApi';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
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
    backgroundColor: '#3b82f6',
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
const INITIAL_DATA: ProductionPlanData[] = [
  {
    id: 1,
    planId: 'PLAN2024001',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    planQuantity: 1000,
    plannedStartDate: '2024-01-15',
    plannedEndDate: '2024-01-25',
    actualStartDate: '2024-01-15',
    status: 'in_progress',
    priority: 'high',
    workCenter: 'A라인',
    responsiblePerson: '김생산',
    estimatedHours: 40,
    actualHours: 25,
    materials: ['실리콘', '하드케이스', '포장재'],
    notes: '긴급 주문으로 우선 처리',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    planId: 'PLAN2024002',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    planQuantity: 500,
    plannedStartDate: '2024-01-20',
    plannedEndDate: '2024-01-30',
    status: 'planned',
    priority: 'medium',
    workCenter: 'B라인',
    responsiblePerson: '이제조',
    estimatedHours: 60,
    materials: ['이어폰 본체', '충전케이스', '케이블'],
    notes: '품질 검사 강화 필요',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    planId: 'PLAN2024003',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    planQuantity: 2000,
    plannedStartDate: '2024-01-10',
    plannedEndDate: '2024-01-20',
    actualStartDate: '2024-01-10',
    actualEndDate: '2024-01-18',
    status: 'completed',
    priority: 'low',
    workCenter: 'C라인',
    responsiblePerson: '박섬유',
    estimatedHours: 80,
    actualHours: 75,
    materials: ['면 원단', '실', '라벨'],
    notes: '계획보다 2일 빨리 완료',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 4,
    planId: 'PLAN2024004',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    planQuantity: 300,
    plannedStartDate: '2024-01-25',
    plannedEndDate: '2024-02-05',
    status: 'on_hold',
    priority: 'low',
    workCenter: 'D라인',
    responsiblePerson: '최금속',
    estimatedHours: 30,
    materials: ['알루미늄', '나사', '고무패드'],
    notes: '원자재 공급 지연으로 보류',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

const ProductionPlanInfo: React.FC = () => {
  // 상태 관리
  const [productionData, setProductionData] = useState<ProductionPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProductionPlanData>>({});
  const [showForm, setShowForm] = useState(false);

  // 데이터 로드
  const loadProductionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        setProductionData(response.data);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
        // 에러 시 초기 데이터 사용
        setProductionData(INITIAL_DATA);
      }
    } catch (err) {
      console.error('생산계획 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      // 에러 시 초기 데이터 사용
      setProductionData(INITIAL_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadProductionData();
  }, [loadProductionData]);

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

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        setLoading(true);
        const response = await deleteBusiness(id);
        if (response.success) {
          // 로컬 상태에서도 제거
          setProductionData(prev => prev.filter(d => d.id !== id));
          alert('생산계획 정보가 성공적으로 삭제되었습니다.');
        } else {
          alert('삭제 실패: ' + response.error);
        }
      } catch (error) {
        console.error('생산계획 정보 삭제 중 오류:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    // 폼 성공 후 데이터 새로고침
    loadProductionData();
    handleCloseForm();
  }, [loadProductionData, handleCloseForm]);

  // 통계 계산
  const totalPlans = productionData.length;
  const inProgressPlans = productionData.filter(item => item.status === 'in_progress').length;
  const completedPlans = productionData.filter(item => item.status === 'completed').length;
  const totalQuantity = productionData.reduce((sum, item) => sum + item.planQuantity, 0);

  // 로딩 상태
  if (loading) {
    return (
      <div style={STYLES.container}>
        <div style={STYLES.content}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            fontSize: '18px',
            color: '#6b7280'
          }}>
            데이터를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

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
              <h1 style={STYLES.title}>생산계획 등록</h1>
              <p style={STYLES.subtitle}>생산 계획을 체계적으로 수립하고 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ProductionPlanStatCard
              title="총 계획 수"
              value={totalPlans}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3b82f6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              color="#3b82f6"
              bgColor="#dbeafe"
            />
            
            <ProductionPlanStatCard
              title="진행중 계획"
              value={inProgressPlans}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#d97706"
              bgColor="#fef3c7"
            />
            
            <ProductionPlanStatCard
              title="완료된 계획"
              value={completedPlans}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <ProductionPlanStatCard
              title="총 계획 수량"
              value={totalQuantity.toLocaleString()}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
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
                }}>생산계획 목록</h2>
                <p style={{ 
                  color: '#bfdbfe', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 생산계획을 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#3b82f6',
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
                  e.currentTarget.style.backgroundColor = '#eff6ff';
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
                <span>새 계획 추가</span>
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
                  }}>계획 정보</th>
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
                  }}>우선순위</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>계획 시작일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>계획 완료일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>작업센터</th>
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
                  }}>작업시간</th>
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
                  }}>작업</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {productionData.map((item, index) => (
                  <ProductionPlanTableRow 
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
      <ProductionPlanModal
        show={showForm}
        editingId={editingId}
        formData={formData}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ProductionPlanInfo;
