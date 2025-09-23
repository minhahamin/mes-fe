import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './component/layout/header';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Production from './pages/production';
import Settings from './pages/settings';
import BusinessInfo from './pages/businessInfo';
import CustomerInfo from './pages/customerInfo';
import EmployeeInfo from './pages/employeeInfo';
import ProductInfo from './pages/productInfo';
import QualityInfo from './pages/qualityInfo';
import ClaimInfo from './pages/claimInfo';
import InventoryStatusInfo from './pages/inventoryStatusInfo';
import InventoryInfo from './pages/inventoryInfo';
import ProductionPlanInfo from './pages/productionPlanInfo';
import ProductionOrderInfo from './pages/productionOrderInfo';
import ProductionStatusInfo from './pages/productionStatusInfo';
import OrderReceiptInfo from './pages/orderReceiptInfo';
import OrderingInfo from './pages/orderingInfo';
import WarehouseInfo from './pages/warehouseInfo';
import ShipmentInfo from './pages/shipmentInfo';
import DeliveryInfo from './pages/deliveryInfo';
import OrderWarehouseStatusInfo from './pages/orderWarehouseStatusInfo';
import MultiTabExample from './pages/multiTabExample';

// 404 페이지 컴포넌트
const NotFound: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="mb-4">
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        이전 페이지로 돌아가기
      </button>
    </div>
  </div>
  
);

// 메인 레이아웃 컴포넌트
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

// 로그인이 필요한 페이지들을 보호하는 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 실제로는 로그인 상태를 확인해야 함
  const isAuthenticated = true; // 임시로 true로 설정

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        
        {/* 보호된 페이지들 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basic/businessinfo"
          element={
            <ProtectedRoute>
              <BusinessInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basic/customerinfo"
          element={
            <ProtectedRoute>
              <CustomerInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basic/employeeinfo"
          element={
            <ProtectedRoute>
              <EmployeeInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basic/productinfo"
          element={
            <ProtectedRoute>
              <ProductInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/orderreceipt"
          element={
            <ProtectedRoute>
              <OrderReceiptInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/ordering"
          element={
            <ProtectedRoute>
              <OrderingInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/warehouse"
          element={
            <ProtectedRoute>
              <WarehouseInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/shipment"
          element={
            <ProtectedRoute>
              <ShipmentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/delivery"
          element={
            <ProtectedRoute>
              <DeliveryInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/production/productionplan"
          element={
            <ProtectedRoute>
              <ProductionPlanInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/production/productionorder"
          element={
            <ProtectedRoute>
              <ProductionOrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/production/productionstatus"
          element={
            <ProtectedRoute>
              <ProductionStatusInfo />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/quality/qualityinfo"
          element={
            <ProtectedRoute>
              <QualityInfo />
            </ProtectedRoute>
          }
        />
           <Route
          path="/quality/claiminfo"
          element={
            <ProtectedRoute>
              <ClaimInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/inventorystatus"
          element={
            <ProtectedRoute>
              <InventoryStatusInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/inventoryinfo"
          element={
            <ProtectedRoute>
              <InventoryInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/orderwarehousestatus"
          element={
            <ProtectedRoute>
              <OrderWarehouseStatusInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/multitab"
          element={
            <ProtectedRoute>
              <MultiTabExample />
            </ProtectedRoute>
          }
        />
      
        
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
