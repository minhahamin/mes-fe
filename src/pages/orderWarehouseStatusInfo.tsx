import React, { useState, useCallback } from 'react';
import { OrderingData } from '../types/ordering';
import { WarehouseData } from '../types/warehouse';

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
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280'
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
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }
} as const;

// 더미 데이터
const ORDERING_DATA: OrderingData[] = [
  {
    id: 1,
    orderId: 'PO2024001',
    supplierName: '스테인리스 강판 공급업체',
    productName: '스테인리스 강판',
    productCode: 'STEEL001',
    quantity: 100,
    unitPrice: 50000,
    totalAmount: 5000000,
    orderDate: '2024-01-15',
    expectedDeliveryDate: '2024-01-25',
    actualDeliveryDate: '2024-01-24',
    status: '입고완료',
    priority: '높음',
    purchasePerson: '김구매',
    paymentStatus: '완료',
    notes: '우선 처리 필요'
  },
  {
    id: 2,
    orderId: 'PO2024002',
    supplierName: '반도체 칩 공급업체',
    productName: '반도체 칩',
    productCode: 'CHIP001',
    quantity: 1000,
    unitPrice: 2000,
    totalAmount: 2000000,
    orderDate: '2024-01-20',
    expectedDeliveryDate: '2024-01-30',
    status: '부분입고',
    priority: '보통',
    purchasePerson: '이구매',
    paymentStatus: '부분결제',
    notes: '일부 입고 완료'
  },
  {
    id: 3,
    orderId: 'PO2024003',
    supplierName: '포장재 공급업체',
    productName: '포장 박스',
    productCode: 'BOX001',
    quantity: 5000,
    unitPrice: 1000,
    totalAmount: 5000000,
    orderDate: '2024-01-25',
    expectedDeliveryDate: '2024-02-05',
    status: '발주됨',
    priority: '낮음',
    purchasePerson: '박구매',
    paymentStatus: '미결제',
    notes: '예정된 발주'
  }
];

const WAREHOUSE_DATA: WarehouseData[] = [
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
    notes: 'PO2024001 발주 물품 입고 완료',
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
    notes: 'PO2024002 발주 물품 입고 대기',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  }
];

