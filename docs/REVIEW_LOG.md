# Review Log — 리뷰 결과 로그

## 0. 운영 규칙

- GPT는 구현 결과와 `WORK_LOG.md`를 기준으로 리뷰한다.
- 리뷰는 버그, 요구사항 누락, 아키텍처 위반, 테스트 공백을 우선한다.
- Critical은 반드시 보완 작업으로 되돌린다.
- Warning은 기능 완료를 막지 않는 경우 후속 작업으로 넘길 수 있다.

## 1. 리뷰 결과

---

## 2026-05-26 / Unit 8 — 테스트/문서 정리

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 리뷰 결과

- README가 현재 구현 범위, 제외 범위, 실행/검증 명령, 테스트 현황을 반영함.
- `CURRENT_TASK.md`, `NEXT_TASK_DRAFT.md`, `WORK_LOG.md`, `REVIEW_LOG.md`, `SESSION_STATE.md`가 Unit 8 기준으로 정리됨.
- 신규 기능 변경 없이 문서/검증 정리에 한정됨.

### 검증 결과

```bash
pnpm lint      # PASS
pnpm test      # PASS (52/52)
pnpm typecheck # PASS
pnpm build     # PASS (137 modules)
```

추가 확인:

- `git diff --check`: PASS
- FSD/deep import 검색: 위반 없음
- `any`, `TODO`, `FIXME` 코드 검색: 위반 없음

### 보완 요청

- 없음. Unit 8 종료 가능.

---

## 2026-05-26 / Unit 7 — UI Polish

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 리뷰 결과

- 접근성: 릴리즈 목록 빈 상태 `status`, 목록 표 accessible name, 문서 탭 `tabpanel` 연결이 추가됨.
- 반응형: 주요 데이터 표에 모바일 overflow 구조와 최소 너비가 적용됨.
- 테스트: ReleaseListPanel 접근성/빈 상태 테스트와 ReleaseDocumentTabs tabpanel 테스트가 추가됨.
- 범위 준수: 새로운 도메인 기능 없이 UI 품질 보완에 한정됨.

### 검증 결과

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

- 결과: 모두 PASS
- 테스트: 8개 테스트 파일, 52개 테스트 통과
- build: 137 modules transformed

### 보완 요청

- 없음. Unit 7 종료 가능.

---

## 2026-05-26 / Unit 6 — Export와 공지문 복사

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 리뷰 결과

- 요구사항 충족: Announcement clipboard 복사, CHANGELOG CSV, QC CSV, Release Note HTML, Release JSON 생성과 UI 버튼이 구현됨.
- 아키텍처: 문자열 생성은 `entities/release`, 상호작용 UI는 `features/release-export`, 조합은 widget에서 수행해 FSD 경계를 유지함.
- 데이터 계약: export 함수는 기존 `Release`, `ReleaseItem`과 Unit 1 문서 생성 함수 결과를 사용함.
- 테스트: export 문자열 생성 4개 테스트와 clipboard 복사 UI 테스트가 추가됨.
- 품질: build 실패 원인이던 `String.prototype.replaceAll` 사용을 ES target 호환 regex replace로 수정함.

### 검증 결과

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 7개 테스트 파일, 50개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 137 modules transformed

### 보완 요청

- 없음. Unit 6 종료 가능.

### 후속 권장 사항

- Unit 7에서 export toolbar와 문서 탭의 모바일 레이아웃을 확인한다.

---

## 2026-05-26 / Unit 5 — QC 체크리스트 상태 UX

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 리뷰 결과

- 요구사항 충족: QC 상태 변경, Failed/Blocked 사유 입력, 상세 QC 요약 갱신, 목록 QC 진행률 반영이 구현됨.
- 아키텍처: 상태 변경 UI는 `features/qc-test-status`, 도메인 계산/업데이트 helper는 `entities/release`, 상태 소유는 `App`/page 경계로 분리됨.
- FSD: deep import 없음. widgets는 feature UI를 public API로 조합하고, feature는 entities만 참조함.
- 데이터 계약: `ReleaseItem.testCases` 구조를 유지하면서 immutable update helper로 상태/사유를 갱신함.
- 테스트: `App.test.tsx`가 상세 상태 변경과 목록 진행률 반영까지 통합 흐름을 검증함.

