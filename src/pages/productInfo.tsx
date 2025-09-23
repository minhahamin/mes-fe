import React, { useState, useCallback } from 'react';
import ProductStatCard from '../component/product/ProductStatCard';
import ProductTableRow from '../component/product/ProductTableRow';
import ProductModal from '../component/product/ProductModal';
import { ProductData } from '../types/product';

// 스타일 상수
const STYLES = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
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
    backgroundColor: '#f59e0b',
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

// 초기 데이터
const INITIAL_DATA: ProductData[] = [
  {
    id: 1,
    productCode: 'PROD001',
    productName: '스마트폰 케이스',
    category: '전자제품',
    description: '고급 실리콘 소재의 스마트폰 보호 케이스',
    unitPrice: 25000,
    cost: 15000,
    stock: 150,
    minStock: 20,
    maxStock: 200,
    supplier: '케이스코리아',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    productCode: 'PROD002',
    productName: '무선 이어폰',
    category: '전자제품',
    description: '노이즈 캔슬링 기능이 있는 블루투스 이어폰',
    unitPrice: 120000,
    cost: 80000,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    supplier: '오디오테크',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    productCode: 'PROD003',
    productName: '면 티셔츠',
    category: '의류',
    description: '100% 면 소재의 기본 티셔츠',
    unitPrice: 15000,
    cost: 8000,
    stock: 5,
    minStock: 15,
    maxStock: 50,
    supplier: '패션월드',
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 4,
    productCode: 'PROD004',
    productName: '노트북 스탠드',
    category: '전자제품',
    description: '각도 조절 가능한 알루미늄 노트북 스탠드',
    unitPrice: 45000,
    cost: 25000,
    stock: 0,
    minStock: 5,
    maxStock: 30,
    supplier: '데스크솔루션',
    status: 'inactive',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

const ProductInfo: React.FC = () => {
  // 상태 관리
  const [productData, setProductData] = useState<ProductData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProductData>>({});
  const [showForm, setShowForm] = useState(false);

  // 핸들러 함수들
  const handleAdd = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    const item = productData.find(d => d.id === id);
    if (item) {
      setFormData(item);
      setEditingId(id);
      setShowForm(true);
    }
  }, [productData]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setProductData(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.productCode || !formData.productName || !formData.category) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정
      setProductData(prev => prev.map(d => 
        d.id === editingId ? { ...d, ...formData, updatedAt: new Date().toISOString().split('T')[0] } as ProductData : d
      ));
    } else {
      // 추가
      const newId = Math.max(...productData.map(d => d.id), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      setProductData(prev => [...prev, { 
        ...formData, 
        id: newId, 
        createdAt: now, 
        updatedAt: now 
      } as ProductData]);
    }
    
    handleCloseForm();
  }, [editingId, formData, productData]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['unitPrice', 'cost', 'stock', 'minStock', 'maxStock'].includes(name) ? Number(value) : value 
    }));
  }, []);

  // 통계 계산
  const activeProducts = productData.filter(prod => prod.status === 'active').length;
  const lowStockProducts = productData.filter(prod => prod.stock <= prod.minStock).length;
  const totalValue = productData.reduce((sum, prod) => sum + (prod.stock * prod.unitPrice), 0);
  const categories = new Set(productData.map(prod => prod.category)).size;

  return (
    <div style={STYLES.container}>
      <div style={STYLES.content}>
        {/* 헤더 섹션 */}
        <div style={STYLES.header}>
          <div style={STYLES.headerContent}>
            <div style={STYLES.iconContainer}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 style={STYLES.title}>제품 정보 관리</h1>
              <p style={STYLES.subtitle}>제품 정보를 체계적으로 관리합니다</p>
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ProductStatCard
              title="총 제품 수"
              value={productData.length}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f59e0b' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            
            <ProductStatCard
              title="활성 제품"
              value={activeProducts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="#10b981"
              bgColor="#d1fae5"
            />
            
            <ProductStatCard
              title="재고부족 제품"
              value={lowStockProducts}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              color="#ef4444"
              bgColor="#fee2e2"
            />
            
            <ProductStatCard
              title="총 재고 가치"
              value={new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalValue)}
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8b5cf6' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="#8b5cf6"
              bgColor="#ede9fe"
            />
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>제품 정보 목록</h2>
                <p style={{ 
                  color: '#fed7aa', 
                  marginTop: '4px',
                  margin: 0
                }}>등록된 모든 제품 정보를 확인하고 관리하세요</p>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: 'white',
                  color: '#f59e0b',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fffbeb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>새 제품 추가</span>
              </button>
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
                  }}>설명</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>단가</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>원가</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>재고</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>재고범위</th>
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
                  }}>상태</th>
                  <th style={{
                    padding: '16px 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>작업</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {productData.map((item, index) => (
                  <ProductTableRow 
                    key={item.id} 
                    item={item} 
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <ProductModal
        show={showForm}
        editingId={editingId}
        formData={formData}
        onClose={handleCloseForm}
        onSave={handleSave}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default ProductInfo;
