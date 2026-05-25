# Current Task — Unit 3 릴리즈 항목 폼과 GitLab mock import 흐름

## 0. 작업 요약

ReleaseHub에서 릴리즈 상세 화면에 새 릴리즈 항목을 추가할 수 있는 폼 흐름을 구현한다.

Unit 1에서 만든 release/GitLab mock 데이터와 Unit 2에서 만든 목록/상세 화면을 연결하여, 사용자가 GitLab Issue/MR mock 데이터를 선택하거나 URL을 입력하면 기본 정보가 채워지고, React Hook Form + Zod 검증을 통과한 항목이 현재 릴리즈 상세 데이터에 반영되게 한다.

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

- React Hook Form + Zod 기반 릴리즈 항목 생성 폼 구현
- 필요한 폼 의존성 추가
  - `react-hook-form`
  - `zod`
  - `@hookform/resolvers`
- GitLab Issue/MR mock 데이터 선택 또는 URL 입력으로 기본 정보 채우기
- 릴리즈 항목 필드 검증
  - 이슈 번호 또는 티켓 번호
  - 제목
  - 릴리즈 버전/대상 releaseId
  - 변경 유형
  - 사용자 노출 여부
  - CHANGELOG 요약
  - 사용자용 설명
  - 테스트 시나리오
  - 기대 결과
  - 담당자
- 성공 시 현재 릴리즈 상세 데이터에 새 항목 반영
- 성공 시 폼 닫기 또는 초기화
- 실패 시 폼 유지 및 검증 메시지 표시
- Unit 2 Warning 중 접근성 보완 1개 처리
  - 릴리즈 목록의 `<tr onClick>`를 포커스 가능한 `<button>` 또는 `<a>` 기반 상호작용으로 개선
- 핵심 폼 흐름 테스트 작성
  - mock GitLab 선택 시 필드 자동 채움
  - 필수값 누락 시 검증 메시지 표시
  - 정상 제출 시 상세 화면 항목 추가

### 제외

- 실제 GitLab API 연동
- TanStack Query/MSW 연동
- 백엔드 저장
- 릴리즈 항목 영구 저장
- 릴리즈 항목 삭제
- QC 상태 변경
- 실패 사유 입력
- 이미지 업로드
- CSV/HTML/JSON export
- clipboard 복사
- 복잡한 Dialog 시스템 또는 전역 modal store 도입
- 커밋

## 3. 예상 변경 파일

### 신규 후보

- `src/features/release-item-form/index.ts`
- `src/features/release-item-form/model/schema.ts`
- `src/features/release-item-form/model/types.ts`
- `src/features/release-item-form/model/mapGitlabToReleaseItemFormValues.ts`
- `src/features/release-item-form/ui/ReleaseItemForm.tsx`
- `src/features/release-item-form/ui/ReleaseItemForm.test.tsx`

필요 시:

- `src/shared/lib/createId.ts`
- `src/shared/lib/formatDate.ts`

### 수정 후보

- `package.json`
- `pnpm-lock.yaml`
- `src/app/App.tsx`
- `src/app/App.test.tsx`
- `src/features/index.ts`
- `src/pages/release-list/ui/ReleaseListPage.tsx`
- `src/pages/release-list/ui/ReleaseListPage.test.tsx`
- `src/pages/release-detail/ui/ReleaseDetailPage.tsx`
- `src/widgets/release-list/ui/ReleaseListPanel.tsx`
- `src/widgets/release-list/index.ts`
- `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx`
- `docs/WORK_LOG.md`
- `docs/SESSION_STATE.md`

## 4. 구현 규칙

