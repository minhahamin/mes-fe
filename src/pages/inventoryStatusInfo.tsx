import React, { useState, useEffect, useCallback } from 'react';
import { getBusinesses } from '../api/inventoryStatusApi';

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
    backgroundColor: '#059669',
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

interface InventoryItem {
  productCode: string;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: 'sufficient' | 'low' | 'out_of_stock' | 'excess';
  location: string;
  totalValue: string;
  supplier: string;
}

interface InventoryResponse {
  summary: {
    totalItems: number;
    totalStock: number;
    totalValue: number;
    statusSummary: {
      sufficient: number;
      low: number;
      out_of_stock: number;
      excess: number;
    };
  };
  inventories: InventoryItem[];
}

const InventoryStatusInfo: React.FC = () => {
  // 상태 관리
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventoryResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  const loadInventoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBusinesses();
      if (response.success && response.data) {
        const data = response.data as InventoryResponse;
        setInventoryData(data.inventories);
        setSummary(data.summary);
      } else {
        setError(response.error || '재고 현황 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('재고 현황 데이터를 불러오는데 실패했습니다.');
      console.error('재고 현황 데이터 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  // 통계 계산
  const totalItems = summary?.totalItems || 0;
  const totalStock = summary?.totalStock || 0;
  const totalValue = summary?.totalValue || 0;
  const sufficientCount = summary?.statusSummary.sufficient || 0;
  const lowCount = summary?.statusSummary.low || 0;

  // 로딩 상태
  if (loading) {
    return (
      <div style={STYLES.container}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={STYLES.container}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontSize: '18px', color: '#dc2626' }}>{error}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      sufficient: { text: '충분', color: '#d1fae5', textColor: '#065f46' },
      low: { text: '부족', color: '#fef3c7', textColor: '#d97706' },
      out_of_stock: { text: '재고없음', color: '#fee2e2', textColor: '#991b1b' },
      excess: { text: '과재고', color: '#e0e7ff', textColor: '#3730a3' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: statusInfo.color,
        color: statusInfo.textColor
      }}>
        {statusInfo.text}
      </span>
    );
  };

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
              <h1 style={STYLES.title}>재고 현황</h1>
              <p style={STYLES.subtitle}>제품별 재고 현황을 실시간으로 모니터링합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              borderLeft: '4px solid #059669'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '8px'
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#059669' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>총 제품 수</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{totalItems.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '8px'
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>총 재고 수량</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{totalStock.toLocaleString()}개</p>
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#ede9fe',
                  borderRadius: '8px'
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>총 재고 가치</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalValue)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              borderLeft: '4px solid #d97706'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '8px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px'
                }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: 0 }}>재고부족 제품</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{lowCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: 'white',
                margin: 0
              }}>재고 현황 목록</h2>
              <p style={{ 
                color: '#a7f3d0', 
                marginTop: '4px',
                margin: 0
              }}>제품별 재고 상태를 확인하세요</p>
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
                  }}>제품코드</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>제품명</th>
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
                  }}>현재 재고</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>최소/최대</th>
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
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {inventoryData.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                  }}>
                    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3'
                      }}>
                        {item.productCode}
                      </span>
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {item.productName}
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#6b7280' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {item.currentStock.toLocaleString()}개
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '12px', color: '#6b7280' }}>
                      {item.minStock.toLocaleString()} / {item.maxStock.toLocaleString()}
                    </td>
                    <td style={{ padding: '24px 32px', whiteSpace: 'nowrap' }}>
                      {getStatusBadge(item.status)}
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#6b7280' }}>
                      {item.location || '-'}
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#6b7280' }}>
                      {item.supplier}
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(parseFloat(item.totalValue))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatusInfo;
