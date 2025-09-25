// 직원 정보 API
export interface BusinessApiResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
  }
  
  export interface BusinessCreateRequest {
    employeeId?: string;
    name: string;
    department: string;
    position: string;
    phone: string;
    email: string;
    hireDate: string;
    salary: number;
    status: 'active' | 'inactive' | 'on_leave';
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface BusinessUpdateRequest extends BusinessCreateRequest {
    id: number;
  }
  
  
  // 직원 정보 생성 (POST /employees)
  export const createBusiness = async (businessData: BusinessCreateRequest): Promise<BusinessApiResponse> => {
    try {
      // employeeId, createdAt, updatedAt 필드 제거
      const { employeeId, createdAt, updatedAt, ...cleanData } = businessData as any;
      const response = await fetch('/api/employees', {
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
        message: '직원 정보가 성공적으로 등록되었습니다.'
      };
    } catch (error) {
      console.error('직원 정보 등록 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '직원 정보 등록에 실패했습니다.'
      };
    }
  };
  
  // 직원 정보 수정 (PATCH /employees/:id)
  export const updateBusiness = async (businessData: BusinessUpdateRequest): Promise<BusinessApiResponse> => {
    try {
      const { id, employeeId, createdAt, updatedAt, ...updateData } = businessData;
      const response = await fetch(`/api/employees/${id}`, {
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
        message: '직원 정보가 성공적으로 수정되었습니다.'
      };
    } catch (error) {
      console.error('직원 정보 수정 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '직원 정보 수정에 실패했습니다.'
      };
    }
  };
  
  // 직원 정보 삭제 (DELETE /employees/:id)
  export const deleteBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return {
        success: true,
        message: '직원 정보가 성공적으로 삭제되었습니다.'
      };
    } catch (error) {
      console.error('직원 정보 삭제 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '직원 정보 삭제에 실패했습니다.'
      };
    }
  };
  
  // 직원 정보 조회 (GET /employees)
  export const getBusinesses = async (): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch('/api/employees');
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('직원 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '직원 정보 조회에 실패했습니다.'
      };
    }
  };
  
  // 직원 정보 단건 조회 (GET /employees/:id)
  export const getBusiness = async (id: number): Promise<BusinessApiResponse> => {
    try {
      const response = await fetch(`/api/employees/${id}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('직원 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '직원 정보 조회에 실패했습니다.'
      };
    }
  };
  