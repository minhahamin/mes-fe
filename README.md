# MES-FE (Manufacturing Execution System Frontend)

제조 실행 시스템의 프론트엔드 프로젝트입니다.

## 프로젝트 개요

이 프로젝트는 제조업체의 생산 관리, 품질 관리, 재고 관리 등을 위한 웹 기반 시스템의 프론트엔드입니다.

## 기술 스택

- React
- TypeScript
- Tailwind CSS

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 실제 값으로 설정

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 환경 변수 설정

프로젝트를 실행하기 전에 환경 변수를 설정해야 합니다.

### 1. 환경 변수 파일 생성
```bash
cp env.example .env
```

### 2. 필수 환경 변수 설정
`.env` 파일에서 다음 변수들을 설정하세요:

#### API 설정
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/ws
```

#### MES 시스템 설정
```env
VITE_MES_COMPANY_NAME=Your Company
VITE_MES_FACILITY_ID=FAC001
VITE_MES_QUALITY_THRESHOLD=95
```

#### 개발/프로덕션 설정
```env
VITE_ENVIRONMENT=development
VITE_ENABLE_DEBUG_MODE=true
```

### 3. 환경별 설정

#### 개발 환경
```env
VITE_ENVIRONMENT=development
VITE_ENABLE_DEBUG_MODE=true
VITE_MOCK_API=true
```

#### 프로덕션 환경
```env
VITE_ENVIRONMENT=production
VITE_ENABLE_DEBUG_MODE=false
VITE_MOCK_API=false
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. 환경 변수 사용법

```typescript
import { env } from '@/utils/env';

// 기본 사용법
const apiUrl = env.get('API_BASE_URL');
const isDebug = env.isDebugMode();

// MES 특화 메서드
const companyName = env.getCompanyName();
const qualityThreshold = env.getQualityThreshold();
```

## 프로젝트 구조

```
mes-fe/
├── public/                    # 정적 파일들
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/                       # 소스 코드
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   └── Form/
│   │   ├── layout/           # 레이아웃 컴포넌트
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── Footer/
│   │   └── features/         # 기능별 컴포넌트
│   │       ├── production/
│   │       ├── quality/
│   │       └── inventory/
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── Dashboard/
│   │   ├── Production/
│   │   ├── Quality/
│   │   ├── Inventory/
│   │   └── Settings/
│   ├── hooks/                # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── services/             # API 서비스
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── productionService.ts
│   ├── store/                # 상태 관리 (Redux/Zustand)
│   │   ├── slices/
│   │   ├── store.ts
│   │   └── types.ts
│   ├── utils/                # 유틸리티 함수
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/                # TypeScript 타입 정의
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── production.ts
│   ├── styles/               # 스타일 파일
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── variables.css
│   ├── assets/               # 정적 자산
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx               # 메인 앱 컴포넌트
│   ├── main.tsx              # 앱 진입점
│   └── vite-env.d.ts         # Vite 타입 정의
├── .gitignore                # Git 무시 파일
├── .eslintrc.cjs             # ESLint 설정
├── .prettierrc               # Prettier 설정
├── index.html                # HTML 템플릿
├── package.json              # 프로젝트 의존성
├── tsconfig.json             # TypeScript 설정
├── tsconfig.node.json        # Node.js TypeScript 설정
├── vite.config.ts            # Vite 설정
└── README.md                 # 프로젝트 문서
```

## 개발자

민하
