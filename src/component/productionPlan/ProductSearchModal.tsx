import React, { useState, useEffect, useCallback } from 'react';
import { getBusinesses } from '../../api/productApi';

interface ProductSearchModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (product: any) => void;
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({ 
  show, 
  onClose, 
  onSelect 
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (show) {
      loadProducts();
    }
  }, [show]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSelect = (product: any) => {
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
        maxWidth: '900px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        {/* 모달 헤더 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
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
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
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
                  제품 검색
                </h3>
                <p style={{ 
                  color: '#bfdbfe', 
                  marginTop: '4px',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  제품을 선택하여 생산계획에 자동으로 적용합니다
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
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#bfdbfe';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 검색 입력 */}
        <div style={{ padding: '24px', position: 'relative' }}>
          <input
            type="text"
            placeholder="제품코드, 제품명, 카테고리로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
          />
          <div style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 제품 목록 */}
        <div style={{ padding: '0 24px 24px' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                로딩 중...
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', color: '#d1d5db' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {searchTerm ? '검색 결과가 없습니다' : '제품 데이터가 없습니다'}
              </p>
            </div>
          ) : (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '12px'
            }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>제품 정보</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>카테고리</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>단가</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>재고</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => handleSelect(product)}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                              {product.productCode?.slice(-2) || 'P'}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                              {product.productName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {product.productCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {product.category || '-'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {product.unitPrice ? `${(typeof product.unitPrice === 'string' ? parseFloat(product.unitPrice) : product.unitPrice).toLocaleString('ko-KR')}원` : '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: (product.stockQuantity || 0) > 0 ? '#d1fae5' : '#fee2e2',
                          color: (product.stockQuantity || 0) > 0 ? '#065f46' : '#991b1b'
                        }}>
                          {(typeof product.stockQuantity === 'string' ? parseFloat(product.stockQuantity) : product.stockQuantity || 0).toLocaleString('ko-KR')}개
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