- 패키지 매니저는 `pnpm`을 사용한다.
- FSD 레이어 규칙을 지킨다.
- 릴리즈 항목 생성 폼은 사용자 상호작용 기능이므로 `features/release-item-form`에 둔다.
- `features`는 `entities`와 `shared`만 import한다.
- `pages`는 `widgets`, `features`, `entities`를 조합한다.
- `widgets`는 `features`를 import할 수 있지만, 폼 제출 상태의 최종 소유자는 가능하면 `app` 또는 `page` 경계에 둔다.
- `entities/release` 내부 파일을 deep import하지 말고 public API인 `@entities/release` 또는 `@entities`를 통해 import한다.
- Unit 3에서는 실제 API fetcher/hook을 만들지 않는다.
- 폼 검증은 Zod schema를 SSOT로 삼고, React Hook Form resolver로 연결한다.
- 폼 제출 성공 시 생성되는 `ReleaseItem`은 기존 Unit 1 타입을 만족해야 한다.
- 새 항목의 `testCases`는 테스트 시나리오와 기대 결과가 모두 있을 때 1개 생성한다.
- 새 항목의 `id`와 test case `id`는 MVP 범위에서 deterministic하거나 충돌 가능성이 낮은 local id 생성 방식으로 처리한다.
- `any`를 사용하지 않는다.
- React 19 기준으로 불필요한 `import React`를 작성하지 않는다.
- `useMemo`, `useCallback`, `React.memo`는 사용하지 않는다.
- UI 테스트는 사용자 관점의 role/label/text 기반으로 작성하고, CSS 클래스나 스냅샷은 테스트하지 않는다.
- Tailwind CSS를 사용하고 다른 스타일링 방식을 혼합하지 않는다.
- Unit 2의 전체 화면 구조를 과도하게 재작성하지 않는다.

## 5. 테스트 및 검증

의존성 추가가 필요하면 먼저 실행한다.

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

그 뒤 아래 검증을 실행한다.

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

- 릴리즈 상세 화면에서 새 릴리즈 항목 생성 폼을 열 수 있다.
- GitLab mock issue 또는 MR 선택으로 제목, URL, 담당자, 릴리즈 버전 후보 등 기본 필드가 채워진다.
- URL 입력만으로도 매칭 가능한 mock issue/MR이 있으면 기본 필드가 채워진다.
- 필수 필드가 비어 있으면 제출되지 않고 검증 메시지가 표시된다.
- 정상 제출 시 현재 릴리즈 상세의 Overview/CHANGELOG/QC Checklist/Release Note/Announcement에 새 항목이 반영된다.
- 제출 실패 또는 검증 실패 시 폼이 유지된다.
- 릴리즈 목록의 상세 이동 인터랙션이 키보드 접근 가능한 요소로 개선된다.
- FSD 레이어 역참조와 deep import가 없다.
- 핵심 폼 흐름이 RTL 테스트로 검증된다.
- `pnpm lint`가 통과한다.
- `pnpm test`가 통과한다.
- `pnpm typecheck`가 통과한다.
- `pnpm build`가 통과한다.
- `WORK_LOG.md`에 Unit 3 결과가 기록된다.
- `SESSION_STATE.md`가 최신 상태로 갱신된다.

## 7. Claude Code 지시 프롬프트

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 3 릴리즈 항목 폼과 GitLab mock import 흐름을 구현해라.

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
릴리즈 상세 화면에서 GitLab mock issue/MR 데이터를 바탕으로 릴리즈 항목을 생성하고, 생성된 항목이 현재 릴리즈 상세 문서 탭에 즉시 반영되게 한다.

범위:
- React Hook Form + Zod 기반 릴리즈 항목 생성 폼을 구현한다.
- 필요한 의존성(`react-hook-form`, `zod`, `@hookform/resolvers`)이 없으면 pnpm으로 추가한다.
- GitLab Issue/MR mock 선택 또는 URL 입력으로 기본 정보를 채운다.
- 필수 필드 검증과 검증 메시지를 구현한다.
- 정상 제출 시 현재 릴리즈의 items 상태에 새 `ReleaseItem`을 추가한다.
- 생성된 항목은 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭에 반영되어야 한다.
- Unit 2 Warning 중 릴리즈 목록 `<tr onClick>` 접근성 문제를 함께 보완한다.
- 핵심 폼 흐름 RTL 테스트를 작성한다.

제외:
- 실제 API 연동
- TanStack Query/MSW 연동
- 백엔드 저장
- 릴리즈 항목 삭제
- QC 상태 변경
- 이미지 업로드
- export/clipboard 구현
- 복잡한 전역 modal/store 도입

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
