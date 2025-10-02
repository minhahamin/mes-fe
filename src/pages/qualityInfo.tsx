import React, { useState, useEffect, useCallback } from 'react';
import QualityStatCard from '../component/quality/QualityStatCard';
import QualityTableRow from '../component/quality/QualityTableRow';
import QualityModal from '../component/quality/QualityModal';
import { QualityData } from '../types/quality';
import { getBusinesses, deleteBusiness } from '../api/qualityInfoApi';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
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
    backgroundColor: '#06b6d4',
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
const INITIAL_DATA: QualityData[] = [
  {
    id: 1,
    qualityId: 'Q2024001',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    batchNumber: 'BATCH001',
    inspectionDate: '2024-01-15',
    inspector: '김품질',
    inspectionType: 'final',
    status: 'pass',
    quantityInspected: 100,
    quantityPassed: 98,
    quantityFailed: 2,
    passRate: 98.0,
    defectType: '표면 결함',
    defectDescription: '미세한 스크래치 2개',
    remarks: '전반적으로 양호한 품질',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    qualityId: 'Q2024002',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    batchNumber: 'BATCH002',
    inspectionDate: '2024-01-16',
    inspector: '이검사',
    inspectionType: 'incoming',
    status: 'fail',
    quantityInspected: 50,
    quantityPassed: 35,
    quantityFailed: 15,
    passRate: 70.0,
    defectType: '음질 불량',
    defectDescription: '좌측 이어폰 음질 이상',
    remarks: '공급업체에 반품 요청',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 3,
    qualityId: 'Q2024003',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    batchNumber: 'BATCH003',
    inspectionDate: '2024-01-17',
    inspector: '박품관',
    inspectionType: 'in_process',
    status: 'pending',
    quantityInspected: 200,
    quantityPassed: 0,
    quantityFailed: 0,
    passRate: 0,
    remarks: '검사 진행 중',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 4,
    qualityId: 'Q2024004',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    batchNumber: 'BATCH004',
    inspectionDate: '2024-01-18',
    inspector: '최품질',
    inspectionType: 'outgoing',
    status: 'rework',
    quantityInspected: 30,
    quantityPassed: 25,
    quantityFailed: 5,
    passRate: 83.3,
    defectType: '조립 불량',
    defectDescription: '각도 조절 기능 이상',
    remarks: '재작업 후 재검사 필요',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  }
];

const QualityInfo: React.FC = () => {
  // 상태 관리
  const [qualityData, setQualityData] = useState<QualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<QualityData>>({});
  const [showForm, setShowForm] = useState(false);

  // 데이터 로드
  const loadQualityData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        setQualityData(response.data);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
        // 에러 시 초기 데이터 사용
        setQualityData(INITIAL_DATA);
      }
    } catch (err) {
      console.error('품질검사 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      // 에러 시 초기 데이터 사용
      setQualityData(INITIAL_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadQualityData();
  }, [loadQualityData]);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = qualityData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [qualityData]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        setLoading(true);
        const response = await deleteBusiness(id);
        if (response.success) {
          // 로컬 상태에서도 제거
          setQualityData(prev => prev.filter(d => d.id !== id));
          alert('품질검사 정보가 성공적으로 삭제되었습니다.');
        } else {
          alert('삭제 실패: ' + response.error);
        }
      } catch (error) {
        console.error('품질검사 정보 삭제 중 오류:', error);
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
    loadQualityData();
    handleCloseForm();
  }, [loadQualityData, handleCloseForm]);

  // 통계 계산
  const totalInspections = qualityData.length;
  const passedInspections = qualityData.filter(q => q.status === 'pass').length;
  const failedInspections = qualityData.filter(q => q.status === 'fail').length;
  const averagePassRate = qualityData.length > 0 
    ? qualityData.reduce((sum, q) => {
        const rate = typeof q.passRate === 'string' ? parseFloat(q.passRate) || 0 : q.passRate || 0;
        return sum + rate;
      }, 0) / qualityData.length 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>품질 검사 관리</h1>
              <p style={STYLES.subtitle}>제품 품질 검사 정보를 체계적으로 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <QualityStatCard
              title="총 검사 수"
              value={totalInspections}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#06b6d4' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#06b6d4"
              bgColor="#a5f3fc"
            />
            
            <QualityStatCard
              title="합격 검사"
              value={passedInspections}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <QualityStatCard
              title="불합격 검사"
              value={failedInspections}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              color="#ef4444"
              bgColor="#fee2e2"
            />
            
            <QualityStatCard
              title="평균 합격률"
              value={`${averagePassRate.toFixed(1)}%`}
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
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
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
                }}>품질 검사 목록</h2>
                <p style={{ 
                  color: '#a5f3fc', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 품질 검사 정보를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#06b6d4',
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
                  e.currentTarget.style.backgroundColor = '#f0fdfa';
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
                <span>새 검사 추가</span>
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
                  }}>검사 ID</th>
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
                  }}>검사 유형</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>검사원</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>검사일</th>
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
                  }}>검사 결과</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>불량 유형</th>
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
                {qualityData.map((item, index) => (
                  <QualityTableRow 
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
      <QualityModal
        show={showForm}
        editingId={editingId}
        formData={formData}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default QualityInfo;
