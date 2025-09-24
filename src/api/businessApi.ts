// 사업장 정보 API
export interface BusinessApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface BusinessCreateRequest {
  companyName: string;
  businessNumber: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
  industry: string;
  establishedDate: string;
}

export interface BusinessUpdateRequest extends BusinessCreateRequest {
  id: number;
}


// 사업장 정보 생성 (POST /companies)
export const createBusiness = async (businessData: BusinessCreateRequest): Promise<BusinessApiResponse> => {
  try {
    const response = await fetch('/companies', {
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
      message: '사업장 정보가 성공적으로 등록되었습니다.'
    };
  } catch (error) {
    console.error('사업장 정보 등록 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '사업장 정보 등록에 실패했습니다.'
    };
  }
};

// 사업장 정보 수정 (PATCH /companies/:id)
export const updateBusiness = async (businessData: BusinessUpdateRequest): Promise<BusinessApiResponse> => {
  try {
    const response = await fetch(`/companies/${businessData.id}`, {
      method: 'PATCH',
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
      message: '사업장 정보가 성공적으로 수정되었습니다.'
    };
  } catch (error) {
    console.error('사업장 정보 수정 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '사업장 정보 수정에 실패했습니다.'
    };
  }
};

// 사업장 정보 삭제 (DELETE /companies/:id)
export const deleteBusiness = async (id: number): Promise<BusinessApiResponse> => {
  try {
    const response = await fetch(`/companies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: '사업장 정보가 성공적으로 삭제되었습니다.'
    };
  } catch (error) {
    console.error('사업장 정보 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '사업장 정보 삭제에 실패했습니다.'
    };
  }
};

// 사업장 정보 조회 (GET /companies)
export const getBusinesses = async (): Promise<BusinessApiResponse> => {
  try {
    const response = await fetch('/companies');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('사업장 정보 조회 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '사업장 정보 조회에 실패했습니다.'
    };
  }
};

// 사업장 정보 단건 조회 (GET /companies/:id)
export const getBusiness = async (id: number): Promise<BusinessApiResponse> => {
  try {
    const response = await fetch(`/companies/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('사업장 정보 조회 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '사업장 정보 조회에 실패했습니다.'
    };
  }
};