### 검증 결과

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 6개 테스트 파일, 45개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 134 modules transformed

### 보완 요청

- 없음. Unit 5 종료 가능.

### 후속 권장 사항

- Unit 6 export 산출물에서 QC 상태와 실패/차단 사유를 포함할지 확인한다.

---

## 2026-05-26 / Unit 4 — 문서 미리보기 고도화

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 리뷰 결과

- `CURRENT_TASK.md` 범위 충족: CHANGELOG 그룹별 건수, QC 상태 요약, Release Note 공개/비공개 메타, Announcement read-only 텍스트 표시가 구현됨.
- FSD 레이어 준수: `widgets/release-document-tabs`는 `@entities/release` public API만 사용하며 deep import 없음.
- 데이터 계약 정합성: 문서 생성은 기존 `generateChangelog`, `generateQcChecklist`, `generateReleaseNote`, `generateAnnouncement` 결과를 유지하고 표시 구조만 개선함.
- SSOT 개선: `TEST_STATUS_LABEL`을 `entities/release` constants로 중앙화하고 public API로 export함.
- 테스트 방어력: `ReleaseDocumentTabs.test.tsx`가 문서별 핵심 정보 구조를 role/text/value 기반으로 검증함.
- 타입/품질: `any`, `TODO`, `FIXME` 없음. `git diff --check` 통과.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 6개 테스트 파일, 44개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 131 modules transformed

추가 검증:

- `git diff --check`: PASS
- FSD deep import 검색: 위반 없음
- Vite dev server HTTP 200 확인

### 보완 요청

- 없음. Unit 4 종료 가능.

### 후속 권장 사항

- Unit 5에서 QC 상태 변경 후 목록/상세/문서 탭의 진행률과 상태 요약이 함께 갱신되는지 테스트로 방어한다.
- Unit 6에서 Announcement read-only textarea에 clipboard 복사 버튼을 추가한다.

---

## 2026-05-25 / Unit 3 보완 — 릴리즈 항목 폼과 GitLab mock import 흐름

### 최종 판단

- PASS

### Critical

- 없음

### Warning

- 없음

### 보완 확인

1. MR URL 직접 입력 시 `gitlabIssueUrl`에 MR URL이 남는 문제를 `gitlabSourceUrl` 분리로 해결.
2. 자동 채움 시 `setValue`에 validation/dirty 옵션을 적용해 기존 검증 에러가 즉시 해소되도록 보완.
3. Issue/MR 선택 UI를 controlled 상태로 전환해 마지막 선택 기준으로 동기화.
4. Zod category enum을 `CHANGE_CATEGORY` SSOT에서 파생.
5. `ReleaseDetailPage`가 `releaseId` 변경 시 items와 form open 상태를 재초기화하도록 보완.
6. 상세 페이지 제출 후 문서 탭 반영 통합 테스트와 releaseId 변경 회귀 테스트 추가.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 6개 테스트 파일, 44개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 131 modules transformed

### 보완 요청

- 없음. Unit 3 종료 가능.

### 후속 권장 사항

- Unit 4에서 문서 미리보기 UI를 고도화하면서 Unit 2에서 이월된 탭 URL 상태 반영 여부를 결정한다.

---

