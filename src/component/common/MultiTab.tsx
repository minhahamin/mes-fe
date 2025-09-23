import React, { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  closable?: boolean;
}

interface MultiTabProps {
  initialTabs?: Tab[];
  onTabChange?: (activeTabId: string) => void;
  onTabClose?: (tabId: string) => void;
  className?: string;
}

const MultiTab: React.FC<MultiTabProps> = ({
  initialTabs = [],
  onTabChange,
  onTabClose,
  className = ''
}) => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(
    initialTabs.length > 0 ? initialTabs[0].id : ''
  );

  const addTab = (tab: Tab) => {
    setTabs(prevTabs => {
      // 이미 같은 ID의 탭이 있는지 확인
      const existingTab = prevTabs.find(t => t.id === tab.id);
      if (existingTab) {
        setActiveTabId(tab.id);
        onTabChange?.(tab.id);
        return prevTabs;
      }
      
      const newTabs = [...prevTabs, tab];
      setActiveTabId(tab.id);
      onTabChange?.(tab.id);
      return newTabs;
    });
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // 닫힌 탭이 현재 활성 탭이었다면 다른 탭으로 전환
      if (activeTabId === tabId && newTabs.length > 0) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setActiveTabId(newTabs[newActiveIndex].id);
        onTabChange?.(newTabs[newActiveIndex].id);
      } else if (newTabs.length === 0) {
        setActiveTabId('');
      }
      
      onTabClose?.(tabId);
      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={`multi-tab-container ${className}`}>
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200 bg-white">
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer
                transition-colors duration-200 min-w-0
                ${activeTabId === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
              onClick={() => switchTab(tab.id)}
            >
              <span className="truncate mr-2">{tab.label}</span>
              {tab.closable !== false && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 bg-white">
        {activeTab && (
          <div className="h-full">
            {activeTab.content}
          </div>
        )}
        {tabs.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>탭을 추가해주세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 탭을 동적으로 관리하기 위한 훅
export const useMultiTab = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const addTab = (tab: Tab) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(t => t.id === tab.id);
      if (existingTab) {
        setActiveTabId(tab.id);
        return prevTabs;
      }
      
      const newTabs = [...prevTabs, tab];
      setActiveTabId(tab.id);
      return newTabs;
    });
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      if (activeTabId === tabId && newTabs.length > 0) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setActiveTabId(newTabs[newActiveIndex].id);
      } else if (newTabs.length === 0) {
        setActiveTabId('');
      }
      
      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  return {
    tabs,
    activeTabId,
    addTab,
    closeTab,
    switchTab
  };
};

export default MultiTab;
