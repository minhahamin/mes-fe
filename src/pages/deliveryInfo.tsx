import React, { useState, useEffect, useCallback } from 'react';
import DeliveryStatCard from '../component/delivery/DeliveryStatCard';
import DeliveryTableRow from '../component/delivery/DeliveryTableRow';
import DeliveryModal from '../component/delivery/DeliveryModal';
import { DeliveryData } from '../types/delivery';
import { getBusinesses, deleteBusiness } from '../api/deliveryApi';

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
    backgroundColor: '#22c55e',
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

// 초기 데이터 (출하관리 기반)
const INITIAL_DATA: DeliveryData[] = [
  {
    id: 1,
    deliveryId: 'DEL001',
    shipmentId: 'SH001',
    customerName: '삼성전자',
    deliveryAddress: '경기도 수원시 영통구 삼성로 129',
    deliveryDate: '2024-01-24',
    expectedTime: '14:00',
    actualTime: '14:30',
    status: 'delivered',
    priority: 'high',
    driver: '김배송',
    vehicle: '대형트럭-001',
    deliveryFee: 50000,
    signature: '김삼성',
    photo: 'delivery_photo_001.jpg',
    customerFeedback: '만족',
    notes: 'SH001 출하 기반 납품 완료 - 스마트폰 케이스 1000개',
    createdAt: '2024-01-24',
    updatedAt: '2024-01-24'
  },
  {
    id: 2,
    deliveryId: 'DEL002',
    shipmentId: 'SH002',
    customerName: 'LG전자',
    deliveryAddress: '서울특별시 강남구 테헤란로 152',
    deliveryDate: '2024-01-30',
    expectedTime: '10:00',
    status: 'scheduled',
    priority: 'normal',
    driver: '이배송',
    vehicle: '중형트럭-002',
    deliveryFee: 30000,
    notes: 'SH002 출하 기반 납품 예정 - 무선 이어폰 500개',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    deliveryId: 'DEL003',
    shipmentId: 'SH003',
    customerName: '현대자동차',
    deliveryAddress: '서울특별시 강남구 테헤란로 231',
    deliveryDate: '2024-01-18',
    expectedTime: '09:00',
    actualTime: '09:15',
    status: 'delivered',
    priority: 'low',
    driver: '박배송',
    vehicle: '소형트럭-003',
    deliveryFee: 25000,
    signature: '박현대',
    photo: 'delivery_photo_003.jpg',
    customerFeedback: '매우 만족',
    notes: 'SH003 출하 기반 납품 완료 - 면 티셔츠 2000개',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 4,
    deliveryId: 'DEL004',
    shipmentId: 'SH004',
    customerName: 'SK하이닉스',
    deliveryAddress: '경기도 이천시 부발읍 공단로 209',
    deliveryDate: '2024-02-05',
    expectedTime: '11:00',
    status: 'scheduled',
    priority: 'low',
    driver: '최배송',
    vehicle: '중형트럭-004',
    deliveryFee: 15000,
    notes: 'SH004 출하 기반 납품 예정 - 노트북 스탠드 300개',
    createdAt: '2024-01-30',
    updatedAt: '2024-01-30'
  }
];

const DeliveryInfo: React.FC = () => {
  // 상태 관리
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DeliveryData>>({});
  const [showForm, setShowForm] = useState(false);

  // 데이터 로드
  const loadDeliveryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        setDeliveryData(response.data);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
        // 에러 시 초기 데이터 사용
        setDeliveryData(INITIAL_DATA);
      }
    } catch (err) {
      console.error('납품 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      // 에러 시 초기 데이터 사용
      setDeliveryData(INITIAL_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadDeliveryData();
  }, [loadDeliveryData]);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = deliveryData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [deliveryData]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        setLoading(true);
        const response = await deleteBusiness(id);
        if (response.success) {
          // 로컬 상태에서도 제거
          setDeliveryData(prev => prev.filter(d => d.id !== id));
          alert('납품 정보가 성공적으로 삭제되었습니다.');
        } else {
          alert('삭제 실패: ' + response.error);
        }
      } catch (error) {
        console.error('납품 정보 삭제 중 오류:', error);
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
    loadDeliveryData();
    handleCloseForm();
  }, [loadDeliveryData, handleCloseForm]);

  // 통계 계산
  const totalDeliveries = deliveryData.length;
  const deliveredDeliveries = deliveryData.filter(item => item.status === 'delivered').length;
  const scheduledDeliveries = deliveryData.filter(item => item.status === 'scheduled').length;
  const totalDeliveryFee = deliveryData.reduce((sum, item) => {
    // deliveryFee가 문자열인 경우 숫자로 변환
    const fee = typeof item.deliveryFee === 'string' ? 
      parseFloat(item.deliveryFee) || 0 : 
      (item.deliveryFee || 0);
    return sum + fee;
  }, 0);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>납품 관리</h1>
              <p style={STYLES.subtitle}>출하관리 기반으로 제품 납품을 체계적으로 관리하고 추적합니다</p>
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
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <DeliveryStatCard
              title="총 납품 수"
              value={totalDeliveries}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
              color="#22c55e"
              bgColor="#dcfce7"
            />
            
            <DeliveryStatCard
              title="납품완료"
              value={deliveredDeliveries}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <DeliveryStatCard
              title="납품예정"
              value={scheduledDeliveries}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <DeliveryStatCard
              title="총 납품비"
              value={isNaN(totalDeliveryFee) ? '0원' : `${totalDeliveryFee.toLocaleString('ko-KR')}원`}
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
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
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
                }}>납품 목록</h2>
                <p style={{ 
                  color: '#bbf7d0', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 납품을 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#22c55e',
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
                <span>새 납품 추가</span>
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
                  }}>납품 정보</th>
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
                  }}>납품 주소</th>
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
                  }}>배송기사</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>차량</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>납품일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>예상 시간</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>납품비</th>
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
                {deliveryData.map((item, index) => (
                  <DeliveryTableRow 
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
      <DeliveryModal
        show={showForm}
        editingId={editingId}
        formData={formData}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default DeliveryInfo;
