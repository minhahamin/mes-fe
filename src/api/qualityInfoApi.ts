

// 품질검사관리 정보 API
export interface BusinessApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }
  
  export interface BusinessCreateRequest {

    qualityId: string,
    productCode: string,
    productName: string,
    batchNumber: string,
    inspectionDate: string,
    inspector: string,
    inspectionType: string,
    status: string,
    quantityInspected: number,
    quantityPassed: number,
    quantityFailed: number,
    passRate: number,
    defectType: string,
    defectDescription: string,
    remarks: string,
    createdAt: string,
    updatedAt: string
      }
  
  export interface BusinessUpdateRequest extends BusinessCreateRequest {
    id: number;
  }
  
  
  // 품질검사관리 정보 생성 (POST /quality-inspections)
  export const createBusiness = async (businessData: BusinessCreateRequest): Promise<BusinessApiResponse> => {
    try {
      // createdAt, updatedAt 필드 제거
      const { createdAt, updatedAt, ...cleanData } = businessData as any;
      const response = await fetch('/api/quality-inspections', {
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
        message: '품질검사관리 정보가 성공적으로 등록되었습니다.'
      };
    } catch (error) {
      console.error('품질검사관리 정보 등록 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '품질검사관리 정보 등록에 실패했습니다.'
      };
    }
  };
  
  // 품질검사관리 정보 수정 (PATCH /quality-inspections/:id)
  export const updateBusiness = async (businessData: BusinessUpdateRequest): Promise<BusinessApiResponse> => {
    try {
      const { id, createdAt, updatedAt, totalAmount, orderId, ...updateData } = businessData as any;
      const response = await fetch(`/api/quality-inspections/${id}`, {
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
        message: '품질검사관리 정보가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      console.error('품질검사관리 정보 수정 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '품질검사관리 정보 수정에 실패했습니다.'
      };
    }
  };
  
  // 품질검사관리 정보 삭제 (DELETE /quality-inspections/:id)
  export const deleteBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/quality-inspections/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return {
        success: true,
        message: '품질검사관리 정보가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      console.error('품질검사관리 정보 삭제 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '품질검사관리 정보 삭제에 실패했습니다.'
      };
    }
  };
  
  // 품질검사관리 정보 조회 (GET /quality-inspections)
  export const getBusinesses = async (): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch('/api/quality-inspections');
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('품질검사관리 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '품질검사관리 정보 조회에 실패했습니다.'
      };
    }
  };
  
  // 품질검사관리 정보 단건 조회 (GET /quality-inspections/:id)
  export const getBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/quality-inspections/${id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('품질검사관리 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '품질검사관리 정보 조회에 실패했습니다.'
      };
    }
  };
  