## 2026-05-25 / Unit 3 — 릴리즈 항목 폼과 GitLab mock import 흐름

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `src/features/release-item-form/ui/ReleaseItemForm.tsx:53` — URL 자동 채움 입력이 `gitlabIssueUrl` 필드를 Issue/MR 공용 입력으로 사용한다.
   - Issue URL 입력은 데이터 의미와 일치한다.
   - MR URL 입력 시에는 `gitlabMergeRequestUrl`도 채워지지만, 사용자가 입력한 MR URL이 `gitlabIssueUrl` 값에도 남는다. 제출 결과의 `ReleaseItem.gitlabIssueUrl`에 MR URL이 들어갈 수 있어 데이터 계약 의미가 흐려진다.
   - Unit 3 기능 확인을 막지는 않지만, Unit 4 전에 공용 입력 필드를 별도 `gitlabSourceUrl` 같은 폼 전용 필드로 분리하거나 MR 매칭 시 `gitlabIssueUrl`을 비우는 방식으로 정리하는 것을 권장한다.

2. `src/features/release-item-form/ui/ReleaseItemForm.tsx:60` — 자동 채움 시 `setValue`가 `shouldValidate` 없이 호출된다.
   - 빈 폼 제출 후 검증 에러가 표시된 상태에서 Issue/MR을 선택하면 값은 채워지지만 기존 에러 메시지가 즉시 사라지지 않을 수 있다.
   - `setValue(name, value, { shouldValidate: true, shouldDirty: true })` 또는 `reset({ ...getValues(), ...autoFillValues })` 패턴을 검토한다.

3. `src/features/release-item-form/ui/ReleaseItemForm.tsx:156` — GitLab Issue/MR 선택 `<select>`가 RHF 외부 uncontrolled 상태다.
   - 현재는 자동 채움 트리거 용도라 기능상 허용 가능하다.
   - 다만 사용자가 Issue 선택 후 MR을 선택하면 두 드롭다운의 시각적 선택 상태가 서로 초기화되지 않아 현재 기준 소스가 무엇인지 불명확할 수 있다.

4. `src/features/release-item-form/model/schema.ts:7` — Zod의 category enum이 `CHANGE_CATEGORY` SSOT와 별도 literal로 선언되어 있다.
   - 현재 TypeScript 구조상 `ReleaseItem.category`에 할당 가능하고 typecheck도 통과한다.
   - 변경 유형이 추가될 경우 `entities/release` constants와 폼 스키마가 따로 수정되어야 하므로 `CHANGE_CATEGORY`에서 enum 값을 파생하는 구조를 권장한다.

5. `src/pages/release-detail/ui/ReleaseDetailPage.tsx:15` — `items` state 초기값이 최초 `releaseId` 기준으로만 생성된다.
   - 현재 UI 흐름에서는 목록 → 상세 이동 시 컴포넌트가 새로 마운트되어 문제가 드러나지 않는다.
   - hash를 직접 바꾸거나 향후 상세 간 이동이 생기면 이전 release의 items가 남을 수 있으므로 `releaseId` 변경 시 state를 재초기화하거나 상세 페이지에 `key={releaseId}`를 부여하는 방식을 검토한다.

6. `src/features/release-item-form/ui/ReleaseItemForm.test.tsx` — 폼 단위 테스트는 충분하지만 상세 페이지 통합 흐름 테스트가 없다.
   - `ReleaseItemForm` 7개 테스트가 자동 채움, 검증, 제출 객체 생성, testCases 생성을 방어한다.
   - 다만 Unit 3 완료 기준인 “정상 제출 시 현재 릴리즈 상세의 Overview/CHANGELOG/QC Checklist/Release Note/Announcement에 새 항목 반영”은 통합 테스트로 직접 검증되지 않는다.
   - 최소 1개 테스트로 `ReleaseDetailPage`에서 폼 제출 후 Overview 또는 CHANGELOG 탭에 새 항목이 보이는지 확인하는 것을 권장한다.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 5개 테스트 파일, 39개 테스트 통과
  - `src/entities/release/model/generateReleaseDocuments.test.ts` 22개
  - `src/pages/release-list/ui/ReleaseListPage.test.tsx` 3개
  - `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.test.tsx` 5개
  - `src/app/App.test.tsx` 2개
  - `src/features/release-item-form/ui/ReleaseItemForm.test.tsx` 7개

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 131 modules transformed

