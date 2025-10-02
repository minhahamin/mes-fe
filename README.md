# MES Frontend (Manufacturing Execution System)
- 배포 : https://mes-fe-phi.vercel.app/dashboard
> 제조 실행 시스템 프론트엔드 - React + TypeScript + Vite

## 📋 프로젝트 개요

MES(Manufacturing Execution System) 프론트엔드는 제조 공정의 전반적인 관리를 위한 웹 애플리케이션입니다. 
생산 계획, 주문 관리, 재고 관리, 품질 검사, 출하/납품 관리 등 제조 업무의 모든 프로세스를 통합 관리합니다.

## 🚀 주요 기능

### 📊 대시보드
- 실시간 생산 현황 모니터링
- 주요 지표 시각화 (생산량, 품질률, 설비 가동률)
- 일정 캘린더 및 이벤트 관리

### 📦 주문 관리
- **수주 관리**: 고객 주문 접수 및 관리
- **발주 관리**: 자재/부품 발주 및 추적
- **발주입고 현황**: 발주 대비 입고 현황 통합 조회

### 🏭 생산 관리
- **생산 계획**: 제품별 생산 계획 수립
- **생산 지시**: 생산 계획 기반 작업 지시
- **생산 현황**: 계획 대비 실시간 생산 진행률 모니터링

### 📦 재고 관리
- **재고 조정**: 입출고 및 재고 조정 내역 관리
- **재고 현황**: 제품별 실시간 재고 상태 조회
- **입고 관리**: 자재/제품 입고 처리

### 🚚 출하/납품 관리
- **출하 관리**: 제품 출하 계획 및 실행
- **납품 관리**: 고객사 납품 처리 및 추적

### ✅ 품질 관리
- **품질 검사**: 제품 품질 검사 기록 및 관리
- **불합격품 추적**: 불량 원인 분석

### 🏷️ 클레임 관리
- **클레임 접수**: 고객 클레임 등록 및 분류
- **처리 현황**: 클레임 진행 상태 추적
- **보상 관리**: 클레임 보상 내역 관리

### 👥 마스터 데이터
- **제품 정보**: 제품 마스터 데이터 관리
- **고객 정보**: 거래처 정보 관리
- **직원 정보**: 작업자 및 담당자 정보 관리
- **거래처 정보**: 공급업체 및 협력사 관리

## 🛠️ 기술 스택

- **Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 7.9.1
- **Styling**: Tailwind CSS 4.1.13
- **Charts**: Recharts 3.2.0
- **Calendar**: React Calendar 6.0.0
- **Date Utils**: date-fns 4.1.0

## 📁 프로젝트 구조

