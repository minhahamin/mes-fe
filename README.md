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

# 개발 서버 실행
npm run dev

# 빌드
npm run build
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