### 보완 요청

- Critical 없음. Unit 3 보완 작업은 필수로 되돌리지 않는다.
- Warning은 Unit 4 착수 전 또는 Unit 4 중 문서 미리보기 고도화와 함께 처리 가능하다.

### 후속 권장 사항

- `useEffect`로 URL 변경을 감시하는 방식은 mock 데이터 자동 채움 범위에서는 적절하다. 실제 API 검색으로 바뀌는 시점에는 debounce와 비동기 요청 취소 기준을 추가한다.
- `handleIssueSelect`/`handleMrSelect`의 개별 `setValue` 호출은 현재 규모에서는 허용 가능하다. 다만 validation 상태 동기화까지 고려하면 auto-fill helper로 묶고 `shouldValidate` 옵션을 통일하는 것이 낫다.
- GitLab 선택 드롭다운은 폼 제출 데이터가 아니라 자동 채움 트리거라 RHF 외부에 둘 수 있다. 단, 선택 상태를 UX로 보여줄 계획이면 controlled 상태 또는 RHF 등록으로 전환한다.
- 테스트는 피처 단위 방어력은 충분하다. 다음 보강 우선순위는 상세 페이지 통합 흐름이다.

---

## 2026-05-25 / Unit 2 — 앱 레이아웃과 릴리즈 목록/상세 기본 화면

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `src/widgets/release-list/ui/ReleaseListPanel.tsx:49` — 릴리즈 행 전체가 `<tr onClick>`으로만 동작한다.
   - 마우스 클릭으로는 동작하지만, 행 자체가 포커스 가능한 인터랙션 요소가 아니어서 키보드 사용자가 릴리즈 상세로 진입하기 어렵다.
   - Unit 2의 기본 화면 완료를 막는 수준은 아니지만, Unit 7 UI Polish까지 미루기보다 Unit 3 전후에 버전 셀을 `<button>` 또는 `<a>` 형태로 바꾸는 것을 권장한다.
   - 테스트도 `fireEvent.click(screen.getByText('v1.8.0'))`만 있어 키보드 진입 회귀를 방어하지 못한다.

2. `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx:41` — 상세 탭 상태가 local state에만 있다.
   - `CURRENT_TASK.md`에서 구현 부담이 있으면 local state로 시작하고 리스크로 남기는 것을 허용했으므로 Critical은 아니다.
   - 다만 Release Note/Announcement 탭은 이후 공유 가능한 문서 미리보기 역할을 하므로, Unit 4 또는 Unit 7에서 hash query(`/#/releases/{id}?tab=...`)나 searchParams 기반 상태로 전환하는 것이 좋다.

3. `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx:22` — `TEST_STATUS_LABEL`이 위젯 내부 local 상수로 정의되어 있다.
   - Unit 1에서 `TEST_STATUS`는 SSOT로 정의되었지만 표시 라벨은 아직 중앙화되지 않았다.
   - Unit 5에서 QC 상태 변경/배지를 구현하면 같은 라벨이 반복될 가능성이 높으므로 `entities/release`의 constants에 `TEST_STATUS_LABEL`을 추가하는 방향을 권장한다.

4. `src/widgets/release-list/ui/ReleaseListPanel.tsx:25` — 릴리즈 목록 빈 상태 렌더링 테스트가 없다.
   - Claude Code가 `WORK_LOG.md`에 남긴 것처럼 현재 핵심 happy path와 탭 전환은 테스트로 방어된다.
   - Unit 8 이전이라도 목록 위젯을 수정할 때 빈 상태 테스트 1개를 추가하면 회귀 방어가 더 단단해진다.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: 4개 테스트 파일, 32개 테스트 통과
  - `src/entities/release/model/generateReleaseDocuments.test.ts` 22개
  - `src/pages/release-list/ui/ReleaseListPage.test.tsx` 3개
  - `src/app/App.test.tsx` 2개
  - `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.test.tsx` 5개

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 44 modules transformed