```
mes-fe/
├── src/
│   ├── api/                    # API 통신 모듈
│   │   ├── claimInfoApi.ts     # 클레임 관리 API
│   │   ├── customerApi.ts      # 고객 정보 API
│   │   ├── deliveryApi.ts      # 납품 관리 API
│   │   ├── employeeApi.ts      # 직원 정보 API
│   │   ├── inventoryInfoApi.ts # 재고 조정 API
│   │   ├── inventoryStatusApi.ts # 재고 현황 API
│   │   ├── orderApi.ts         # 수주 관리 API
│   │   ├── productApi.ts       # 제품 정보 API
│   │   ├── productionOrderApi.ts # 생산 지시 API
│   │   ├── productionPlanApi.ts  # 생산 계획 API
│   │   ├── productionStatusApi.ts # 생산 현황 API
│   │   ├── qualityInfoApi.ts   # 품질 검사 API
│   │   ├── shipmentApi.ts      # 출하 관리 API
│   │   └── warehouseApi.ts     # 입고 관리 API
│   │
│   ├── component/              # 재사용 가능한 컴포넌트
│   │   ├── common/             # 공통 컴포넌트 (버튼, 폼, 모달, 테이블)
│   │   ├── calendar/           # 캘린더 및 이벤트 모달
│   │   ├── charts/             # 차트 컴포넌트
│   │   ├── layout/             # 레이아웃 (헤더, 사이드바, 푸터)
│   │   ├── claim/              # 클레임 관련 컴포넌트
│   │   ├── customer/           # 고객 관련 컴포넌트
│   │   ├── delivery/           # 납품 관련 컴포넌트
│   │   ├── employee/           # 직원 관련 컴포넌트
│   │   ├── inventory/          # 재고 조정 컴포넌트
│   │   ├── inventoryStatus/    # 재고 현황 컴포넌트
│   │   ├── ordering/           # 발주 관련 컴포넌트
│   │   ├── orderReceipt/       # 수주 관련 컴포넌트
│   │   ├── product/            # 제품 관련 컴포넌트
│   │   ├── productionOrder/    # 생산 지시 컴포넌트
│   │   ├── productionPlan/     # 생산 계획 컴포넌트
│   │   ├── productionStatus/   # 생산 현황 컴포넌트
│   │   ├── quality/            # 품질 검사 컴포넌트
│   │   ├── shipment/           # 출하 관련 컴포넌트
│   │   └── warehouse/          # 입고 관련 컴포넌트
│   │
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── dashboard.tsx       # 대시보드
│   │   ├── claimInfo.tsx       # 클레임 관리 (조회 + CRUD)
│   │   ├── customerInfo.tsx    # 고객 정보 관리
│   │   ├── deliveryInfo.tsx    # 납품 관리 (조회 + CRUD)
│   │   ├── employeeInfo.tsx    # 직원 정보 관리
│   │   ├── inventoryInfo.tsx   # 재고 조정 (조회 + CRUD)
│   │   ├── inventoryStatusInfo.tsx # 재고 현황 (조회 전용)
│   │   ├── orderingInfo.tsx    # 발주 관리
│   │   ├── orderReceiptInfo.tsx # 수주 관리
│   │   ├── orderWarehouseStatusInfo.tsx # 발주입고 현황 (조회 + 검색)
│   │   ├── productInfo.tsx     # 제품 정보 관리
│   │   ├── productionOrderInfo.tsx # 생산 지시 (조회 + CRUD)
│   │   ├── productionPlanInfo.tsx  # 생산 계획 (조회 + CRUD)
│   │   ├── productionStatusInfo.tsx # 생산 현황 (조회 전용)
│   │   ├── qualityInfo.tsx     # 품질 검사 (조회 + CRUD)
│   │   ├── shipmentInfo.tsx    # 출하 관리 (조회 + CRUD)
│   │   └── warehouseInfo.tsx   # 입고 관리 (조회 + CRUD)
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   ├── claim.ts
│   │   ├── customer.ts
│   │   ├── delivery.ts
│   │   ├── employee.ts
│   │   ├── inventory.ts
│   │   ├── inventoryStatus.ts
│   │   ├── ordering.ts
│   │   ├── orderReceipt.ts
│   │   ├── product.ts
│   │   ├── productionOrder.ts
│   │   ├── productionPlan.ts
│   │   ├── productionStatus.ts
│   │   ├── quality.ts
│   │   ├── shipment.ts
│   │   └── warehouse.ts
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── env.ts              # 환경 변수 관리
│   │   └── logger.ts           # 로깅 유틸
│   │
│   ├── App.tsx                 # 루트 컴포넌트
│   ├── main.tsx                # 엔트리 포인트
│   └── index.css               # 글로벌 스타일
│
├── public/                     # 정적 파일
├── dist/                       # 빌드 결과물
├── vite.config.ts              # Vite 설정
├── tsconfig.json               # TypeScript 설정
├── vercel.json                 # Vercel 배포 설정
└── package.json                # 프로젝트 의존성

```

## 🎯 주요 기능 상세

### CRUD 패턴
대부분의 관리 페이지는 다음과 같은 패턴을 따릅니다:

- **페이지 (Page)**: 데이터 조회 및 표시, 삭제 처리
- **모달 (Modal)**: 생성(Create) 및 수정(Update) 로직 포함
- **검색 모달**: 연관 데이터 검색 및 자동 입력

### 검색 기능 통합
- **출하 관리**: 수주 검색 모달 → 수주 정보 자동 입력
- **납품 관리**: 출하 검색 모달 → 출하 정보 자동 입력
- **생산 계획**: 제품 검색 모달 → 제품 정보 자동 입력
- **생산 지시**: 생산 계획 검색 모달 → 계획 정보 자동 입력
- **품질 검사**: 제품 검색 모달 → 제품 정보 자동 입력
- **클레임 관리**: 수주 검색 모달 → 수주/제품 정보 자동 입력
- **재고 조정**: 제품 검색 모달 → 제품 정보 자동 입력

### 조회 전용 페이지
- **생산 현황**: 생산 계획 대비 진행률 모니터링
- **재고 현황**: 제품별 재고 상태 실시간 조회
- **발주입고 현황**: 발주 대비 입고율 통합 조회

## 🔧 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- npm 9.x 이상

### 설치
```bash
# 의존성 설치
npm install
```

