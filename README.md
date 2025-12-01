# Realtime Assist Agent - Frontend

React 기반 AI 상담 어시스턴트 프론트엔드 (음성 통화 전용)

## 페이지 구조

### 메인 페이지 (`/`)
- **AssistantMain**: AI 상담 어시스턴트 대시보드
- 카드 기반 레이아웃 (고객 정보, 실시간 대화, AI 추천 답변)
- 고객 정보 카드에서 통화 시작/종료
- 실시간 STT 트랜스크립트 표시
- AI 추천 답변 및 FAQ 제공

## 주요 컴포넌트

### `AssistantMain.jsx`
- AI 상담 어시스턴트 메인 대시보드
- WebRTC 음성 통화 + STT + AI 추천을 하나의 화면에 통합
- 3단 그리드 레이아웃 (좌: 고객정보, 중앙: 대화, 우: AI 추천)

### `App.jsx`
- React Router 기반 라우팅 설정
- 비밀번호 인증 관리

## 실행 방법

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## URL

- 메인 대시보드: http://localhost:3000/

## 스타일링

- `AssistantMain.css`: 대시보드 전용 스타일
- `App.css`: 공통 스타일

## 디자인 참고

- `design/dashboard.html`: Tailwind CSS 기반 디자인 프로토타입
