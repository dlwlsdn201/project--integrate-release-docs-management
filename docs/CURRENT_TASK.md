# Current Task — Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면

## 0. 작업 요약

ReleaseHub의 첫 화면으로 사용할 SPA 기본 구조를 만든다.

Unit 1에서 정의한 release 도메인 타입, mock 데이터, 문서 생성 순수 함수를 화면에서 소비하여 릴리즈 목록과 릴리즈 상세 기본 화면을 구성한다. 이번 작업은 화면 뼈대와 정보 구조 확인이 목적이며, 실제 API 연동이나 릴리즈 항목 등록 폼은 구현하지 않는다.

## 1. 반드시 읽을 문서

- `AGENTS.md`
- `PRD.mdc`
- `docs/README.md`
- `docs/PROJECT_GUIDE.md`
- `docs/CURRENT_TASK.md`
- `docs/WORK_LOG.md`
- `docs/REVIEW_LOG.md`
- `docs/SESSION_STATE.md`
- `.rules/project-rules_architecture.mdc`
- `.rules/project-rules_working.mdc`
- `.rules/project-rules_naming.mdc`
- `.rules/project-rules_testing-policy.mdc`

## 2. 작업 범위

### 포함

- 앱 레이아웃 구성
- 릴리즈 목록 화면 구성
  - 버전
  - 상태
  - 포함 이슈 수
  - QC 진행률
- 릴리즈 상세 화면 구성
  - Overview
  - CHANGELOG
  - QC Checklist
  - Release Note
  - Announcement 탭
- Unit 1의 `entities/release` public API 기반 mock 데이터 연결
- Unit 1의 문서 생성 순수 함수 결과를 상세 탭에 표시
- 기본 반응형 레이아웃 적용
- 핵심 화면 동작을 확인하는 최소 RTL 테스트 작성

### 제외

- 릴리즈 항목 등록/수정 폼
- GitLab Issue/MR URL 입력 또는 import UX
- QC 상태 변경
- 실패 사유 입력
- CSV/HTML/JSON export
- clipboard 복사 기능
- TanStack Query/MSW 연동
- 실제 GitLab/Google Drive API 연동
- 새 라우팅 라이브러리 도입
- 커밋

## 3. 예상 변경 파일

### 신규 후보

- `src/pages/release-list/index.ts`
- `src/pages/release-list/ui/ReleaseListPage.tsx`
- `src/pages/release-detail/index.ts`
- `src/pages/release-detail/ui/ReleaseDetailPage.tsx`
- `src/widgets/release-list/index.ts`
- `src/widgets/release-list/ui/ReleaseListPanel.tsx`
- `src/widgets/release-detail/index.ts`
- `src/widgets/release-detail/ui/ReleaseDetailPanel.tsx`
- `src/widgets/release-document-tabs/index.ts`
- `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx`
- 필요한 경우 `src/shared/lib/` 또는 `src/shared/ui/` 하위의 작은 공통 유틸/표시 컴포넌트

### 수정 후보

- `src/app/App.tsx`
- `src/app/App.test.tsx`
- `src/pages/index.ts`
- `src/widgets/index.ts`
- `docs/WORK_LOG.md`
- `docs/SESSION_STATE.md`

## 4. 구현 규칙

- 패키지 매니저는 `pnpm`을 사용한다.
- FSD 레이어 규칙을 지킨다.
- `app`은 페이지 조합과 최소 라우팅만 담당한다.
- `pages`는 화면 단위 조합을 담당한다.
- `widgets`는 릴리즈 목록/상세/문서 탭 UI 블록을 담당한다.
- `widgets`와 `pages`는 `entities/release` 내부 파일을 deep import하지 말고 public API인 `@entities/release` 또는 `@entities`를 통해 import한다.
- `entities` 내부 구현 파일을 Unit 2에서 임의 리팩터링하지 않는다.
- 라우팅은 새 라이브러리를 추가하지 않고 hash 또는 URLSearchParams 기반의 최소 구현으로 처리한다.
- 상세 탭 상태는 가능하면 URL에 남겨 새로고침 후에도 복구되게 한다. 구현 부담이 과하면 local state로 시작하고 `WORK_LOG.md`에 후속 리스크로 남긴다.
- React 19 기준으로 불필요한 `import React`를 작성하지 않는다.
- `useMemo`, `useCallback`, `React.memo`는 사용하지 않는다.
- `any`를 사용하지 않는다.
- 하드코딩된 표시 문자열이 반복되면 상수로 분리한다.
- Tailwind CSS를 사용하고 다른 스타일링 방식을 혼합하지 않는다.
- 업무 도구형 화면으로 구성한다. 과도한 랜딩 페이지, 큰 hero 섹션, 장식 위주의 카드 레이아웃은 피한다.
- UI 테스트는 사용자 관점의 텍스트/role 기반으로 작성하고, 스타일/CSS 클래스/스냅샷은 테스트하지 않는다.

## 5. 테스트 및 검증

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

## 6. 완료 기준

- 릴리즈 목록 화면에서 버전, 상태, 이슈 수, QC 진행률을 볼 수 있다.
- 릴리즈 상세 화면에서 선택된 릴리즈의 기본 정보와 포함 항목을 볼 수 있다.
- 릴리즈 상세 화면에 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭이 있다.
- CHANGELOG, QC Checklist, Release Note, Announcement 탭은 Unit 1 순수 함수 결과를 사용한다.
- FSD 레이어 역참조와 deep import가 없다.
- 핵심 화면 렌더링 또는 탭 전환 흐름이 RTL 테스트로 검증된다.
- `pnpm lint`가 통과한다.
- `pnpm test`가 통과한다.
- `pnpm typecheck`가 통과한다.
- `pnpm build`가 통과한다.
- `WORK_LOG.md`에 Unit 2 결과가 기록된다.
- `SESSION_STATE.md`가 최신 상태로 갱신된다.

## 7. Claude Code 지시 프롬프트

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면을 구현해라.

작업 전 반드시 다음 문서를 읽어라.
- AGENTS.md
- PRD.mdc
- docs/README.md
- docs/PROJECT_GUIDE.md
- docs/CURRENT_TASK.md
- docs/WORK_LOG.md
- docs/REVIEW_LOG.md
- docs/SESSION_STATE.md
- .rules/project-rules_architecture.mdc
- .rules/project-rules_working.mdc
- .rules/project-rules_naming.mdc
- .rules/project-rules_testing-policy.mdc

목표:
ReleaseHub의 주요 정보 구조를 확인할 수 있는 SPA 화면 뼈대를 만든다.

범위:
- 앱 레이아웃과 릴리즈 목록/상세 기본 화면을 구성한다.
- 릴리즈 목록에서 버전, 상태, 이슈 수, QC 진행률을 표시한다.
- 릴리즈 상세 화면에 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭을 구성한다.
- Unit 1의 entities/release public API, mock release 데이터, 문서 생성 순수 함수를 사용한다.
- 핵심 화면 렌더링 또는 탭 전환 흐름을 테스트한다.

제외:
- 릴리즈 항목 등록/수정 폼 구현
- GitLab import UX 구현
- QC 상태 변경
- export/clipboard 구현
- 실제 API 연동
- TanStack Query/MSW 연동
- 새 라우팅 라이브러리 도입

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

## 8. 완료 보고 형식

작업 완료 후 `WORK_LOG.md`에 아래 항목을 기록한다.

- 작업 일자
- 작업 단위명
- 작업 브랜치
- 변경 파일
- 구현 내용
- 검증 결과
- 남은 리스크
- 리뷰 요청 포인트
