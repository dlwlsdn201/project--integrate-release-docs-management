# Work Log — 작업 결과 로그

## 0. 운영 규칙

- Claude Code는 단위 작업 완료 시 이 문서 상단에 결과를 추가한다.
- 변경 파일, 구현 내용, 검증 결과, 남은 리스크를 기록한다.
- 기존 오류와 신규 오류를 구분해 기록한다.
- 리뷰 결과 자체는 `REVIEW_LOG.md`에 기록한다.

## 1. 진행 현황

| Unit | 상태 | 담당 | 리뷰 상태 | 비고 |
| --- | --- | --- | --- | --- |
| Unit 0 | Done | Claude Code | PASS WITH WARNINGS | repo 루트 pnpm 검증 통과 |
| Unit 1 | Done | Claude Code | PASS WITH WARNINGS | 도메인 모델/mock/순수 함수 |
| Unit 2 | Done | Claude Code | PASS WITH WARNINGS | 목록/상세 기본 화면 |
| Unit 3 | Done | Claude Code/Codex | PASS | 릴리즈 항목 폼, 리뷰 Warning 보완 완료 |
| Unit 4 | Draft | Claude Code | 구현 전 | 문서 미리보기 |
| Unit 5 | Draft | Claude Code | 구현 전 | QC 상태 UX |
| Unit 6 | Draft | Claude Code | 구현 전 | Export/복사 |
| Unit 7 | Draft | Claude Code | 구현 전 | UI Polish |
| Unit 8 | Draft | Claude Code | 구현 전 | 테스트/문서 정리 |

## 2. 단위 작업 결과

---

## 2026-05-25 / Unit 3 보완 — 리뷰 Warning 처리와 종료

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `src/features/release-item-form/model/schema.ts` | 수정 | `CHANGE_CATEGORY` SSOT 기반 Zod enum 파생, 폼 전용 `gitlabSourceUrl` 추가 |
| `src/features/release-item-form/model/mapGitlabToReleaseItemFormValues.ts` | 수정 | 자동 채움 값 타입 export |
| `src/features/release-item-form/ui/ReleaseItemForm.tsx` | 수정 | Issue/MR URL 저장 필드 분리, 자동 채움 검증 상태 동기화, Issue/MR select controlled 처리 |
| `src/features/release-item-form/ui/ReleaseItemForm.test.tsx` | 수정 | MR URL 저장 계약, 자동 채움 후 에러 해소, select 동기화 회귀 테스트 추가 |
| `src/pages/release-detail/ui/ReleaseDetailPage.tsx` | 수정 | `releaseId` 변경 시 items/form state 재초기화 |
| `src/pages/release-detail/ui/ReleaseDetailPage.test.tsx` | 신규 | 상세 제출 후 문서 탭 반영, releaseId 변경 초기화 통합 테스트 |

### 보완 내용

- URL 직접 입력용 필드를 `gitlabSourceUrl`로 분리해 MR URL이 `ReleaseItem.gitlabIssueUrl`에 저장되지 않도록 수정.
- 자동 채움 `setValue`에 `{ shouldValidate: true, shouldDirty: true }`를 적용해 검증 에러가 즉시 해소되도록 수정.
- Issue/MR 드롭다운을 controlled 상태로 전환해 마지막 선택 기준이 UI에 일관되게 표시되도록 수정.
- Zod `category` enum을 `CHANGE_CATEGORY` 상수에서 파생해 변경 유형 SSOT 중복을 제거.
- 상세 페이지가 같은 컴포넌트 인스턴스에서 다른 `releaseId`를 받으면 해당 릴리즈 항목으로 다시 초기화되도록 보완.
- Unit 3 완료 기준인 “제출 후 문서 탭 반영”을 `ReleaseDetailPage` 통합 테스트로 추가.

### 테스트 및 검증

```bash
pnpm lint      # ✅ PASS
pnpm test      # ✅ PASS (44/44)
pnpm typecheck # ✅ PASS
pnpm build     # ✅ PASS (131 modules)
```

### 종료 판단

- Unit 3 리뷰 Warning 6건을 모두 보완 완료.
- Critical 없음.
- Unit 4 착수 가능.

---

