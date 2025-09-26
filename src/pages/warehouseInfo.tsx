import React, { useState, useCallback, useEffect } from 'react';
import WarehouseStatCard from '../component/warehouse/WarehouseStatCard';
import WarehouseTableRow from '../component/warehouse/WarehouseTableRow';
import WarehouseModal from '../component/warehouse/WarehouseModal';
import { WarehouseReceiptData } from '../types/warehouse';
import { getBusinesses, deleteBusiness } from '../api/warehouseApi';

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

// 초기 데이터 (입고관리 기반)
const INITIAL_DATA: WarehouseReceiptData[] = [
  {
    id: 1,
    receiptId: 'REC001',
    orderingId: 'PO2024001',
    warehouseId: 'WH001',
    warehouseName: '본사 창고 A',
    supplierName: 'SSG강판',
    productName: '스테인리스 강판',
    productCode: 'MAT001',
    orderedQuantity: 100,
    receivedQuantity: 100,
    deliveryDate: '2024-01-20',
    receivedDate: '2024-01-20',
    warehouseLocation: '경기도 안양시 동안구 A구역',
    status: 'received',
    manager: '김창고',
    notes: 'SSG강판 PO2024001 발주 물품 입고 완료',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    receiptId: 'REC002',
    orderingId: 'PO2024002',
    warehouseId: 'WH002',
    warehouseName: '본사 창고 B',
    supplierName: '전자부품산업',
    productName: '반도체 칩',
    productCode: 'CHIP001',
    orderedQuantity: 1000,
    receivedQuantity: 800,
    deliveryDate: '2024-01-25',
    receivedDate: '2024-01-25',
    warehouseLocation: '경기도 안양시 동안구 B구역',
    status: 'partial',
    manager: '이창고',
    notes: 'PO2024002 발주 물품 부분 입고 완료 - 반도체 칩 800개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  },
  {
    id: 3,
    receiptId: 'REC003',
    orderingId: 'PO2024003',
    warehouseId: 'WH003',
    warehouseName: '부품 창고',
    supplierName: '포장물류',
    productName: '포장 박스',
    productCode: 'BOX001',
    orderedQuantity: 5000,
    receivedQuantity: 5000,
    deliveryDate: '2024-01-30',
    receivedDate: '2024-01-30',
    warehouseLocation: '경기도 안양시 동안구 C구역',
    status: 'received',
    manager: '박창고',
    notes: 'PO2024003 발주 물품 입고 완료 - 포장 박스 5000개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-30'
  },
  {
    id: 4,
    receiptId: 'REC004',
    orderingId: 'PO2024004',
    warehouseId: 'WH004',
    warehouseName: '화학 창고',
    supplierName: '화학원료',
    productName: '접착제',
    productCode: 'CHEM001',
    orderedQuantity: 200,
    receivedQuantity: 0,
    deliveryDate: '2024-02-05',
    warehouseLocation: '경기도 안양시 동안구 D구역',
    status: 'pending',
    manager: '최창고',
    notes: 'PO2024004 발주 물품 입고 대기 중 - 접착제 200개',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  }
];

const WarehouseInfo: React.FC = () => {
  // 상태 관리
  const [warehouseData, setWarehouseData] = useState<WarehouseReceiptData[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<WarehouseReceiptData>>({});
  const [showForm, setShowForm] = useState(false);

  // 데이터 로드
  const loadWarehouseData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setWarehouseData(response.data);
      } else {
        console.error('입고 정보 조회 실패:', response.error);
        // 로드 실패시 기본 데이터 사용
        setWarehouseData(INITIAL_DATA);
      }
    } catch (error) {
      console.error('입고 정보 조회 중 오류:', error);
      setWarehouseData(INITIAL_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    loadWarehouseData();
  }, [loadWarehouseData]);

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

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        setLoading(true);
        const response = await deleteBusiness(id);
        if (response.success) {
          // 로컬 상태에서도 제거
          setWarehouseData(prev => prev.filter(d => d.id !== id));
          alert('입고 정보가 성공적으로 삭제되었습니다.');
        } else {
          alert('삭제 실패: ' + response.error);
        }
      } catch (error) {
        console.error('입고 정보 삭제 중 오류:', error);
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

  const handleSuccess = useCallback(() => {
    loadWarehouseData(); // 데이터 새로고침
    handleCloseForm();
  }, [loadWarehouseData, handleCloseForm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['orderedQuantity', 'receivedQuantity'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const totalReceipts = warehouseData.length;
  const receivedReceipts = warehouseData.filter(item => item.status === 'received').length;
  const pendingReceipts = warehouseData.filter(item => item.status === 'pending').length;
  const partialReceipts = warehouseData.filter(item => item.status === 'partial').length;
  const totalOrderedQuantity = warehouseData.reduce((sum, item) => sum + item.orderedQuantity, 0);
  const totalReceivedQuantity = warehouseData.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const completionRate = totalOrderedQuantity > 0 ? Math.round((totalReceivedQuantity / totalOrderedQuantity) * 100) : 0;

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
              <p style={STYLES.subtitle}>발주된 물품의 창고 입고를 체계적으로 관리하고 추적합니다</p>
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
              title="총 입고 건수"
              value={totalReceipts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0ea5e9' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 tokens compare-arrows swap-horizontal arrows" />
                </svg>
              }
              color="#0ea5e9"
              bgColor="#dbeafe"
            />
            
            <WarehouseStatCard
              title="입고 완료"
              value={receivedReceipts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <WarehouseStatCard
              title="입고 대기"
              value={pendingReceipts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <WarehouseStatCard
              title="입고 완료률"
              value={`${completionRate}%`}
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
                }}>입고 목록</h2>
                <p style={{ 
                  color: '#bae6fd', 
                  marginTop: '4px',
                  margin: 0
                }}>발주된 물품의 입고 현황을 확인하고 관리하세요</p>
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
                <span>새 입고 등록</span>
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
                  }}>입고 정보</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>발주 정보</th>
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
                  }}>수량/입고량</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>배송일/입고일</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>창고 위치</th>
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
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default WarehouseInfo;
