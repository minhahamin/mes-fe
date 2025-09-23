import React, { useState } from 'react';
import MultiTab, { useMultiTab } from '../component/common/MultiTab';
import BusinessInfo from './businessInfo';
import CustomerInfo from './customerInfo';
import EmployeeInfo from './employeeInfo';

const MultiTabExample: React.FC = () => {
  const { tabs, activeTabId, addTab, closeTab, switchTab } = useMultiTab();
  const [tabCounter, setTabCounter] = useState(1);

  const handleAddBusinessTab = () => {
    const tabId = `business-${tabCounter}`;
    addTab({
      id: tabId,
      label: `사업자 정보 ${tabCounter}`,
      content: <BusinessInfo />,
      closable: true
    });
    setTabCounter(prev => prev + 1);
  };

  const handleAddCustomerTab = () => {
    const tabId = `customer-${tabCounter}`;
    addTab({
      id: tabId,
      label: `고객 정보 ${tabCounter}`,
      content: <CustomerInfo />,
      closable: true
    });
    setTabCounter(prev => prev + 1);
  };

  const handleAddEmployeeTab = () => {
    const tabId = `employee-${tabCounter}`;
    addTab({
      id: tabId,
      label: `직원 정보 ${tabCounter}`,
      content: <EmployeeInfo />,
      closable: true
    });
    setTabCounter(prev => prev + 1);
  };

  const handleAddCustomTab = () => {
    const tabId = `custom-${tabCounter}`;
    addTab({
      id: tabId,
      label: `커스텀 탭 ${tabCounter}`,
      content: (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">커스텀 탭 컨텐츠</h2>
          <p className="text-gray-600 mb-4">이것은 동적으로 생성된 커스텀 탭입니다.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">탭 정보</h3>
            <p className="text-blue-800">탭 ID: {tabId}</p>
            <p className="text-blue-800">생성 시간: {new Date().toLocaleString()}</p>
          </div>
        </div>
      ),
      closable: true
    });
    setTabCounter(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">동적 멀티탭 예제</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleAddBusinessTab}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 사업자 정보 탭
          </button>
          <button
            onClick={handleAddCustomerTab}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + 고객 정보 탭
          </button>
          <button
            onClick={handleAddEmployeeTab}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + 직원 정보 탭
          </button>
          <button
            onClick={handleAddCustomTab}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            + 커스텀 탭
          </button>
        </div>
      </div>

      {/* 멀티탭 컨테이너 */}
      <div className="flex-1 flex flex-col">
        <MultiTab
          initialTabs={tabs}
          onTabChange={switchTab}
          onTabClose={closeTab}
          className="flex-1"
        />
      </div>

      {/* 상태 정보 */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">활성 탭:</span> {activeTabId || '없음'} | 
          <span className="font-medium ml-2">총 탭 수:</span> {tabs.length}
        </div>
      </div>
    </div>
  );
};

export default MultiTabExample;
