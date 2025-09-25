// 거래처 정보 API
export interface BusinessApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }
  
  export interface BusinessCreateRequest {
    customerName: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    businessNumber: string;
    industry: string;
    creditLimit: number;
    paymentTerms: string;
    registrationDate: string;
  }
  
  export interface BusinessUpdateRequest extends BusinessCreateRequest {
    id: number;
  }
  
  
  // 거래처 정보 생성 (POST /customers)
  export const createBusiness = async (businessData: BusinessCreateRequest): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result,
        message: '거래처 정보가 성공적으로 등록되었습니다.'
      };
    } catch (error) {
      console.error('거래처 정보 등록 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '거래처 정보 등록에 실패했습니다.'
      };
    }
  };
  
  // 거래처 정보 수정 (PATCH /customers/:id)
  export const updateBusiness = async (businessData: BusinessUpdateRequest): Promise<BusinessApiResponse> => {
    try {
      const { id, ...updateData } = businessData;
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result,
        message: '거래처 정보가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      console.error('거래처 정보 수정 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '거래처 정보 수정에 실패했습니다.'
      };
    }
  };
  
  // 거래처 정보 삭제 (DELETE /customers/:id)
  export const deleteBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return {
        success: true,
        message: '거래처 정보가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      console.error('거래처 정보 삭제 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '거래처 정보 삭제에 실패했습니다.'
      };
    }
  };
  
  // 거래처 정보 조회 (GET /customers)
  export const getBusinesses = async (): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch('/api/customers');
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '거래처 정보 조회에 실패했습니다.'
      };
    }
  };
  
  // 거래처 정보 단건 조회 (GET /customers/:id)
  export const getBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/customers/${id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '거래처 정보 조회에 실패했습니다.'
      };
    }
  };
  