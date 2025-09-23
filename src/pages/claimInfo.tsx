import React, { useState, useCallback } from 'react';
import ClaimStatCard from '../component/claim/ClaimStatCard';
import ClaimTableRow from '../component/claim/ClaimTableRow';
import ClaimModal from '../component/claim/ClaimModal';
import { ClaimData } from '../types/claim';

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
    backgroundColor: '#dc2626',
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
const INITIAL_DATA: ClaimData[] = [
  {
    id: 1,
    claimId: 'CLM2024001',
    customerName: 'ABC 제조업체',
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    orderNumber: 'ORD2024001',
    claimType: 'defect',
    claimDate: '2024-01-15',
    claimDescription: '제품에 미세한 스크래치가 있어 품질에 불만을 제기',
    status: 'resolved',
    priority: 'medium',
    assignedTo: '김고객',
    resolutionDate: '2024-01-18',
    resolutionDescription: '교체 제품 발송 완료',
    compensationAmount: 25000,
    compensationType: 'replacement',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18'
  },
  {
    id: 2,
    claimId: 'CLM2024002',
    customerName: 'XYZ 전자',
    productCode: 'PROD002',
    productName: '무선 이어폰',
    orderNumber: 'ORD2024002',
    claimType: 'damage',
    claimDate: '2024-01-16',
    claimDescription: '배송 중 포장이 손상되어 제품이 휘어짐',
    status: 'investigating',
    priority: 'high',
    assignedTo: '이담당',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 3,
    claimId: 'CLM2024003',
    customerName: '패션월드',
    productCode: 'PROD003',
    productName: '면 티셔츠',
    orderNumber: 'ORD2024003',
    claimType: 'wrong_item',
    claimDate: '2024-01-17',
    claimDescription: '주문한 색상과 다른 색상의 제품이 배송됨',
    status: 'pending',
    priority: 'low',
    assignedTo: '박처리',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 4,
    claimId: 'CLM2024004',
    customerName: '데스크솔루션',
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    orderNumber: 'ORD2024004',
    claimType: 'late_delivery',
    claimDate: '2024-01-18',
    claimDescription: '약속된 배송일보다 3일 지연되어 업무에 차질',
    status: 'rejected',
    priority: 'urgent',
    assignedTo: '최관리',
    resolutionDescription: '배송 지연은 택배사 문제로 확인되어 거부',
    compensationType: 'none',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20'
  }
];

const ClaimInfo: React.FC = () => {
  // 상태 관리
  const [claimData, setClaimData] = useState<ClaimData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ClaimData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = claimData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [claimData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setClaimData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.claimId || !formData.customerName || !formData.productCode) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      const updatedItem = { ...formData, updatedAt: new Date().toISOString().split('T')[0] } as ClaimData;
      setClaimData(prev => prev.map(d => 
        d.id === editingId ? updatedItem : d
      ));
    } else {
      // 추가
      const newId = Math.max(...claimData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem = { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now
      } as ClaimData;
      setClaimData(prev => [...prev, newItem]);
    }
    
    handleCloseForm();
  }, [editingId, formData, claimData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'compensationAmount' ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalClaims = claimData.length;
  const pendingClaims = claimData.filter(c => c.status === 'pending').length;
  const resolvedClaims = claimData.filter(c => c.status === 'resolved').length;
  const urgentClaims = claimData.filter(c => c.priority === 'urgent').length;
  const totalCompensation = claimData
    .filter(c => c.compensationAmount)
    .reduce((sum, c) => sum + (c.compensationAmount || 0), 0);

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>클레임 관리</h1>
              <p style={STYLES.subtitle}>고객 클레임을 체계적으로 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ClaimStatCard
              title="총 클레임 수"
              value={totalClaims}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#dc2626' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              color="#dc2626"
              bgColor="#fecaca"
            />
            
            <ClaimStatCard
              title="대기 중 클레임"
              value={pendingClaims}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#d97706"
              bgColor="#fef3c7"
            />
            
            <ClaimStatCard
              title="해결된 클레임"
              value={resolvedClaims}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <ClaimStatCard
              title="총 보상 금액"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalCompensation)}
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
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
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
                }}>클레임 목록</h2>
                <p style={{ 
                  color: '#fecaca', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 클레임 정보를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#dc2626',
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
                <span>새 클레임 추가</span>
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
                  }}>클레임 ID</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>고객/제품</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>클레임 유형</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>클레임일</th>
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
                  }}>담당자</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>클레임 내용</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>보상 금액</th>
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
                {claimData.map((item, index) => (
                  <ClaimTableRow 
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
      <ClaimModal
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

export default ClaimInfo;
