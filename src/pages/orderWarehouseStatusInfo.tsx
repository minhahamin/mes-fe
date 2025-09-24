import React, { useState, useCallback } from 'react';
import OrderWarehouseStatusStatCard from '../component/orderWarehouseStatus/OrderWarehouseStatusStatCard';
import OrderingTableRow from '../component/orderWarehouseStatus/OrderingTableRow';
import WarehouseTableRow from '../component/orderWarehouseStatus/WarehouseTableRow';
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
            <div style={{ display: 'flex', gap: '12px' }}>
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
                <option value="week">최근 1주</option>
                <option value="month">최근 1개월</option>
                <option value="quarter">최근 3개월</option>
              </select>
            </div>
          </div>

          {/* 통계 카드 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <OrderWarehouseStatusStatCard
              title="평균 창고 사용률"
              value={`${avgUtilization.toFixed(1)}%`}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0ea5e9' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              color="#0ea5e9"
              bgColor="#f0f9ff"
            />
          </div>
        </div>

        {/* 발주 현황 테이블 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
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
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>발주 현황</h2>
            </div>
          </div>
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
              {ORDERING_DATA.map((order, index) => (
                <OrderingTableRow 
                  key={order.id} 
                  item={order} 
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* 입고 현황 테이블 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>입고 현황</h2>
            </div>
          </div>
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
              {WAREHOUSE_DATA.map((warehouse, index) => (
                <WarehouseTableRow 
                  key={warehouse.id} 
                  item={warehouse} 
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* 연계 현황 요약 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>발주-입고 연계 현황</h2>
            </div>
          </div>
          <div style={{ padding: '32px' }}>
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
    </div>
  );
};

export default OrderWarehouseStatusInfo;
