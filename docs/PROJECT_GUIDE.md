# Project Guide — ReleaseHub 작업 기준

## 0. 문서 목적

이 문서는 ReleaseHub 프로토타입의 개발 작업 기준을 정의한다. AI 모델은 작업 전 이 문서를 읽고 범위, 아키텍처 원칙, 작업 단위, 리뷰 기준을 확인한다.

## 1. 프로젝트 목적

ReleaseHub는 GitLab 기반 개발 흐름에서 발생하는 릴리즈 정보를 하나의 원본 데이터로 관리하고, 다음 산출물을 자동 생성하는 SPA 프로토타입이다.

- 모든 사용자용 CHANGELOG
- 개발자/테스터용 QC 테스트 케이스
- 모든 사용자용 릴리즈 노트
- 전사 메신저 공지문
- 추후 Google Drive 백업용 export 데이터

핵심 목표는 하나의 이슈 작업 완료 후 작업자가 3개의 문서를 각각 수기로 작성하던 흐름을 하나의 입력 흐름으로 통합하는 것이다.

## 2. 포함 범위

- React 19 + TypeScript + Vite 기반 SPA 프로토타입
- FSD 기반 디렉토리 구조
- mock GitLab 데이터 기반 릴리즈 항목 등록 흐름
- 릴리즈 버전 목록/상세 화면
- CHANGELOG, QC Checklist, Release Note, Announcement 미리보기
- React Hook Form + Zod 기반 릴리즈 항목 폼
- TanStack Query/MSW 기반 mock API 흐름
- CSV/HTML/clipboard 수준의 export 또는 복사 UX
- 핵심 순수 함수 및 주요 사용자 흐름 테스트

## 3. 제외 범위

- 실제 GitLab OAuth 로그인
- 실제 GitLab API 연동
- 실제 Google Drive API 연동
- 사내 메신저 자동 발송
- 실시간 협업 편집
- 복잡한 권한 관리
- AI 기반 문장 자동 생성
- 백엔드 서버 구현

## 4. 기술 및 아키텍처 원칙

- React 19에서는 불필요한 `import React`를 작성하지 않는다.
- TypeScript를 기본으로 사용하고 `any`를 금지한다.
- Vite/Vitest 기반으로 구성한다.
- 패키지 매니저는 `pnpm`을 사용한다.
- FSD 레이어는 `apps > pages > widgets > features > entities > shared` 순서를 따른다.
- 외부 노출은 각 슬라이스의 `index.ts`를 우선한다.
- API 흐름은 `entities/*/api` 순수 fetcher, `entities/*/hook` TanStack Query hook, `features/*/ui` 소비 구조를 따른다.
- 조회는 Suspense + Boundary 기반을 지향한다.
- 폼은 React Hook Form과 Zod를 사용한다.
- 서버 상태는 TanStack Query, 필터/탭 상태는 searchParams 또는 Jotai, 로컬 UI 상태는 `useState`를 사용한다.
- 스타일링은 프로젝트 Primary 스타일링 도구 하나를 선택한 뒤 혼합하지 않는다. MVP 기본값은 Tailwind CSS다.
- 상수, API 계약, 타입, 비즈니스 규칙은 SSOT로 둔다.
- 범위 밖 리팩터링과 전체 포맷 변경은 금지한다.

상세 규칙은 루트 `AGENTS.md`, `.rules`, `.skills`, `.agents` 문서를 따른다.

## 5. 작업 단위 분해

| Unit | 목적 | 우선순위 | 상태 |
| --- | --- | --- | --- |
| Unit 0 | Vite React 19 프로젝트 스캐폴딩 및 기본 개발 환경 구성 | P0 | Ready |
| Unit 1 | 릴리즈 도메인 모델, mock 데이터, 문서 생성 순수 함수 구성 | P0 | Draft |
| Unit 2 | 앱 레이아웃, 라우팅, 릴리즈 목록/상세 기본 화면 구성 | P0 | Draft |
| Unit 3 | 릴리즈 항목 등록/수정 폼 및 GitLab mock import 흐름 구현 | P0 | Draft |
| Unit 4 | CHANGELOG, QC Checklist, Release Note, Announcement 미리보기 구현 | P0 | Draft |
| Unit 5 | QC 체크리스트 상태 변경 및 실패 사유 입력 UX 구현 | P1 | Draft |
| Unit 6 | 공지문 복사, CSV/HTML export, 릴리즈 데이터 JSON export 구현 | P1 | Draft |
| Unit 7 | 반응형 UI, 접근성, 빈 상태/에러 상태, 시각적 완성도 보완 | P1 | Draft |
| Unit 8 | 테스트 보강, README 실행 가이드, 작업 로그/세션 문서 정리 | P1 | Draft |

## 6. 단위별 완료 기준

### Unit 0 — 프로젝트 스캐폴딩

- Vite + React + TypeScript 앱이 실행된다.
- ESLint, Prettier, Vitest, Testing Library 기본 구성이 존재한다.
- Tailwind CSS 또는 선택한 Primary 스타일링 도구가 설정된다.
- FSD 기본 디렉토리와 alias import가 준비된다.
- `pnpm lint`, `pnpm test`, `pnpm typecheck`에 준하는 검증 명령이 정의된다.