const OrderWarehouseStatusInfo: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // 통계 계산
  const totalOrders = ORDERING_DATA.length;
  const completedOrders = ORDERING_DATA.filter(order => order.status === '입고완료').length;
  const partialOrders = ORDERING_DATA.filter(order => order.status === '부분입고').length;
  const pendingOrders = ORDERING_DATA.filter(order => order.status === '발주됨').length;
  
  const totalWarehouses = WAREHOUSE_DATA.length;
  const activeWarehouses = WAREHOUSE_DATA.filter(wh => wh.status === 'active').length;
  const fullWarehouses = WAREHOUSE_DATA.filter(wh => wh.status === 'full').length;
  const avgUtilization = WAREHOUSE_DATA.reduce((sum, wh) => sum + wh.utilizationRate, 0) / WAREHOUSE_DATA.length;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      '입고완료': { color: '#d1fae5', textColor: '#065f46' },
      '부분입고': { color: '#fef3c7', textColor: '#d97706' },
      '발주됨': { color: '#dbeafe', textColor: '#1e40af' },
      '대기': { color: '#f3f4f6', textColor: '#6b7280' },
      '취소': { color: '#fee2e2', textColor: '#991b1b' },
      'active': { color: '#d1fae5', textColor: '#065f46' },
      'full': { color: '#fee2e2', textColor: '#991b1b' },
      'inactive': { color: '#f3f4f6', textColor: '#6b7280' },
      'maintenance': { color: '#fef3c7', textColor: '#d97706' },
      'high': { color: '#fee2e2', textColor: '#991b1b' },
      'medium': { color: '#dbeafe', textColor: '#1e40af' },
      'low': { color: '#f3f4f6', textColor: '#6b7280' },
      'urgent': { color: '#fee2e2', textColor: '#991b1b' },
      '높음': { color: '#fee2e2', textColor: '#991b1b' },
      '보통': { color: '#dbeafe', textColor: '#1e40af' },
      '낮음': { color: '#f3f4f6', textColor: '#6b7280' },
      '긴급': { color: '#fee2e2', textColor: '#991b1b' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: '#f3f4f6', textColor: '#6b7280' };
    return (
      <span style={{
        ...STYLES.statusBadge,
        backgroundColor: statusInfo.color,
        color: statusInfo.textColor
      }}>
        {status}
      </span>
    );
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 90) return '#ef4444';
    if (rate >= 70) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div>
              <h1 style={STYLES.title}>발주·입고 현황 조회</h1>
              <p style={STYLES.subtitle}>발주관리와 입고관리의 연계 현황을 종합적으로 조회합니다</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              >
                <option value="week">최근 1주</option>
                <option value="month">최근 1개월</option>
                <option value="quarter">최근 3개월</option>
              </select>
            </div>
          </div>

          {/* 통계 카드 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              ...STYLES.statCard,
              backgroundColor: '#f0f9ff',
              border: '2px solid #0ea5e9',
              minWidth: '200px'
            }}>
              <div style={{ ...STYLES.statValue, color: '#0ea5e9' }}>{avgUtilization.toFixed(1)}%</div>
              <div style={{ ...STYLES.statLabel, color: '#0369a1' }}>평균 창고 사용률</div>
            </div>
          </div>
        </div>

        {/* 발주 현황 테이블 */}
        <div style={STYLES.card}>
          <h2 style={STYLES.cardTitle}>발주 현황</h2>
          <table style={STYLES.table}>
            <thead>
              <tr>
                <th style={STYLES.th}>발주 ID</th>
                <th style={STYLES.th}>공급업체</th>
                <th style={STYLES.th}>제품명</th>
                <th style={STYLES.th}>수량</th>
                <th style={STYLES.th}>금액</th>
                <th style={STYLES.th}>발주일</th>
                <th style={STYLES.th}>예상납기</th>
                <th style={STYLES.th}>상태</th>
                <th style={STYLES.th}>우선순위</th>
                <th style={STYLES.th}>담당자</th>
              </tr>
            </thead>
            <tbody>
              {ORDERING_DATA.map((order) => (
                <tr key={order.id}>
                  <td style={STYLES.td}>{order.orderId}</td>
                  <td style={STYLES.td}>{order.supplierName}</td>
                  <td style={STYLES.td}>{order.productName}</td>
                  <td style={STYLES.td}>{order.quantity.toLocaleString()}개</td>
                  <td style={STYLES.td}>{order.totalAmount.toLocaleString()}원</td>
                  <td style={STYLES.td}>{order.orderDate}</td>
                  <td style={STYLES.td}>{order.expectedDeliveryDate}</td>
                  <td style={STYLES.td}>{getStatusBadge(order.status)}</td>
                  <td style={STYLES.td}>{getStatusBadge(order.priority)}</td>
                  <td style={STYLES.td}>{order.purchasePerson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 입고 현황 테이블 */}
        <div style={STYLES.card}>
          <h2 style={STYLES.cardTitle}>입고 현황</h2>
          <table style={STYLES.table}>
            <thead>
              <tr>
                <th style={STYLES.th}>창고 ID</th>
                <th style={STYLES.th}>창고명</th>
                <th style={STYLES.th}>위치</th>
                <th style={STYLES.th}>용량</th>
                <th style={STYLES.th}>현재 재고</th>
                <th style={STYLES.th}>사용률</th>
                <th style={STYLES.th}>상태</th>
                <th style={STYLES.th}>담당자</th>
                <th style={STYLES.th}>환경</th>
                <th style={STYLES.th}>보안</th>
              </tr>
            </thead>
            <tbody>
              {WAREHOUSE_DATA.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td style={STYLES.td}>{warehouse.warehouseId}</td>
                  <td style={STYLES.td}>{warehouse.warehouseName}</td>
                  <td style={STYLES.td}>{warehouse.location}</td>
                  <td style={STYLES.td}>{warehouse.capacity.toLocaleString()}</td>
                  <td style={STYLES.td}>{warehouse.currentStock.toLocaleString()}</td>
                  <td style={STYLES.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={STYLES.progressBar}>
                        <div 
                          style={{
                            ...STYLES.progressFill,
                            width: `${warehouse.utilizationRate}%`,
                            backgroundColor: getProgressColor(warehouse.utilizationRate)
                          }}
                        />
                      </div>
                      <span>{warehouse.utilizationRate}%</span>
                    </div>
                  </td>
                  <td style={STYLES.td}>{getStatusBadge(warehouse.status)}</td>
                  <td style={STYLES.td}>{warehouse.manager}</td>
                  <td style={STYLES.td}>{warehouse.temperature} / {warehouse.humidity}</td>
                  <td style={STYLES.td}>{getStatusBadge(warehouse.securityLevel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 연계 현황 요약 */}
        <div style={STYLES.card}>
          <h2 style={STYLES.cardTitle}>발주-입고 연계 현황</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                입고 완료된 발주
              </h3>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {ORDERING_DATA.filter(order => order.status === '입고완료').map(order => (
                  <div key={order.id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                    <strong>{order.orderId}</strong> - {order.productName} ({order.quantity}개)
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                입고 대기 중인 발주
              </h3>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {ORDERING_DATA.filter(order => order.status !== '입고완료').map(order => (
                  <div key={order.id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                    <strong>{order.orderId}</strong> - {order.productName} ({order.quantity}개) - {order.status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWarehouseStatusInfo;
