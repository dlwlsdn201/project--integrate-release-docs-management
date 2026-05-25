# Next Task Draft — Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면

## 0. 문서 목적

이 문서는 Unit 1 완료 후 착수할 다음 작업 후보를 정리한다. Unit 1 리뷰가 PASS 또는 PASS WITH WARNINGS 상태가 되면 이 내용을 `CURRENT_TASK.md`로 승격한다.

## 1. 다음 작업 후보

Unit 2 — 앱 레이아웃, 라우팅, 릴리즈 목록/상세 기본 화면 구성

## 2. 선행 작업과의 연결점

- Unit 0에서 생성된 Vite/React/FSD 구조를 사용한다.
- Unit 1에서 정의한 release 도메인 타입, mock 데이터, 문서 생성 순수 함수를 화면에서 소비한다.
- 아직 실제 API/TanStack Query/MSW는 도입하지 않는다.

## 3. 예상 범위

### 포함 후보

- 앱 레이아웃 구성
- 릴리즈 목록 화면 구성
- 릴리즈 상세 화면 구성
- Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭 UI 뼈대 구성
- Unit 1 mock release 데이터 연결
- 릴리즈 버전, 상태, 포함 이슈 수, QC 진행률 표시
- 기본 반응형 레이아웃 적용

### 제외 후보

- 릴리즈 항목 등록/수정 폼
- QC 상태 변경
- CSV/HTML export
- TanStack Query/MSW 연동
- 실제 API 연동
- 복잡한 권한 관리

## 4. 설계 메모

- 화면 조합은 FSD 규칙에 맞춰 `pages`, `widgets`, `features`, `entities`, `shared` 역할을 분리한다.
- 도메인 순수 함수는 `entities/release` Public API를 통해 import한다.
- 라우팅은 Vite SPA에 맞는 최소 구조로 시작한다. 복잡한 라우터 도입은 필요한 경우에만 한다.
- UI는 Tailwind CSS를 사용한다.
- 카드 과다 사용보다 업무 도구형 밀도와 가독성을 우선한다.

## 5. 착수 전 결정 필요 사항

1. Unit 1의 export 구조 확인
2. 라우팅 라이브러리 도입 여부 결정
3. 릴리즈 상세 탭 상태를 local state로 둘지 searchParams로 둘지 결정

## 6. 예상 검증

```bash
pnpm lint
```

```bash
pnpm test
```

```bash
pnpm typecheck
```

```bash
pnpm build
```

## 7. Claude Code 지시 프롬프트 초안

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면을 구현해라.

작업 전 반드시 AGENTS.md, PRD.mdc, docs/PROJECT_GUIDE.md, docs/CURRENT_TASK.md, docs/WORK_LOG.md, docs/REVIEW_LOG.md, docs/SESSION_STATE.md를 읽어라.

목표:
ReleaseHub의 주요 정보 구조를 확인할 수 있는 SPA 화면 뼈대를 만든다.

범위:
- 앱 레이아웃과 릴리즈 목록/상세 기본 화면을 구성한다.
- 릴리즈 상세 화면에 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭을 구성한다.
- Unit 1의 mock release 데이터를 사용한다.

제외:
- 릴리즈 항목 등록 폼 구현
- QC 상태 변경
- export 구현
- 실제 API 연동
- TanStack Query/MSW 연동

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후:
- docs/WORK_LOG.md에 작업 결과를 기록해라.
- docs/SESSION_STATE.md를 최신 상태로 갱신해라.
- 커밋은 하지 마라.
```
