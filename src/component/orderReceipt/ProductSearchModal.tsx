import React, { useState, useEffect } from 'react';
import { getBusinesses } from '../../api/productApi';

interface ProductData {
  id: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  category?: string;
  description?: string;
  status?: string;
}

interface ProductSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (product: ProductData) => void;
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({ 
  show, 
  onClose, 
  onSelect 
}) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // 제품 데이터 로드
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getBusinesses();
      if (response.success && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('제품 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (show) {
      loadProducts();
    }
  }, [show]);

  // 검색어 변경 시 필터링
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => {
        const searchQuery = searchTerm.toLowerCase();
        return product.productName.toLowerCase().includes(searchQuery) ||
               (product.productCode && product.productCode.toLowerCase().includes(searchQuery)) ||
               (product.category && product.category.toLowerCase().includes(searchQuery))
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleSelect = (product: ProductData) => {
    onSelect(product);
    onClose();
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      overflowY: 'auto',
      height: '100%',
      width: '100%',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: 0
                }}>
                  품목 조회
                </h3>
                <p style={{ 
                  color: '#6ee7b7', 
                  marginTop: '4px',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  제품을 검색하여 선택하세요
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#6ee7b7';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 검색 영역 */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제품명, 제품코드, 카테고리로 검색..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
              }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 제품 목록 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '400px'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#10b981'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ marginLeft: '12px', fontSize: '14px' }}>제품 정보를 불러오는 중...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p style={{ marginTop: '12px', fontSize: '16px' }}>
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 제품이 없습니다.'}
              </p>
            </div>
          ) : (
            <div style={{ padding: '0' }}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: index === filteredProducts.length - 1 ? 'none' : '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {product.productName}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '2px'
                      }}>
                        제품코드: {product.productCode || '미지정'}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        금액: {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.unitPrice || 0)}
                      </div>
                      {product.category && (
                        <div style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginTop: '2px'
                        }}>
                          카테고리: {product.category}
                        </div>
                      )}
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#d1fae5',
                      color: '#059669',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      선택
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductSearchModal;