### Unit 1 — 도메인 모델과 mock 데이터

- Release, ReleaseItem, QCTestCase 등 핵심 타입이 정의된다.
- 릴리즈 상태, 변경 유형, 테스트 상태는 상수/타입의 SSOT로 관리된다.
- mock GitLab issue/MR 데이터와 mock release 데이터가 분리된다.
- CHANGELOG, QC, Release Note, Announcement 생성에 필요한 순수 함수가 존재한다.
- 순수 함수 테스트가 작성된다.

### Unit 2 — 기본 화면

- 릴리즈 목록 화면에서 버전, 상태, 이슈 수, QC 진행률을 볼 수 있다.
- 릴리즈 상세 화면에 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭이 있다.
- 라우팅과 페이지 조합은 FSD 규칙을 위반하지 않는다.

### Unit 3 — 릴리즈 항목 폼

- GitLab Issue/MR URL 또는 mock 선택으로 기본 정보가 채워진다.
- 릴리즈 항목 필드를 React Hook Form + Zod로 검증한다.
- 성공 시 릴리즈 상세 데이터에 항목이 반영된다.
- Dialog 실패 시 모달을 유지하고, 성공 시에만 닫는다.

### Unit 4 — 문서 미리보기

- 같은 원본 데이터로 CHANGELOG, QC Checklist, Release Note, Announcement가 생성된다.
- CHANGELOG는 Major/Minor/Bugfix 등 변경 유형별로 그룹핑된다.
- 릴리즈 노트는 일반 사용자가 읽기 쉬운 카드/섹션 구조로 표시된다.
- 공지문은 복사 가능한 텍스트 형태로 제공된다.

### Unit 5 — QC UX

- 테스트 상태를 Not Started, Passed, Failed, Blocked로 변경할 수 있다.
- Failed/Blocked 상태에서는 사유를 입력할 수 있다.
- QC 진행률이 릴리즈 목록/상세에 반영된다.

### Unit 6 — Export

- CHANGELOG/QC는 CSV로 export할 수 있다.
- 릴리즈 노트는 HTML로 export할 수 있다.
- 전체 릴리즈 데이터는 JSON으로 export할 수 있다.
- 공지문은 clipboard 복사 UX를 제공한다.

### Unit 7 — UI Polish

- 데스크톱과 모바일 주요 뷰에서 텍스트 겹침이 없다.
- 빈 상태, 에러 상태, 로딩 상태가 UX 흐름을 막지 않는다.
- 버튼, 탭, 폼 컨트롤, 상태 배지가 일관된 디자인 토큰을 사용한다.

### Unit 8 — 테스트/문서 정리

- 핵심 순수 함수와 핵심 feature 흐름 테스트가 존재한다.
- README에 실행 방법, 주요 기능, 구현 완료 범위가 업데이트된다.
- `WORK_LOG.md`, `SESSION_STATE.md`가 최신 상태다.

## 7. Definition of Done

- 요구사항과 구현 결과가 1:1로 추적 가능하다.
- 변경 범위가 `CURRENT_TASK.md`와 일치한다.
- 핵심 로직 또는 핵심 UI 흐름이 테스트로 검증된다.
- 변경 파일 기준 lint가 통과한다.
- 필요한 경우 typecheck를 실행하고 결과를 기록한다.
- 남은 리스크가 `WORK_LOG.md`에 기록된다.
- 리뷰 결과가 `REVIEW_LOG.md`에 기록된다.

## 8. 리뷰 기준

- 요구사항 누락 여부
- 아키텍처/레이어 의존성 위반 여부
- API, 데이터 계약, Mock 정합성
- 상태 관리와 캐시 무효화 정합성
- 에러/로딩/실패 UX 처리
- 테스트가 핵심 흐름을 방어하는지
- 임시 하드코딩, 타입 우회, 불필요한 TODO 잔존 여부

## 9. 모델별 역할

### GPT

- 프로젝트 관리
- 작업 계획 수립
- 기능 설계
- 작업 단위 분해
- 리뷰 및 피드백
- `PROJECT_GUIDE.md`, `CURRENT_TASK.md`, `NEXT_TASK_DRAFT.md`, `REVIEW_LOG.md`, `handoff/*` 갱신

### Claude Code

- 코드 구현
- 코드 수정 및 보완
- 검증 명령 실행
- `WORK_LOG.md`, `SESSION_STATE.md` 갱신

## 10. Claude Code 작업 원칙

- 작업 시작 전 `AGENTS.md`, `PRD.mdc`, `docs/PROJECT_GUIDE.md`, `docs/CURRENT_TASK.md`를 읽는다.
- `CURRENT_TASK.md` 범위를 벗어난 구현은 하지 않는다.
- 범위 밖 개선이 필요하면 `WORK_LOG.md`의 남은 리스크나 후속 제안으로 남긴다.
- 작업 완료 후 검증 명령을 실행하고, 실패 시 기존 실패와 신규 실패를 구분해 기록한다.
- 작업 완료 또는 중단 전 `WORK_LOG.md`와 `SESSION_STATE.md`를 갱신한다.