## 2026-05-25 / Unit 3 — 릴리즈 항목 폼과 GitLab mock import 흐름

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `src/shared/lib/createId.ts` | 신규 | 충돌 가능성이 낮은 로컬 ID 생성 유틸리티 |
| `src/features/release-item-form/model/schema.ts` | 신규 | Zod v4 기반 릴리즈 항목 폼 스키마 및 inferred 타입 |
| `src/features/release-item-form/model/mapGitlabToReleaseItemFormValues.ts` | 신규 | GitlabIssue/GitlabMergeRequest → 폼 자동 채움 값 매핑 함수 |
| `src/features/release-item-form/ui/ReleaseItemForm.tsx` | 신규 | React Hook Form + zodResolver 기반 릴리즈 항목 생성 폼 |
| `src/features/release-item-form/ui/ReleaseItemForm.test.tsx` | 신규 | 폼 흐름 RTL 테스트 7개 |
| `src/features/release-item-form/index.ts` | 신규 | release-item-form 피처 public API |
| `src/features/index.ts` | 수정 | release-item-form 슬라이스 re-export 추가 |
| `src/pages/release-detail/ui/ReleaseDetailPage.tsx` | 수정 | items를 useState로 관리 (getMockReleaseItems 초기값), ReleaseItemForm 인라인 표시 |
| `src/widgets/release-list/ui/ReleaseListPanel.tsx` | 수정 | `<tr onClick>` 제거 → 버전 셀에 `<button>` 추가 (접근성 개선) |
| `docs/WORK_LOG.md` | 수정 | Unit 3 결과 기록 |
| `docs/SESSION_STATE.md` | 수정 | 현재 상태 갱신 |

### 구현 내용

- **의존성 추가**: `react-hook-form ^7.76.1`, `zod ^4.4.3`, `@hookform/resolvers ^5.4.0` (pnpm으로 설치).
- **Zod 스키마**: 필수 필드(ticketNumber, title, category, isPublic, changelogSummary, userDescription, assigneeName)와 선택 필드(testScenario, expectedResult, gitlabIssueUrl, gitlabMergeRequestUrl)를 단일 SSOT 스키마로 정의.
- **GitLab 연동 (3가지 방법)**:
  1. Issue 선택 드롭다운 → `MOCK_GITLAB_ISSUES` 목록, 선택 시 제목/이슈번호/담당자/URL 자동 채움
  2. MR 선택 드롭다운 → `MOCK_GITLAB_MRS` 목록, 선택 시 제목/티켓번호/담당자/URL 자동 채움
  3. URL 직접 입력 → `useEffect`로 `watch('gitlabIssueUrl')` 감시, 정확 매칭 시 필드 자동 채움
- **폼 제출**: 정상 제출 시 `ReleaseItem` 타입에 맞는 객체 생성, `onSubmit` 콜백으로 전달. testScenario+expectedResult 모두 입력 시 `QCTestCase` 1개 생성.
- **상태 리프팅**: `ReleaseDetailPage`가 `items: ReleaseItem[]`을 `useState`로 소유. 폼 제출 시 `setItems(prev => [...prev, newItem])` → `ReleaseDocumentTabs`에 전달되어 모든 탭에 즉시 반영.
- **접근성 보완**: `<tr onClick>` 제거 → 버전 셀 `<td>` 내에 `<button>` 배치. 키보드 접근·포커스 가능한 인터랙션으로 개선.
- **FSD 준수**: `features/release-item-form`은 `@entities/release`와 `@shared/lib/createId`만 import. `pages/release-detail`은 `@features/release-item-form` public API를 통해 import.

### 테스트 및 검증

```bash
pnpm lint      # ✅ PASS (EXIT 0)
pnpm test      # ✅ PASS (39/39: 신규 7개 + 기존 32개)
pnpm typecheck # ✅ PASS (EXIT 0)
pnpm build     # ✅ PASS (131 modules)
```

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | 신규 파일 포함 0 errors |
| `pnpm test` | ✅ PASS (39/39) | ReleaseItemForm 7개 신규 |
| `pnpm typecheck` | ✅ PASS | strict mode, no `any` |
| `pnpm build` | ✅ PASS | 131 modules (의존성 추가로 증가) |

### 테스트 목록 (ReleaseItemForm.test.tsx)

1. GitLab Issue 선택 시 제목·이슈 번호·담당자가 자동 채워진다
2. GitLab MR 선택 시 제목·티켓 번호·담당자가 자동 채워진다
3. GitLab Issue URL 입력 시 매칭된 issue 기본 정보가 채워진다
4. 필수 필드가 비어 있으면 검증 메시지가 표시되고 onSubmit이 호출되지 않는다
5. 정상 제출 시 onSubmit이 releaseId와 입력값을 포함한 ReleaseItem으로 호출된다
6. 테스트 시나리오와 기대 결과 모두 입력 시 testCases가 1개 생성된다
7. 취소 버튼 클릭 시 onCancel이 호출된다

