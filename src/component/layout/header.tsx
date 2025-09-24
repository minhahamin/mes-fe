// Header.tsx
import React, { useState, useEffect } from 'react';
import './Header.css';

interface MenuItem {
  id: number;
  name: string;
  displayName: string;
  url: string;
  icon: string;
  sortOrder: number;
}

interface MenuCategory {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  sortOrder: number;
  children: MenuItem[];
}

const Header: React.FC = () => {
  const [menus, setMenus] = useState<MenuCategory[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus/hierarchy');
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('메뉴 로드 실패:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 홈 버튼 */}
        <div className="nav-item">
          <a href="/dashboard" className="nav-link" style={{ textDecoration: 'none', color: 'white' }}>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            홈
          </a>
        </div>
        
        {menus.map((category) => (
          <div
            key={category.id}
            className="nav-item"
            onMouseEnter={() => setActiveDropdown(category.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="nav-link">
              <i className={category.icon}></i>
              {category.displayName}
            </span>
            
            {/* 드롭다운 메뉴 */}
            {activeDropdown === category.id && (
              <div className="dropdown-menu">
                {category.children.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="dropdown-item"
                  >
                    <i className={item.icon}></i>
                    {item.displayName}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Header;