### 보완 요청

- Critical 없음. Unit 2 보완 작업은 필수로 되돌리지 않는다.
- Warning은 후속 작업에서 처리 가능하다.

### 후속 권장 사항

- `ReleaseDocumentTabs`에서 문서 생성 함수 4개를 매 렌더마다 호출하는 것은 현재 mock 데이터 규모와 React 19 방침상 문제로 보지 않는다. Unit 3 이후 데이터가 가변 상태가 되면 `useMemo`보다 페이지/훅의 view model 단계에서 한 번 가공해 위젯에 넘기는 구조를 우선 검토한다.
- `ReleaseDetailPage`의 `MOCK_RELEASES.find`는 Unit 2 mock 화면 범위에서는 허용 가능하다. Unit 3에서 입력/수정 상태가 생기면 페이지 경계에 데이터 소스 인터페이스를 두고 위젯은 props만 받는 현재 방향을 유지한다.
- `getQcProgress`는 아직 단일 사용처이므로 위젯 내부에 두는 것이 적절하다. 상세 화면에서도 같은 계산이 필요해지면 `shared/lib`보다 release 도메인 소유 계산으로 `entities/release`에 두는 편이 응집도가 높다.
- FSD 레이어 역참조, cross-slice import, `entities/release` deep import 위반은 확인되지 않았다.

---

## 2026-05-25 / Unit 1 — 릴리즈 도메인 모델과 mock 데이터

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `src/entities/index.ts`에서 layer-level barrel이 `export * from './release'`를 사용한다.
   - `src/entities/release/index.ts`는 명시적 public API를 제공하므로 현재 캡슐화 위반은 아니다.
   - 다만 슬라이스가 늘어나면 노출 범위 추적이 흐려질 수 있으므로, Unit 2 이후 entities layer barrel의 명시적 re-export 기준을 정하는 것을 권장한다.

2. `generateAnnouncement` 테스트가 MAJOR 섹션 텍스트와 config 동작은 검증하지만, MINOR 섹션의 텍스트 포맷은 직접 검증하지 않는다.
   - `minorItems` 데이터 분류는 검증되어 있어 현재 기능 완료를 막지는 않는다.
   - 공지문 포맷 회귀 방어를 위해 Unit 2 또는 Unit 4에서 MINOR 텍스트 케이스를 보강하는 것을 권장한다.

3. `TEST_STATUS`는 상수/타입 SSOT로 정의되어 있으나, 표시용 `TEST_STATUS_LABEL`은 아직 없다.
   - Unit 1 필수 범위에는 상태 상수/타입 정의가 포함되므로 Critical은 아니다.
   - Unit 2/Unit 5에서 QC 상태 배지를 표시할 때 `CHANGE_CATEGORY_LABEL`, `RELEASE_STATUS_LABEL`과 같은 패턴으로 추가하는 것이 좋다.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: `src/entities/release/model/generateReleaseDocuments.test.ts` 22개 + `src/app/App.test.tsx` 1개, 총 23개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 29 modules transformed

### 보완 요청

- Critical 없음. Unit 1 보완 작업은 필요 없다.
- Unit 2 진행 가능.

### 후속 권장 사항

- Unit 2에서는 새 라우팅 라이브러리 추가 없이 현재 의존성 범위에서 최소 라우팅을 구현할지 먼저 결정한다.
- 릴리즈 상세 탭 상태는 공유 가능한 URL 상태(hash/searchParams)로 둘지, Unit 2에서는 local state로 시작할지 결정한다.
- QC 상태 표시가 들어가는 시점에 `TEST_STATUS_LABEL` 추가 여부를 확정한다.

---

## 2026-05-25 / Unit 0 3차 검증 — repo 루트 pnpm 재검증

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `_tmp_6_*`, `vite/vitest timestamp mjs`, `tsconfig.*.tsbuildinfo` 산출물이 실제 파일로 남아 있다.
   - 현재 `.gitignore`에 포함되어 커밋 오염 위험은 낮다.
   - 가능하면 추후 사용자 머신에서 정리한다.

