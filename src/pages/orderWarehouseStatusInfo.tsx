import React, { useState, useEffect, useCallback } from 'react';
import OrderWarehouseStatusStatCard from '../component/orderWarehouseStatus/OrderWarehouseStatusStatCard';
import { getBusinesses } from '../api/orderWarehouseApi';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '32px'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    margin: 0
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '32px',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  th: {
    padding: '16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
} as const;


    

    
    

const OrderWarehouseStatusInfo: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 데이터 로드
  const loadStatusData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBusinesses();
      
      if (response.success && response.data) {
        setStatusData(response.data);
      } else {
        setError(response.error || '데이터를 불러오는데 실패했습니다.');
        setStatusData([]);
      }
    } catch (err) {
      console.error('발주입고 현황 데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setStatusData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatusData();
  }, [loadStatusData]);

  // 기간 및 검색 필터링
  const filteredData = statusData.filter(item => {
    // 기간 필터링
    const orderDate = new Date(item.purchase?.orderDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let periodMatch = true;
    if (selectedPeriod === 'all') {
      periodMatch = true;
    } else if (selectedPeriod === 'week' && diffDays > 7) {
      periodMatch = false;
    } else if (selectedPeriod === 'month' && diffDays > 30) {
      periodMatch = false;
    } else if (selectedPeriod === 'quarter' && diffDays > 90) {
      periodMatch = false;
    }
    
    // 검색 필터링
    let searchMatch = true;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      searchMatch = (
        item.purchase?.orderId?.toLowerCase().includes(search) ||
        item.purchase?.supplierName?.toLowerCase().includes(search) ||
        item.purchase?.productName?.toLowerCase().includes(search) ||
        item.purchase?.productCode?.toLowerCase().includes(search)
      );
    }
    
    return periodMatch && searchMatch;
  });

  // 통계 계산
  const totalOrders = filteredData.length;
  const avgReceiptRate = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + (item.receiptSummary?.receiptRate || 0), 0) / filteredData.length
    : 0;


  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0
                }}>발주·입고 현황 조회</h1>
                <p style={{
                  fontSize: '18px',
                  color: '#bfdbfe',
                  margin: 0
                }}>발주관리와 입고관리의 연계 현황을 종합적으로 조회합니다</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="발주 ID, 공급업체, 제품명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '12px 40px 12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#374151',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    minWidth: '300px',
                    outline: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer'
                }}
              >
                <option value="all">전체</option>
                <option value="week">최근 1주</option>
                <option value="month">최근 1개월</option>
                <option value="quarter">최근 3개월</option>
              </select>
            </div>
          </div>

          {/* 통계 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <OrderWarehouseStatusStatCard
              title="총 발주 건수"
              value={totalOrders}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            <OrderWarehouseStatusStatCard
              title="평균 입고율"
              value={`${avgReceiptRate.toFixed(1)}%`}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0ea5e9' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              color="#0ea5e9"
              bgColor="#f0f9ff"
            />
          </div>
          
          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 통합 발주-입고 현황 테이블 */}
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '80px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            데이터를 불러오는 중...
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0
                  }}>발주-입고 통합 현황</h2>
                  <p style={{
                    color: '#bfdbfe',
                    margin: 0,
                    fontSize: '14px'
                  }}>발주별 입고 진행 상황을 확인하세요</p>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={STYLES.table}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={STYLES.th}>발주 정보</th>
                    <th style={STYLES.th}>공급업체</th>
                    <th style={STYLES.th}>제품 정보</th>
                    <th style={STYLES.th}>발주 수량</th>
                    <th style={STYLES.th}>입고 현황</th>
                    <th style={STYLES.th}>입고율</th>
                    <th style={STYLES.th}>잔여 수량</th>
                    <th style={STYLES.th}>상태</th>
                    <th style={STYLES.th}>입고 건수</th>
                    <th style={STYLES.th}>예상납기</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        color: '#6b7280',
                        fontSize: '14px'
                      }}>
                        {searchTerm ? '검색 결과가 없습니다' : '데이터가 없습니다'}
                      </td>
                    </tr>
                  ) : filteredData.map((item, index) => (
                    <tr 
                      key={item.purchase?.orderId || index}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                      }}
                    >
                      {/* 발주 정보 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                              {item.purchase?.orderId?.slice(-2) || 'PO'}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                              {item.purchase?.orderId}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {item.purchase?.orderDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* 공급업체 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                            {item.purchase?.supplierName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {item.purchase?.supplierId}
                          </div>
                        </div>
                      </td>
                      {/* 제품 정보 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                            {item.purchase?.productName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {item.purchase?.productCode}
                          </div>
                        </div>
                      </td>
                      {/* 발주 수량 */}
                      <td style={{ padding: '24px 16px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {(item.purchase?.orderQuantity || 0).toLocaleString('ko-KR')}개
                      </td>
                      {/* 입고 현황 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          총 입고: {(item.receiptSummary?.totalReceivedQuantity || 0).toLocaleString('ko-KR')}개
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          완료: {item.receiptSummary?.completedQuantity || 0}개
                        </div>
                      </td>
                      {/* 입고율 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: (item.receiptSummary?.receiptRate || 0) >= 100 ? '#d1fae5' :
                                          (item.receiptSummary?.receiptRate || 0) >= 50 ? '#fef3c7' : '#fee2e2',
                          color: (item.receiptSummary?.receiptRate || 0) >= 100 ? '#065f46' :
                                 (item.receiptSummary?.receiptRate || 0) >= 50 ? '#d97706' : '#991b1b'
                        }}>
                          {(item.receiptSummary?.receiptRate || 0).toFixed(1)}%
                        </div>
                      </td>
                      {/* 잔여 수량 */}
                      <td style={{ padding: '24px 16px', fontSize: '14px', color: '#6b7280' }}>
                        {(item.receiptSummary?.remainingQuantity || 0).toLocaleString('ko-KR')}개
                      </td>
                      {/* 상태 */}
                      <td style={{ padding: '24px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: item.purchase?.status === 'completed' ? '#d1fae5' :
                                          item.purchase?.status === 'ordered' ? '#dbeafe' : '#fef3c7',
                          color: item.purchase?.status === 'completed' ? '#065f46' :
                                 item.purchase?.status === 'ordered' ? '#1e40af' : '#d97706'
                        }}>
                          {item.purchase?.status === 'completed' ? '완료' :
                           item.purchase?.status === 'ordered' ? '발주됨' :
                           item.purchase?.status === 'pending' ? '대기' : item.purchase?.status}
                        </span>
                      </td>
                      {/* 입고 건수 */}
                      <td style={{ padding: '24px 16px' }}>
                        <div style={{ fontSize: '14px', color: '#111827' }}>
                          총: {item.receiptSummary?.receiptCount || 0}건
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          완료: {item.receiptSummary?.completedReceiptCount || 0}건
                        </div>
                      </td>
                      {/* 예상납기 */}
                      <td style={{ padding: '24px 16px', fontSize: '14px', color: '#6b7280' }}>
                        {item.purchase?.expectedDeliveryDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderWarehouseStatusInfo;