### 개발 서버 실행
```bash
# 로컬 개발 서버 (http://localhost:3000)
npm run dev
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 린트
```bash
# ESLint 실행
npm run lint
```

## 🌐 배포

### Vercel 배포

**자동 배포 (권장)**
1. GitHub에 코드 푸시
2. Vercel이 자동으로 빌드 및 배포

**수동 배포**
```bash
npm run build
vercel --prod
```

### 환경 변수
Vercel Dashboard에서 다음 환경 변수를 설정할 수 있습니다:

```bash
VITE_API_BASE_URL=https://mes-be-production.up.railway.app
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error
```

**참고**: Railway 백엔드 URL은 이미 `vercel.json`과 `vite.config.ts`에 설정되어 있습니다.

## 🔗 백엔드 연결

### Railway 백엔드
- **URL**: https://mes-be-production.up.railway.app
- **API Proxy**: `/api/*` 요청이 자동으로 Railway 백엔드로 전달됩니다

### API 엔드포인트 예시
```
GET  /api/orders          # 수주 목록 조회
POST /api/orders          # 수주 생성
PATCH /api/orders/:id     # 수주 수정
DELETE /api/orders/:id    # 수주 삭제
```

## 📊 데이터 플로우

```
사용자 → 페이지 컴포넌트 → API 모듈 → Railway 백엔드
                ↓
            모달 컴포넌트 (CRUD)
                ↓
            검색 모달 (자동 입력)
```

## 🎨 UI/UX 특징

### 색상 테마
각 기능별로 구분된 색상 테마를 사용합니다:
- **수주**: 파란색 (#3b82f6)
- **발주**: 주황색 (#f97316)
- **생산 계획**: 파란색 (#3b82f6)
- **생산 지시**: 주황색 (#f59e0b)
- **출하**: 빨간색 (#dc2626)
- **납품**: 녹색 (#10b981)
- **품질**: 청록색 (#06b6d4)
- **클레임**: 빨간색 (#dc2626)
- **재고**: 보라색 (#7c3aed)
- **제품**: 주황색 (#f59e0b)

### 반응형 디자인
- 데스크톱 최적화 (1280px 이상)
- 통계 카드: Auto-fit 그리드 레이아웃
- 테이블: 가로 스크롤 지원

### 사용자 경험
- **천 단위 구분**: 모든 숫자 필드에 자동 쉼표 적용
- **실시간 검증**: 필수 필드 입력 검증
- **로딩 상태**: API 호출 시 로딩 인디케이터 표시
- **에러 처리**: 사용자 친화적인 에러 메시지
- **성공 알림**: CRUD 작업 완료 시 알림 표시

## 🔍 주요 페이지별 기능

### 출하 관리 (shipmentInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 CRUD 처리
- ✅ 수주 검색 모달 통합
- ✅ 선택 시 자동 입력: 수주ID, 고객명, 품목코드, 품목명, 수량

### 납품 관리 (deliveryInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 CRUD 처리
- ✅ 출하 검색 모달 통합
- ✅ 선택 시 자동 입력: 출하ID, 고객명

### 생산 계획 (productionPlanInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 생성/수정 처리
- ✅ 제품 검색 모달 통합
- ✅ 삭제는 페이지에서 처리

### 생산 지시 (productionOrderInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 생성/수정 처리
- ✅ 생산 계획 검색 모달 통합
- ✅ 선택 시 자동 입력: 계획ID, 제품코드, 제품명, 지시수량

### 생산 현황 (productionStatusInfo)
- ✅ 조회 전용 페이지 (CRUD 없음)
- ✅ 생산 계획 대비 진행률 계산
- ✅ 품질률, 효율성 자동 계산

### 품질 검사 (qualityInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 CRUD 처리
- ✅ 제품 검색 모달 통합
- ✅ 평균 합격률 자동 계산

### 클레임 관리 (claimInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 CRUD 처리
- ✅ 수주 검색 모달 통합
- ✅ 선택 시 자동 입력: 고객명, 제품코드, 제품명, 주문번호
- ✅ 총 보상금액 자동 계산

### 재고 조정 (inventoryInfo)
- ✅ 조회 전용 페이지
- ✅ 모달에서 CRUD 처리
- ✅ 제품 검색 모달 통합
- ✅ 선택 시 자동 입력: 제품코드, 제품명, 공급업체
- ✅ 재주문점 필드 제거

### 재고 현황 (inventoryStatusInfo)
- ✅ 조회 전용 페이지 (CRUD 없음)
- ✅ API 응답 구조 기반 표시
- ✅ Summary 데이터 통계 카드 표시

### 발주입고 현황 (orderWarehouseStatusInfo)
- ✅ 조회 전용 페이지
- ✅ 발주/입고 통합 테이블
- ✅ 검색 기능: 발주ID, 공급업체, 제품명
- ✅ 기간 필터: 최근 1주/3주/전체

### 제품 정보 (productInfo)
- ✅ 제품 마스터 관리
- ✅ 재고 정보는 `inventoryDetail` 중첩 객체로 표시
- ✅ 모달에서 재고 필드 제거 (재고는 재고 관리 메뉴에서 관리)

## 🔐 보안

- 환경 변수 기반 설정
- CORS 설정
- API 요청 타임아웃 및 재시도 로직

## 📱 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 🐛 문제 해결

### 빌드 오류
```bash
# 캐시 삭제
rm -rf node_modules dist
npm install
npm run build
```

### API 연결 오류
1. Railway 백엔드가 실행 중인지 확인: https://mes-be-production.up.railway.app
2. CORS 설정 확인
3. 브라우저 개발자 도구 Network 탭에서 요청 확인

### 로컬 개발 시 API 연결
```bash
# vite.config.ts의 proxy 설정이 자동으로 Railway 백엔드로 연결합니다
npm run dev
```

## 📚 참고 문서

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)

## 👥 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is private and proprietary.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Built with ❤️ using React + TypeScript + Vite**
