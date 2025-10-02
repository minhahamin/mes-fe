// 생산현황 정보 API
export interface BusinessApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }
  
  export interface BusinessCreateRequest {

    productCode: string,
    productName: string,    
    planQuantity: number,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    status: string,
    priority: string,
    workCenter: string,
    responsiblePerson: string,
    estimatedHours: number,
    actualHours: number,
    notes: string,
    createdAt: string,
    updatedAt: string
      }
  
  export interface BusinessUpdateRequest extends BusinessCreateRequest {
    id: number;
  }
  
  
  // 생산현황 정보 생성 (POST /production-status)
  export const createBusiness = async (businessData: BusinessCreateRequest): Promise<BusinessApiResponse> => {
    try {
      // createdAt, updatedAt 필드 제거
      const { createdAt, updatedAt, ...cleanData } = businessData as any;
      const response = await fetch('/api/production-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        // 에러 응답 내용도 로그에 추가
        const errorText = await response.text();
        console.error('API 에러 응답:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result,
        message: '생산현황 정보가 성공적으로 등록되었습니다.'
      };
    } catch (error) {
      console.error('생산현황 정보 등록 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '생산현황 정보 등록에 실패했습니다.'
      };
    }
  };
  
  // 생산현황 정보 수정 (PATCH /production-status/:id)
  export const updateBusiness = async (businessData: BusinessUpdateRequest): Promise<BusinessApiResponse> => {
    try {
      const { id, createdAt, updatedAt, totalAmount, orderId, ...updateData } = businessData as any;
      const response = await fetch(`/api/production-status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        // 에러 응답 내용도 로그에 추가
        const errorText = await response.text();
        console.error('API 수정 에러 응답:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: '생산현황 정보가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      console.error('생산현황 정보 수정 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '생산현황 정보 수정에 실패했습니다.'
      };
    }
  };
  
  // 생산현황 정보 삭제 (DELETE /production-status/:id)
  export const deleteBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/production-status/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return {
        success: true,
        message: '생산현황 정보가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      console.error('생산현황 정보 삭제 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '생산현황 정보 삭제에 실패했습니다.'
      };
    }
  };
  
  // 생산현황 정보 조회 (GET /production-status)
  export const getBusinesses = async (): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch('/api/production-status');
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('생산현황 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '생산현황 정보 조회에 실패했습니다.'
      };
    }
  };
  
  // 생산현황 정보 단건 조회 (GET /production-status/:id)
  export const getBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/production-status/${id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('생산현황 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '생산현황 정보 조회에 실패했습니다.'
      };
    }
  };
  