2. `AGENTS.template.md` 삭제가 worktree에 남아 있다.
   - Unit 0 스캐폴딩과 직접 관련 없는 변경일 수 있으므로 커밋 전 의도 확인이 필요하다.

3. test 파일 typecheck 전략은 아직 미확정이다.
   - Unit 1에서 순수 함수 테스트가 늘어나기 전 `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 결정하는 것을 권장한다.

4. `.npmrc`에서 hoisted linker와 `shamefully-hoist=true`를 유지하고 있다.
   - 현재 검증은 통과했다.
   - Unit 1 전에 isolated linker 전환 여부를 결정할 수 있으나, 프로토타입 단계에서는 유지 가능하다.

### 검증 결과

실제 repo 루트에서 실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: `src/app/App.test.tsx` 1개 파일, 1개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 29 modules transformed

### 보완 요청

- Unit 0 추가 보완은 필요 없다.
- Unit 1 진행 가능.

### 후속 권장 사항

- Unit 1 착수 전 `AGENTS.template.md` 삭제가 의도된 변경인지 확인한다.
- Unit 1에서 테스트 파일이 늘어나면 테스트 typecheck 전략을 다시 검토한다.

---

## 2026-05-25 / Unit 0 보완 — pnpm 환경 정상화 2차 리뷰

### 최종 판단

- NOT PASS

### Critical

1. 현재 repo 작업 디렉터리에서 `pnpm test`가 실패한다.
   - 실행 결과:
     ```bash
     pnpm test
     ```
     ```text
     Error: Cannot find module @rollup/rollup-darwin-arm64.
     npm has a bug related to optional dependencies.
     ```
   - 확인 내용:
     - `node_modules/@rollup/rollup-darwin-arm64` 디렉터리는 존재하지만 비어 있다.
     - 현재 `node_modules`가 npm fallback과 pnpm 설치가 섞인 오염 상태로 보인다.
   - 영향: Unit 0 완료 기준인 `pnpm test` 통과를 만족하지 못한다.
   - 보완 방향: 현재 repo 루트에서 `node_modules`와 `package-lock.json`을 실제로 삭제한 뒤 `pnpm install`을 다시 수행해야 한다.

2. 현재 repo 작업 디렉터리에서 `pnpm build`가 실패한다.
   - 실행 결과:
     ```bash
     pnpm build
     ```
     ```text
     error TS2688: Cannot find type definition file for 'react_tmp_6_2'.
     ```
   - 확인 내용:
     - `node_modules/@types/react_tmp_6_2`
     - `node_modules/react_tmp_6_3`
     - 위 임시/오염 패키지 디렉터리가 존재한다.
   - 영향: TypeScript 빌드가 현재 작업 디렉터리에서 재현 가능하게 통과하지 않는다.
   - 보완 방향: 오염된 `node_modules`를 삭제하고 pnpm 기준으로 재설치해야 한다.

3. 작업 루트에 임시/빌드 산출물이 여전히 실제 파일로 남아 있다.
   - 확인된 파일:
     - `_tmp_6_*`
     - `dist`
     - `package-lock.json`
     - `vite.config.ts.timestamp-*`
     - `vitest.config.ts.timestamp-*`
     - `tsconfig.*.tsbuildinfo`
   - 현재 `.gitignore`로 숨겨진 것은 좋지만, 완료 기준에는 “산출물이 제거되어 있다”가 포함되어 있다.
   - 영향: 현재 repo 상태가 깨끗하지 않고, 일부 산출물이 실제 검증 실패 원인과 연결되어 있다.
   - 보완 방향: 삭제 가능한 산출물은 삭제한다. 권한 문제로 삭제할 수 없다면 사용자 조치가 필요한 항목으로 명확히 남기고 Unit 0 PASS 여부는 보류한다.

### Warning

1. `.npmrc`에서 hoisted linker와 `shamefully-hoist=true`를 유지하고 있다.
   - 현재 검증 실패의 직접 원인은 hoisted 자체보다 오염된 `node_modules`로 보인다.
   - Unit 0에서는 유지 가능하나, Unit 1 전에 pnpm 기본 isolated linker로 갈지 결정하는 것이 좋다.

2. test 파일 typecheck 전략은 아직 미결정이다.
   - `tsconfig.app.json`에서 test/spec 파일이 제외되어 있다.
   - Unit 1에서 순수 함수 테스트가 늘어나기 전 `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 결정하는 것이 좋다.

