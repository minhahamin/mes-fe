import React, { useState, useEffect } from 'react';
import Button from '../component/common/button';

interface DashboardStats {
  production: {
    total: number;
    completed: number;
    inProgress: number;
    efficiency: number;
  };
  quality: {
    totalInspections: number;
    passed: number;
    failed: number;
    passRate: number;
  };
  inventory: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    criticalItems: number;
  };
  equipment: {
    total: number;
    running: number;
    maintenance: number;
    breakdown: number;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    production: { total: 0, completed: 0, inProgress: 0, efficiency: 0 },
    quality: { totalInspections: 0, passed: 0, failed: 0, passRate: 0 },
    inventory: { totalItems: 0, lowStock: 0, outOfStock: 0, criticalItems: 0 },
    equipment: { total: 0, running: 0, maintenance: 0, breakdown: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 시뮬레이션 데이터
      setStats({
        production: {
          total: 1250,
          completed: 980,
          inProgress: 270,
          efficiency: 87.5
        },
        quality: {
          totalInspections: 450,
          passed: 420,
          failed: 30,
          passRate: 93.3
        },
        inventory: {
          totalItems: 1250,
          lowStock: 45,
          outOfStock: 8,
          criticalItems: 12
        },
        equipment: {
          total: 25,
          running: 18,
          maintenance: 5,
          breakdown: 2
        }
      });
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium">{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="ml-1">vs 이전 주</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const RecentActivity: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
      <div className="space-y-3">
        {[
          { action: '생산 라인 A 완료', time: '2분 전', type: 'production' },
          { action: '품질 검사 통과', time: '5분 전', type: 'quality' },
          { action: '재고 부족 경고', time: '10분 전', type: 'inventory' },
          { action: '설비 정기 점검', time: '15분 전', type: 'equipment' },
          { action: '새로운 주문 접수', time: '20분 전', type: 'production' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div className={`w-2 h-2 rounded-full ${
              activity.type === 'production' ? 'bg-blue-500' :
              activity.type === 'quality' ? 'bg-green-500' :
              activity.type === 'inventory' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProductionChart: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">생산 현황</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">완료된 작업</span>
          <span className="text-sm font-medium">{stats.production.completed}/{stats.production.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stats.production.completed / stats.production.total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">진행 중인 작업</span>
          <span className="text-sm font-medium">{stats.production.inProgress}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stats.production.inProgress / stats.production.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MES 대시보드</h1>
              <p className="text-sm text-gray-600">제조 실행 시스템 현황</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                새로고침
              </Button>
              <Button variant="primary" size="sm">
                상세 보고서
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="총 생산량"
            value={stats.production.total.toLocaleString()}
            subtitle={`완료: ${stats.production.completed.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            color="#3B82F6"
            trend={{ value: 5.2, isPositive: true }}
          />
          
          <StatCard
            title="품질 통과율"
            value={`${stats.quality.passRate}%`}
            subtitle={`검사: ${stats.quality.totalInspections}건`}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="#10B981"
            trend={{ value: 2.1, isPositive: true }}
          />
          
          <StatCard
            title="재고 경고"
            value={stats.inventory.criticalItems}
            subtitle={`부족: ${stats.inventory.lowStock}개`}
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            color="#F59E0B"
            trend={{ value: 1.8, isPositive: false }}
          />
          
          <StatCard
            title="설비 가동률"
            value={`${Math.round((stats.equipment.running / stats.equipment.total) * 100)}%`}
            subtitle={`가동: ${stats.equipment.running}/${stats.equipment.total}대`}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            color="#8B5CF6"
            trend={{ value: 3.5, isPositive: true }}
          />
        </div>

        {/* 차트 및 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionChart />
          <RecentActivity />
        </div>

        {/* 알림 및 경고 */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 및 경고</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">설비 A-02 고장</p>
                  <p className="text-xs text-red-600">긴급 수리가 필요합니다.</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">재고 부족 경고</p>
                  <p className="text-xs text-yellow-600">부품 B-123의 재고가 부족합니다.</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">정기 점검 알림</p>
                  <p className="text-xs text-blue-600">설비 C-05의 정기 점검 예정입니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
