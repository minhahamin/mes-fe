import React, { useState, useEffect, useCallback } from 'react';
import ProductionStatusStatCard from '../component/productionStatus/ProductionStatusStatCard';
import ProductionStatusTableRow from '../component/productionStatus/ProductionStatusTableRow';
import { ProductionStatusData } from '../types/productionStatus';
import { getBusinesses } from '../api/productionStatusApi';

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
  const [productionData, setProductionData] = useState<ProductionStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  const loadProductionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        // API 데이터를 ProductionStatusData 형식으로 변환
        const statusData = response.data.map((plan: any) => {
          // 진행률 계산: (총지시수량 / 계획수량) * 100
          const achievementRate = plan.planQuantity > 0 
            ? Math.round((plan.totalOrderQuantity / plan.planQuantity) * 100) 
            : 0;
          
          // 효율성 계산: (예상시간 / 실제시간) * 100
          const actualHrs = parseFloat(plan.actualHours || '0');
          const estimatedHrs = parseFloat(plan.estimatedHours || '0');
          const efficiency = actualHrs > 0 && estimatedHrs > 0
            ? Math.round((estimatedHrs / actualHrs) * 100)
            : 0;
          
          // 품질률 계산: ((총지시수량 - 잔여수량) / 총지시수량) * 100
          // 음수 방지: Math.max(0, ...)
          const qualityRate = plan.totalOrderQuantity > 0
            ? Math.max(0, Math.round(((plan.totalOrderQuantity - plan.remainingQuantity) / plan.totalOrderQuantity) * 100))
            : 0;

          return {
            id: plan.planId,
            orderId: plan.planId,
            productCode: plan.productCode,
            productName: plan.productName,
            workCenter: plan.workCenter || '-',
            operator: plan.responsiblePerson || '-',
            status: plan.status,
            progress: achievementRate,
            startTime: plan.actualStartDate || plan.plannedStartDate,
            endTime: plan.actualEndDate || plan.plannedEndDate,
            actualQuantity: plan.totalOrderQuantity || 0,  // 총 지시 수량
            plannedQuantity: plan.planQuantity || 0,        // 계획 수량
            defectQuantity: 0,  // 불량은 0으로 (실제 불량 데이터가 있다면 사용)
            qualityRate: qualityRate,
            efficiency: efficiency,
            currentStep: plan.status === 'completed' ? '완료' :
                        plan.status === 'in_progress' ? '진행중' : '대기',
            nextStep: plan.status === 'completed' ? '-' : '다음 단계',
            issues: [],
            notes: `총 지시: ${plan.workOrderCount}, 진행중: ${plan.inProgressOrderCount}, 완료: ${plan.completedOrderCount}, 잔여: ${plan.remainingQuantity}`,
            createdAt: plan.plannedStartDate,
            updatedAt: plan.actualEndDate || plan.plannedEndDate
          };
        });
        setProductionData(statusData);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
        // 에러 시 초기 데이터 사용
        setProductionData(INITIAL_DATA);
      }
    } catch (err) {
      console.error('생산현황 데이터 로드 실패:', err);
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

  // 통계 계산
  const totalOrders = productionData.length;
  const inProgressOrders = productionData.filter(item => item.status === 'in_progress').length;
  const completedOrders = productionData.filter(item => item.status === 'completed').length;
  const averageEfficiency = productionData.length > 0 
    ? Math.round(productionData.reduce((sum, item) => sum + item.efficiency, 0) / productionData.length)
    : 0;

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
                }}>실시간 생산 현황을 모니터링하세요</p>
                {error && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>
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
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {productionData.map((item, index) => (
                  <ProductionStatusTableRow 
                    key={item.id} 
                    item={item} 
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStatusInfo;