3. `AGENTS.template.md` 삭제가 계속 worktree에 남아 있다.
   - Unit 0과 직접 관련 없는 변경일 수 있으므로 커밋 전 의도 확인이 필요하다.

### 검증 결과

실행 환경:

```bash
node -v
```

```text
v18.17.0
```

```bash
pnpm --version
```

```text
10.33.4
```

실행 결과:

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint 실행 통과 |
| `pnpm typecheck` | PASS | `tsc --noEmit` 통과 |
| `pnpm test` | FAIL | Rollup optional dependency 디렉터리 오염/누락 |
| `pnpm build` | FAIL | `react_tmp_6_2` 타입 디렉터리 오염 |

### 보완 요청

- Unit 0 2차 보완 작업을 진행한다.
- 현재 repo 루트에서 오염된 `node_modules`를 삭제하고 `pnpm install`을 다시 수행한다.
- `package-lock.json`, `dist`, `_tmp_6_*`, `vite/vitest timestamp mjs`, `tsconfig.*.tsbuildinfo`를 실제로 삭제한다.
- 삭제가 권한 문제로 불가능하면, 어떤 파일이 삭제되지 않았는지와 사용자 수동 조치 명령을 `WORK_LOG.md`에 남긴다.
- 보완 후 현재 repo 루트에서 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`를 다시 실행한다.

### 후속 권장 사항

- 클린 `/tmp` 환경 검증은 참고 자료로만 사용하고, Unit 완료 판정은 실제 repo 루트에서 실행한 검증 결과를 기준으로 한다.
- 현재 repo 루트에서 4개 pnpm 검증 명령이 모두 통과하기 전에는 Unit 1로 넘어가지 않는다.

---

## 2026-05-25 / Unit 0 — 프로젝트 스캐폴딩 리뷰

### 최종 판단

- NOT PASS

### Critical

1. `package.json:6` — `packageManager`가 `pnpm@11.3.0`으로 고정되어 현재 작업 환경의 Node.js `v18.17.0`에서 pnpm 명령이 실행되지 않는다.
   - 영향: `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`가 모두 pnpm 실행 단계에서 실패한다.
   - 확인 결과:
     ```bash
     pnpm lint
     ```
     ```text
     ERROR: This version of pnpm requires at least Node.js v22.13
     The current version of Node.js is v18.17.0
     ```
   - 보완 방향: 현재 프로젝트가 Node 18 호환을 유지할지, Node 22.13 이상을 필수로 할지 결정해야 한다. 별도 결정이 없다면 Vite 6/React 19 프로토타입 기준으로 `pnpm@10` 계열을 사용해 현재 Node 18 환경에서도 검증 가능하게 맞춘다.

2. pnpm 프로젝트 기준 lockfile이 없다.
   - 영향: `packageManager`와 문서에서는 pnpm 사용을 명시했지만 `pnpm-lock.yaml`이 없어 의존성 재현성이 없다.
   - 보완 방향: npm fallback 결과물인 `package-lock.json`/`node_modules`를 정리한 뒤 `pnpm install`로 `pnpm-lock.yaml`을 생성한다.

3. 작업 루트에 빌드/테스트 임시 산출물이 untracked 상태로 남아 있다.
   - 대상:
     - `_tmp_6_*`
     - `vitest.config.ts.timestamp-*.mjs`
     - `vite.config.ts.timestamp-*.mjs`
     - `dist`
     - `package-lock.json`
   - 영향: 커밋 전 작업 범위와 산출물이 섞이고, 이후 리뷰/커밋에서 불필요한 파일이 포함될 위험이 있다.
   - 보완 방향: 산출물을 삭제하거나 `.gitignore`에 필요한 패턴을 추가한다. 단, `pnpm-lock.yaml`은 생성 후 커밋 대상이어야 한다.

### Warning

1. `eslint.config.js:5` — `globals` 패키지를 직접 import하지만 `package.json`의 `devDependencies`에 명시되어 있지 않다.
   - 영향: 현재 `.npmrc`의 hoisting 설정 또는 npm fallback 환경에서는 통과할 수 있지만, pnpm 기본 strict 의존성 관점에서는 직접 의존성을 명시하는 편이 안전하다.
   - 보완 방향: `globals`를 `devDependencies`에 추가한다.

2. `tsconfig.app.json:28` — test/spec 파일이 app typecheck 대상에서 제외되어 있다.
   - 영향: `pnpm typecheck`가 테스트 파일 타입 오류를 잡지 못할 수 있다.
   - 보완 방향: Unit 0에서는 별도 보완 필수는 아니지만, `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 Unit 1 이전에 결정하는 것을 권장한다.

