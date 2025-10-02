# Vercel 배포 가이드

## 📋 배포 전 체크리스트

✅ 빌드 성공 (`npm run build` 완료)
✅ tsconfig.json 설정 완료
✅ vercel.json 설정 완료

## 🔧 Vercel 환경 변수 설정

Vercel Dashboard → 프로젝트 → Settings → Environment Variables에서 아래 변수들을 설정하세요:

### 필수 환경 변수

```bash
# Railway 백엔드 URL (꼭 변경하세요!)
VITE_API_BASE_URL=https://your-railway-backend.railway.app

# WebSocket URL (필요시)
VITE_WEBSOCKET_URL=wss://your-railway-backend.railway.app/ws

# 프로덕션 설정
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error
VITE_ENABLE_DEBUG_MODE=false
VITE_MOCK_API=false

# API 타임아웃
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
```

### Railway 백엔드 URL 찾기

1. Railway 대시보드 접속
2. 백엔드 프로젝트 선택
3. Settings → Domains에서 URL 확인
4. 예: `https://mes-backend-production.up.railway.app`

## 📝 vercel.json 수정 필요

`vercel.json` 파일을 열어서 백엔드 URL을 수정하세요:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-railway-backend.railway.app/:path*"
      // ↑ 여기를 실제 Railway 백엔드 URL로 변경!
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🚀 배포 방법

### 방법 1: Vercel CLI (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동 (자동 배포)

1. GitHub에 코드 푸시
2. Vercel 대시보드에서 "Add New Project"
3. GitHub 저장소 선택
4. 환경 변수 설정
5. Deploy 클릭

## 🔍 배포 후 확인사항

1. ✅ 페이지가 정상적으로 로드되는지 확인
2. ✅ API 호출이 Railway 백엔드로 전달되는지 확인
3. ✅ 개발자 도구 Console에서 에러 확인
4. ✅ Network 탭에서 API 요청 확인

## ⚠️ 주의사항

- Railway 백엔드가 실행 중이어야 합니다
- Railway 백엔드에 CORS 설정이 필요할 수 있습니다:
  ```
  Access-Control-Allow-Origin: https://your-vercel-app.vercel.app
  ```
- API 엔드포인트가 `/api`로 시작하는지 확인하세요

## 🐛 문제 해결

### API 호출 실패 시

1. Railway 백엔드가 실행 중인지 확인
2. CORS 설정 확인
3. API URL이 올바른지 확인 (`https://` 포함)
4. Vercel 환경 변수가 저장되었는지 확인

### 빌드 실패 시

```bash
# 로컬에서 빌드 테스트
npm run build

# 캐시 삭제 후 재시도
rm -rf node_modules
npm install
npm run build
```

## 📌 참고 링크

- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway 도메인 설정](https://docs.railway.app/deploy/exposing-your-app)