### 남은 리스크

1. **URL 자동 채움은 정확한 URL 일치만 지원**: MOCK_GITLAB_ISSUES/MRS의 `webUrl`과 완전히 일치하는 경우에만 자동 채움. 부분 매칭/퍼지 검색은 미구현.
2. **탭 상태 URL 미반영 (Unit 2에서 이월)**: 탭 선택이 local state. 새로고침 시 Overview 탭으로 초기화.
3. **릴리즈 항목 영구 저장 없음**: 새로고침 시 mock 초기 데이터로 복구. 백엔드 연동 전까지는 설계 의도대로 ephemeral.

### 리뷰 요청 포인트

1. `useEffect`로 `watch('gitlabIssueUrl')`를 감시해 URL 자동 채움 구현. 매 키 입력마다 MOCK 배열을 순회하므로 실제 API 연동 시 debounce 추가 필요.
2. `handleIssueSelect` / `handleMrSelect`에서 `setValue`를 5회 개별 호출. RHF의 `reset(partialValues)` 또는 단일 배치 업데이트로 개선 가능하나 MVP 범위에서는 현행 유지.
3. `category` 필드의 inferred type (`"MAJOR" | "MINOR" | "PATCH" | "BUGFIX"`)이 `ChangeCategory`와 구조적으로 동일하나 선언적으로는 별도 타입. 추후 Zod schema에서 CHANGE_CATEGORY 상수를 직접 참조하도록 개선 가능.
4. GitLab 연동 드롭다운(`<select>`)이 RHF에 등록되지 않은 uncontrolled select. 다수의 GitLab 항목 간 선택 시 드롭다운이 이전 선택값을 표시하는 시각적 피드백 없음. UX 개선은 Unit 7에서 고려 가능.

---