3. `.npmrc` — `node-linker=hoisted`, `shamefully-hoist=true`가 sandbox 대응 목적으로 추가되어 있다.
   - 영향: pnpm 기본 node linker와 다르므로 실제 프로젝트 운영 방식과 다를 수 있다.
   - 보완 방향: 현재 환경에서 꼭 필요한지 확인하고, 불필요하면 제거한다. 유지할 경우 이유를 문서화한다.

4. `AGENTS.template.md` 삭제가 worktree에 남아 있다.
   - 영향: Unit 0 범위와 직접 관련 없는 변경일 수 있다.
   - 보완 방향: 의도된 삭제인지 확인 후 커밋 범위에 포함하거나 복구한다.

### 검증 결과

실행 환경:

```bash
node -v
```

```text
v18.17.0
```

pnpm 기준 검증:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

- 결과: 모두 실패
- 실패 원인: `pnpm@11.3.0`이 Node.js `v22.13` 이상을 요구한다.

npm fallback 기반 직접 실행 확인:

```bash
./node_modules/.bin/eslint .
./node_modules/.bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
./node_modules/.bin/tsc -b
```

- `eslint`: PASS
- `tsc --noEmit`: PASS
- `vitest`: FAIL
  - npm optional dependency 이슈로 `@rollup/rollup-darwin-arm64`를 찾지 못함
- `tsc -b`: FAIL
  - sandbox 권한으로 `tsconfig.*.tsbuildinfo` 쓰기 실패

### 보완 요청

- Unit 0 보완 작업을 먼저 진행한다.
- `packageManager`와 Node 버전 정책을 정리한다.
- pnpm 기반 설치/lockfile/검증이 가능한 상태로 맞춘다.
- untracked 임시 산출물을 정리한다.
- `globals` 직접 의존성을 명시한다.
- 보완 후 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` 결과를 다시 기록한다.

### 후속 권장 사항

- Unit 0이 PASS 되기 전에는 Unit 1로 넘어가지 않는다.
- 테스트 파일 typecheck 전략은 Unit 1 시작 전 또는 Unit 1에서 순수 함수 테스트를 작성하기 전에 확정한다.

---

## YYYY-MM-DD / Unit X — 리뷰 대상

### 최종 판단

- TODO: PASS / PASS WITH WARNINGS / NOT PASS

### Critical

- TODO: 없으면 "없음"으로 기록한다.

### Warning

- TODO: 없으면 "없음"으로 기록한다.

### 검증 결과

- TODO

### 보완 요청

- TODO

### 후속 권장 사항

- TODO
