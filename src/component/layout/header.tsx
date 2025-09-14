import React, { useState } from 'react';
import Button from '../common/button';
import Modal, { ConfirmModal } from '../common/modal';
import { env } from '../../utils/env';
import { logger } from '../../utils/logger';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logger.logUserAction(user?.id || 'unknown', 'logout', {});
    onLogout?.();
    setShowLogoutModal(false);
    setShowUserMenu(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    logger.logUserAction(user?.id || 'unknown', 'notifications_toggle', {});
  };

  const notifications = [
    { id: 1, title: '설비 A-02 점검 완료', time: '5분 전', type: 'success' },
    { id: 2, title: '재고 부족 경고', time: '10분 전', type: 'warning' },
    { id: 3, title: '새로운 주문 접수', time: '15분 전', type: 'info' },
    { id: 4, title: '품질 검사 결과', time: '20분 전', type: 'success' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 및 브랜드 */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                {/* MES 로고 - 제조업체 아이콘 */}
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    {env.getCompanyName() || 'MES'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    제조 실행 시스템
                  </p>
                </div>
              </div>
            </div>

            {/* 중앙 네비게이션 */}
            <nav className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                대시보드
              </a>
              <a href="/production" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                생산관리
              </a>
              <a href="/quality" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                품질관리
              </a>
              <a href="/inventory" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                재고관리
              </a>
            </nav>

            {/* 우측 액션 버튼들 */}
            <div className="flex items-center space-x-4">
              {/* 알림 버튼 */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* 알림 드롭다운 */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">알림</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        모든 알림 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 사용자 메뉴 */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 사용자 드롭다운 메뉴 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onProfileClick?.();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          프로필
                        </button>
                        <button
                          onClick={() => {
                            onSettingsClick?.();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          설정
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/login'}
                  >
                    로그인
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="로그아웃 확인"
        message="정말로 로그아웃하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        variant="info"
      />

      {/* 오버레이 - 메뉴 외부 클릭 시 닫기 */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