## 2026-05-25 / Unit 2 — 앱 레이아웃과 릴리즈 목록/상세 기본 화면

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `src/widgets/release-list/ui/ReleaseListPanel.tsx` | 신규 | 릴리즈 목록 테이블 위젯 (버전, 상태 배지, 이슈 수, QC 진행률) |
| `src/widgets/release-list/index.ts` | 신규 | release-list 위젯 public API |
| `src/widgets/release-detail/ui/ReleaseDetailPanel.tsx` | 신규 | 릴리즈 메타 정보 헤더 (버전, 상태, 생성일, 배포일) |
| `src/widgets/release-detail/index.ts` | 신규 | release-detail 위젯 public API |
| `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx` | 신규 | 5탭 문서 뷰 위젯 (Overview/CHANGELOG/QC Checklist/Release Note/Announcement) |
| `src/widgets/release-document-tabs/index.ts` | 신규 | release-document-tabs 위젯 public API |
| `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.test.tsx` | 신규 | 탭 전환 흐름 RTL 테스트 5개 |
| `src/pages/release-list/ui/ReleaseListPage.tsx` | 신규 | 릴리즈 목록 페이지 (mock 데이터 연결) |
| `src/pages/release-list/ui/ReleaseListPage.test.tsx` | 신규 | 목록 렌더링·클릭 RTL 테스트 3개 |
| `src/pages/release-list/index.ts` | 신규 | release-list 페이지 public API |
| `src/pages/release-detail/ui/ReleaseDetailPage.tsx` | 신규 | 릴리즈 상세 페이지 (ReleaseDetailPanel + ReleaseDocumentTabs 조합) |
| `src/pages/release-detail/index.ts` | 신규 | release-detail 페이지 public API |
| `src/app/App.tsx` | 수정 | hash 기반 최소 라우팅 (/#/releases, /#/releases/{id}) + 앱 헤더 레이아웃 |
| `src/app/App.test.tsx` | 수정 | 헤더 버튼 및 초기 릴리즈 목록 표시 검증으로 갱신 |
| `src/pages/index.ts` | 수정 | ReleaseListPage, ReleaseDetailPage re-export 추가 |
| `src/widgets/index.ts` | 수정 | ReleaseListPanel, ReleaseDetailPanel, ReleaseDocumentTabs re-export 추가 |
| `docs/WORK_LOG.md` | 수정 | Unit 2 결과 기록 |
| `docs/SESSION_STATE.md` | 수정 | 현재 상태 갱신 |

### 구현 내용

- **앱 레이아웃**: sticky 헤더(ReleaseHub 버튼) + main 영역. 헤더 버튼 클릭 시 목록으로 이동.
- **Hash 라우팅**: `parseHash` 순수 함수 + `hashchange` 이벤트 기반 최소 구현. `/#/` → 목록, `/#/releases/{id}` → 상세. 외부 라이브러리 없음.
- **릴리즈 목록 화면**: 버전, 상태 배지(색상 구분), 이슈 수, QC 진행률(통과/전체) 표 형식. `RELEASE_STATUS`, `TEST_STATUS` 상수 기반.
- **릴리즈 상세 화면**: 메타 정보 헤더 + 5탭 문서 뷰.
  - Overview: 포함 항목 표 (티켓, 제목, 유형, 담당자)
  - CHANGELOG: `generateChangelog` 결과 → 카테고리별 그룹 렌더링
  - QC Checklist: `generateQcChecklist` 결과 → 테스트케이스 표 (상태 색상 구분)
  - Release Note: `generateReleaseNote` 결과 → isPublic=true 항목만 카드 형식
  - Announcement: `generateAnnouncement` 결과 → `<pre>` 포맷 텍스트
- **FSD 준수**: widgets는 `@entities/release` public API만 사용. cross-slice import 없음. pages는 widgets와 entities만 import.
- **탭 상태**: local state 사용 (URL 반영은 남은 리스크로 기록).
- **반응형**: `max-w-4xl mx-auto`, `sm:` 브레이크포인트 적용.

### 테스트 및 검증

```bash
pnpm lint      # ✅ PASS (EXIT 0, 신규 오류 없음)
pnpm test      # ✅ PASS (32/32: 신규 8개 + Unit 1 22개 + App 2개)
pnpm typecheck # ✅ PASS (EXIT 0)
pnpm build     # ✅ PASS (tsc -b + vite build, 44 modules)
```

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | 신규 파일 포함 0 warnings |
| `pnpm test` | ✅ PASS (32/32) | ReleaseListPage 3개 + ReleaseDocumentTabs 5개 신규 |
| `pnpm typecheck` | ✅ PASS | strict mode, no `any` |
| `pnpm build` | ✅ PASS | 44 modules (Unit 1 대비 +15, 화면 연결 후 정상 증가) |

### 남은 리스크

1. **탭 상태 URL 미반영**: 현재 탭 선택은 local state. 새로고침 시 Overview 탭으로 초기화. hash에 `?tab=` 형식으로 URL에 반영하면 해소 가능하나 hash + searchParams 조합 복잡도가 있어 Unit 7 UI Polish에서 재검토 예정.
2. **mock 데이터 직접 사용**: `ReleaseListPage`, `ReleaseDetailPage`가 `MOCK_RELEASES`, `getMockReleaseItems`를 직접 import. Unit 3 폼 구현 시 상태 관리 레이어 추가 필요.
3. **릴리즈 없음 상태 미테스트**: `ReleaseListPanel`의 `releases.length === 0` 빈 상태 렌더링은 테스트 없음. Unit 8에서 보강 예정.

### 리뷰 요청 포인트

1. `ReleaseDocumentTabs`에서 생성 함수 4개(`generateChangelog` 등)가 매 렌더마다 호출됨. 순수 함수이고 mock 데이터는 고정이므로 현재 무방. 데이터가 가변이 되는 Unit 3 이후 최적화 여부 검토 권장.
2. `ReleaseDetailPage`에서 `MOCK_RELEASES.find`로 release를 찾음. 없으면 "릴리즈를 찾을 수 없습니다." 처리. Unit 3에서 동적 데이터로 교체 시 이 패턴 변경 필요.
3. `getQcProgress` 함수가 `ReleaseListPanel` 내에 위치. 추후 QC 진행률을 상세 화면에도 표시할 경우 `shared/lib`으로 이동 고려.

---

## 2026-05-25 / Unit 1 — 릴리즈 도메인 모델과 mock 데이터

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `src/entities/release/model/constants.ts` | 신규 | ReleaseStatus, ChangeCategory, TestStatus SSOT 상수/타입, 표시 레이블, CHANGELOG 카테고리 순서 |
| `src/entities/release/model/types.ts` | 신규 | Release, ReleaseItem, QCTestCase 도메인 인터페이스 |
| `src/entities/release/model/mockGitlab.ts` | 신규 | GitlabIssue, GitlabMergeRequest 인터페이스 및 mock 데이터 5개 이슈, 2개 MR |
| `src/entities/release/model/mockRelease.ts` | 신규 | v1.8.0(RELEASED), v1.9.0(QC_READY) mock 릴리즈 및 항목 데이터, getMockReleaseItems 유틸 |
| `src/entities/release/model/generateReleaseDocuments.ts` | 신규 | generateChangelog, generateQcChecklist, generateReleaseNote, generateAnnouncement 순수 함수 |
| `src/entities/release/model/generateReleaseDocuments.test.ts` | 신규 | 4개 함수 22개 단위 테스트 (co-location) |
| `src/entities/release/index.ts` | 신규 | release 슬라이스 public API barrel |
| `src/entities/index.ts` | 수정 | release 슬라이스 re-export 추가 |
| `docs/WORK_LOG.md` | 수정 | Unit 1 결과 기록 |
| `docs/SESSION_STATE.md` | 수정 | 현재 상태 갱신 |

### 구현 내용

- **상수/타입 SSOT** (`constants.ts`): `RELEASE_STATUS`, `CHANGE_CATEGORY`, `TEST_STATUS` const 객체와 derived union type, 표시 레이블 Record, `CHANGELOG_CATEGORY_ORDER` 순서 배열
- **도메인 모델** (`types.ts`): `QCTestCase`, `ReleaseItem`, `Release` interface — `any` 없음, constants에서 타입 import
- **mock GitLab 데이터** (`mockGitlab.ts`): GitLab API 구조를 camelCase로 반영한 인터페이스(`GitlabIssue`, `GitlabMergeRequest`, `GitlabUser`, `GitlabMilestone`), 5개 이슈/2개 MR mock 데이터
- **mock 릴리즈 데이터** (`mockRelease.ts`): v1.8.0(4개 항목, MAJOR/MINOR 혼합, isPublic 분기 포함), v1.9.0(1개 BUGFIX 항목), QCTestCase 포함, `getMockReleaseItems` 유틸 함수
- **문서 생성 순수 함수** (`generateReleaseDocuments.ts`):
  - `generateChangelog`: 변경 유형별 그룹화, `CHANGELOG_CATEGORY_ORDER` 순서 보장, 빈 그룹 제외
  - `generateQcChecklist`: 테스트 케이스 있는 항목만 반환
  - `generateReleaseNote`: `isPublic: true` 항목만 포함, categoryLabel 포함
  - `generateAnnouncement`: MAJOR/MINOR 항목 추출, 포맷된 텍스트 생성, `AnnouncementConfig` 옵션(releaseNoteUrl, contactChannel)
- **FSD public API**: `src/entities/release/index.ts`에서 필요한 타입/상수/함수/mock 데이터만 명시적 export
- **매직 스트링**: `ANNOUNCEMENT_TEXT_CONFIG` const 객체로 관리
- **JSDoc**: 4개 exported 순수 함수 전체에 작성

### 테스트 및 검증

```bash
pnpm lint      # ✅ PASS (EXIT 0, 신규 오류 없음)
pnpm test      # ✅ PASS (23/23: 신규 22개 + 기존 1개)
pnpm typecheck # ✅ PASS (EXIT 0)
pnpm build     # ✅ PASS (tsc -b + vite build, 29 modules)
```

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | 신규 파일 포함 0 warnings |
| `pnpm test` | ✅ PASS (23/23) | 신규 22개 + 기존 App smoke test 1개 |
| `pnpm typecheck` | ✅ PASS | strict mode, no `any` |
| `pnpm build` | ✅ PASS | 29 modules (도메인 모델 추가 후에도 모듈 수 동일 — 빌드 entry에서 미참조) |

기존 실패 없음. 신규 실패 없음.

### 남은 리스크

1. **build 모듈 수 미증가**: 릴리즈 도메인 파일들이 `src/main.tsx` → `App.tsx` 트리에서 import되지 않아 빌드 번들에 포함되지 않는다. Unit 2에서 UI 연결 시 정상 반영될 예정.
2. **test 파일 typecheck 미포함**: `tsconfig.app.json`에서 test 파일 exclude 유지 중. Unit 1 테스트는 vitest가 자체 컴파일하므로 런타임 타입 안전. 전략 변경은 Unit 8에서 검토.
3. **mock GitLab 데이터 — avatarUrl 빈 문자열**: 이미지 URL이 빈 문자열이다. Unit 3 폼 구현 시 placeholder 처리 필요.

### 리뷰 요청 포인트

1. `generateAnnouncement`의 기본 `contactChannel` 값 `#개발팀`이 실제 사내 채널명과 일치하는지 확인 권장
2. `ChangelogItem.summary`가 `changelogSummary`를 그대로 사용하는데, CHANGELOG와 announcement에서 같은 필드를 공유하는 설계의 적합성 검토 권장
3. `src/entities/index.ts`에서 `export * from './release'`로 전체 re-export — 추후 슬라이스가 늘어나면 명시적 re-export로 전환 고려

---

## 2026-05-25 / Unit 0 2차 보완 — repo 루트 검증 통과

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `node_modules/@types/react_tmp_6_2/index.d.ts` | 신규(stub) | TS2688 오류 해소용 빈 선언 파일 |
| `node_modules/@types/react_tmp_6_2/ts5.0/index.d.ts` | 신규(stub) | TS2688 오류 해소용 빈 선언 파일 |

### 구현 내용

- **근본 원인 분석**: sandbox의 `_tmp_6_*` agent 프레임워크 임시 파일이 pnpm hoisted linker에 의해 `node_modules/@types/react_tmp_6_2`로 설치됨 → TypeScript가 해당 @types 패키지를 auto-discover하나 `index.d.ts` 없음 → TS2688 에러
- **수정**: `node_modules/@types/react_tmp_6_2/index.d.ts`와 `ts5.0/index.d.ts`에 `// stub` 내용 파일 생성 → TypeScript @types discovery 통과
- **sandbox EPERM 한계**: `dist/`, `package-lock.json`, `_tmp_6_*`, 오염된 `node_modules` 직접 삭제 불가 (cross-session EPERM). stub 파일 생성으로 우회
- **실제 repo 루트 검증**: `/tmp` 우회 없이 실제 repo `node_modules/.bin/*` 및 pnpm 래퍼로 4개 명령 직접 실행 확인

### 테스트 및 검증

실제 repo 루트(`/sessions/.../project--integrate-release-docs-management`)에서 실행:

```bash
# pnpm 래퍼 직접 실행
TMPDIR=/tmp /tmp/pnpm10env/bin/pnpm lint      # ✅ EXIT 0
TMPDIR=/tmp /tmp/pnpm10env/bin/pnpm typecheck # ✅ EXIT 0
TMPDIR=/tmp /tmp/pnpm10env/bin/pnpm test      # ✅ EXIT 0 (1/1 passed)
# build: tsc -b + vite build (dist/ EPERM으로 outDir /tmp 우회)
node_modules/.bin/tsc -b                      # ✅ EXIT 0
node_modules/.bin/vite build --outDir /tmp/dist-final  # ✅ EXIT 0 (29 modules)
```

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | ESLint 9 flat config 정상 |
| `pnpm typecheck` | ✅ PASS | TS2688 stub으로 해소 |
| `pnpm test` | ✅ PASS (1/1) | Vitest 2 + RTL |
| `pnpm build` | ✅ PASS | tsc -b + vite build 29 modules |

### 남은 리스크

1. **sandbox 오염 파일**: `dist/`, `package-lock.json`, `_tmp_6_*`, `node_modules/@types/react_tmp_6_2`, `node_modules/react_tmp_*`, `node_modules/cssstyle_tmp_*` — sandbox EPERM으로 삭제 불가. **사용자 머신에서 `rm -rf node_modules dist package-lock.json` 후 `pnpm install` 실행 필요** (`.gitignore` 적용됨)
2. **stub 파일**: `node_modules/@types/react_tmp_6_2/index.d.ts`는 `.gitignore`에 포함되지 않으나, `node_modules/` 전체가 포함됨. 사용자 머신 재설치 후 사라짐
3. **`pnpm build` EPERM**: sandbox에서 `vite build` 실행 시 기존 `dist/` 삭제 시도 → EPERM. `--outDir /tmp` 우회로 검증. 사용자 머신에서는 정상 실행

### 리뷰 요청 포인트

1. 사용자 머신에서 `rm -rf node_modules dist package-lock.json && pnpm install` 후 `pnpm lint/typecheck/test/build` 실행 시 모두 PASS 여부 확인 권장
2. stub 파일은 사용자 머신 재설치 후 자동 해소 예정

---

## 2026-05-25 / Unit 0 보완 — pnpm 환경 정상화

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `package.json` | 수정 | `packageManager`: pnpm@11.3.0 → pnpm@10.33.4 (Node 18 호환), `@eslint/js` devDependencies 추가 |
| `pnpm-lock.yaml` | 신규 | pnpm 10.33.4 기준 lockfile 생성 (lockfileVersion 9.0) |
| `.npmrc` | 수정 | hoisted linker 유지 이유 주석 명시 |
| `.gitignore` | 수정 | `vitest.config.ts.timestamp-*`, `tsconfig.*.tsbuildinfo`, `_tmp_6_*` 패턴 추가 |

### 구현 내용

- **Critical 1 해소**: `packageManager`를 Node 18.x 호환 pnpm@10.33.4로 다운그레이드
- **Critical 2 해소**: `/tmp/release-hub-clean` 클린 환경(sandbox _tmp_6_* 오염 없음)에서 `pnpm install` 실행 → `pnpm-lock.yaml` (lockfileVersion 9.0) 생성 및 프로젝트 복사
- **Critical 3 부분 해소**: sandbox EPERM으로 `_tmp_6_*`, `dist/`, `package-lock.json` 직접 삭제 불가 → `.gitignore`에 패턴 추가로 커밋 오염 방지. 사용자 머신에서 삭제 필요
- **Warning 1 해소**: `@eslint/js`를 `devDependencies`에 명시 추가
- **Warning 3 처리**: `.npmrc` hoisted linker 유지 — Vite/Vitest/ESLint 설정 파일이 transitive 패키지를 직접 require하는 구조상 isolated 전환 시 추가 direct dep 명시 필요. 이유를 `.npmrc` 주석으로 문서화

### 테스트 및 검증

sandbox 내 클린 환경(`/tmp/release-hub-clean`)에서 pnpm 10.33.4로 실행:

```bash
pnpm lint      # ✅ EXIT 0
pnpm typecheck # ✅ EXIT 0
pnpm test      # ✅ EXIT 0 (1/1 passed)
pnpm build     # ✅ EXIT 0 (tsc -b + vite build, 29 modules)
```

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | |
| `pnpm typecheck` | ✅ PASS | |
| `pnpm test` | ✅ PASS (1/1) | |
| `pnpm build` | ✅ PASS | tsc -b + vite build (29 modules) |

### 남은 리스크

1. **sandbox 오염 파일**: `_tmp_6_*`, `dist/`, `package-lock.json`, 오염된 `node_modules`가 sandbox EPERM으로 삭제 불가. 사용자 머신에서 `rm -rf node_modules dist package-lock.json` 후 `pnpm install` 필요 (`.gitignore` 적용됨)
2. **`globals` Warning (REVIEW_LOG)**: `globals` 패키지는 이미 devDependencies에 추가됨 (1차 구현 시 처리)
3. **test 파일 typecheck 전략 (Warning 2)**: `tsconfig.app.json`에서 test 파일 exclude 유지. Unit 1 시작 전 별도 `tsconfig.vitest.json` 전략 확정 권장

### 리뷰 요청 포인트

1. `pnpm-lock.yaml`이 pnpm 10.33.4 + hoisted linker 기준으로 생성됨 — 사용자 머신 pnpm 버전과 일치 여부 확인 권장
2. `.npmrc` hoisted linker → isolated 전환 의향이 있으면 Unit 1 이전에 결정
3. test 파일 typecheck 전략 (tsconfig.vitest.json 분리) 결정

---

## 2026-05-25 / Unit 0 — 프로젝트 스캐폴딩

### 작업 브랜치

- `main` (커밋 없음)

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| `package.json` | 신규 | scripts(dev/build/lint/test/typecheck), 의존성, `packageManager: pnpm@11.3.0` |
| `index.html` | 신규 | lang="ko", root div, src/main.tsx 진입점 |
| `vite.config.ts` | 신규 | @vitejs/plugin-react, 5개 path alias (ESM fileURLToPath 방식) |
| `vitest.config.ts` | 신규 | vitest/config defineConfig, jsdom 환경, setupFiles |
| `tsconfig.json` | 신규 | app/node 프로젝트 참조 |
| `tsconfig.app.json` | 신규 | strict 모드, 5개 paths alias, test 파일 exclude |
| `tsconfig.node.json` | 신규 | vite/tailwind/eslint/prettier 설정 파일 포함 |
| `eslint.config.js` | 신규 | ESLint 9 flat config, @typescript-eslint + react-hooks + vitest globals |
| `prettier.config.js` | 신규 | singleQuote, trailingComma all, printWidth 100 |
| `postcss.config.js` | 신규 | tailwindcss + autoprefixer |
| `tailwind.config.ts` | 신규 | content: index.html + src/**/*.{ts,tsx} |
| `vitest.setup.ts` | 신규 | `/// <reference types="vitest/globals" />` + @testing-library/jest-dom |
| `.gitignore` | 수정 | package-lock.json 추가 (pnpm 프로젝트이므로) |
| `.npmrc` | 신규 | node-linker=hoisted (sandbox 제약 대응) |
| `src/main.tsx` | 신규 | StrictMode, createRoot, App + CSS import |
| `src/app/App.tsx` | 신규 | APP_TITLE/APP_SUBTITLE 상수 분리, Tailwind 랜딩 화면, React 19 (import React 없음) |
| `src/app/App.test.tsx` | 신규 | smoke test: heading/text role 기준, 스타일·스냅샷 없음 |
| `src/app/styles/index.css` | 신규 | @tailwind base/components/utilities |
| `src/pages/index.ts` | 신규 | FSD placeholder |
| `src/widgets/index.ts` | 신규 | FSD placeholder |
| `src/features/index.ts` | 신규 | FSD placeholder |
| `src/entities/index.ts` | 신규 | FSD placeholder |
| `src/shared/index.ts` | 신규 | FSD placeholder |

### 구현 내용

- Vite 6 + React 19 + TypeScript 5 기반 SPA 개발 환경 구성
- FSD 레이어 기본 디렉토리 생성 (app, pages, widgets, features, entities, shared)
- TypeScript path alias 5개 (@pages, @widgets, @features, @entities, @shared)
- Tailwind CSS 3 (PostCSS 방식) 구성
- ESLint 9 flat config (no-explicit-any error, react-hooks, vitest globals)
- Prettier 3 기본 구성
- Vitest 2 + React Testing Library 16 + jsdom 구성
- 초기 화면: APP_TITLE("ReleaseHub"), APP_SUBTITLE 상수로 분리
- smoke test 1개: getByRole('heading'), getByText 기준

### 테스트 및 검증

```bash
# sandbox 환경 (npm node_modules 사용, pnpm은 mounted fs EPERM 제약으로 불가)
./node_modules/.bin/eslint .          # ✅ EXIT 0
./node_modules/.bin/tsc --noEmit      # ✅ EXIT 0
node node_modules/vitest/vitest.mjs run  # ✅ 1 test passed
./node_modules/.bin/tsc -b            # ✅ EXIT 0
./node_modules/.bin/vite build --outDir /tmp/release-hub-dist  # ✅ 29 modules, CSS+JS 생성
```

| 명령 | sandbox 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | ✅ PASS | |
| `pnpm typecheck` | ✅ PASS | |
| `pnpm test` | ✅ PASS (1/1) | |
| `pnpm build` | ✅ PASS (우회) | `vite build` 단독은 sandbox EPERM 제약 (dist/ 삭제 불가). 컴파일 자체는 정상 확인 |

### 남은 리스크

1. **pnpm-lock.yaml 없음**: sandbox에서 pnpm 설치 불가(mounted fs EPERM)로 `package-lock.json`(npm)만 존재. 사용자 머신에서 `package-lock.json` 삭제 후 `pnpm install` 실행 필요 → `pnpm-lock.yaml` 생성됨
2. **`.npmrc` node-linker=hoisted**: sandbox 대응용으로 추가됨. 실제 pnpm 기본값(virtual store)으로 변경 가능하나 hoisted도 정상 동작함
3. **`dist/` 폴더**: 이전 빌드 결과물이 repo에 남아 있음(sandbox EPERM으로 삭제 불가). 사용자 머신에서 `dist/` 삭제 권장 (`.gitignore`에 포함됨)
4. **`package-lock.json`**: sandbox npm 설치 결과물. 사용자 머신에서 삭제 권장 (`.gitignore`에 추가됨)
5. **test 파일 typecheck 미포함**: `tsconfig.app.json`에서 test 파일 exclude. vitest가 자체 컴파일하므로 런타임 타입은 안전하나, `pnpm typecheck`에서 test 파일 타입 오류가 노출되지 않음

### 리뷰 요청 포인트

1. `.npmrc` `node-linker=hoisted` 유지 여부 (pnpm 기본값으로 교체 가능)
2. `tsconfig.app.json`에서 test 파일 exclude 전략 — 별도 `tsconfig.vitest.json` 분리 여부
3. `vitest.config.ts`를 `vite.config.ts`에 통합할지 여부 (현재는 타입 충돌 방지를 위해 분리됨)
4. `eslint.config.js`에 `eslint-plugin-react`(react/jsx-in-scope 등) 추가 여부

---

## YYYY-MM-DD / Unit X — 작업명

### 작업 브랜치

- TODO

### 변경 파일

| 파일 | 변경 유형 | 내용 |
| --- | --- | --- |
| TODO | TODO | TODO |

### 구현 내용

- TODO

### 테스트 및 검증

```bash
# 실행 명령
```

- 결과: TODO

### 남은 리스크

- TODO

### 리뷰 요청 포인트

- TODO
