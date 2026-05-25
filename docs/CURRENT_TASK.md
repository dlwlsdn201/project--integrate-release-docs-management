# Current Task — Unit 4 문서 미리보기 고도화

## 0. 작업 요약

ReleaseHub 상세 화면의 문서 탭(CHANGELOG, QC Checklist, Release Note, Announcement)을 같은 릴리즈 원본 데이터에서 더 읽기 좋은 미리보기로 표시한다.

Unit 1의 문서 생성 순수 함수와 Unit 3의 릴리즈 항목 추가 흐름은 유지한다. Unit 4는 데이터 생성 로직을 새로 만들기보다, 이미 생성된 문서 데이터를 사용자가 검토하기 쉬운 정보 구조로 표현하는 데 집중한다.

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

- CHANGELOG 탭 정보 구조 개선
  - 릴리즈 버전/제목 맥락 표시
  - 변경 유형별 그룹과 항목 수 표시
  - 티켓 번호, 변경 요약을 스캔하기 쉬운 구조로 표시
- QC Checklist 탭 정보 구조 개선
  - 테스트 케이스 총량과 상태별 분포 표시
  - 테스트 대상 항목, 시나리오, 기대 결과, 상태를 표로 정리
- Release Note 탭 정보 구조 개선
  - 공개 항목만 일반 사용자용 카드/섹션 구조로 표시
  - 비공개 항목 수를 별도 메타 정보로 표시
  - 사용자용 설명을 주요 본문으로 표시
- Announcement 탭 정보 구조 개선
  - Unit 1의 `generateAnnouncement` 결과 텍스트를 유지
  - Unit 6 clipboard 버튼 전 단계로, 사용자가 선택/복사하기 쉬운 read-only 텍스트 형태로 표시
- 표시 라벨/상수 중앙화
  - `TEST_STATUS_LABEL`을 `entities/release` constants로 이동
- Unit 3에서 추가한 릴리즈 항목이 문서 탭에 반영되는 흐름 테스트 보강 또는 유지

### 제외

- QC 상태 변경
- 실패 사유 입력/수정
- CSV/HTML/JSON export
- clipboard API 기반 복사 버튼
- 실제 GitLab API 연동
- TanStack Query/MSW 연동
- Google Drive 백업
- 이미지 업로드
- 복잡한 전역 상태 관리
- 커밋

## 3. 예상 변경 파일

### 수정 후보

- `src/entities/release/model/constants.ts`
- `src/entities/release/index.ts`
- `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.tsx`
- `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.test.tsx`
- `docs/WORK_LOG.md`
- `docs/REVIEW_LOG.md`
- `docs/SESSION_STATE.md`

필요 시:

- `src/pages/release-detail/ui/ReleaseDetailPage.test.tsx`

## 4. 구현 규칙

- 패키지 매니저는 `pnpm`을 사용한다.
- FSD 레이어 규칙을 지킨다.
- `widgets/release-document-tabs`는 `@entities/release` public API만 사용한다.
- `entities/release` 내부 파일을 deep import하지 않는다.
- 문서 생성 로직은 Unit 1의 순수 함수(`generateChangelog`, `generateQcChecklist`, `generateReleaseNote`, `generateAnnouncement`)를 우선 사용한다.
- 새 비즈니스 규칙이 필요하면 먼저 `entities/release`의 상수/타입으로 둘지 검토한다.
- `any`를 사용하지 않는다.
- React 19 기준으로 불필요한 `import React`를 작성하지 않는다.
- UI 테스트는 사용자 관점의 role/label/text 기반으로 작성하고, CSS 클래스나 스냅샷은 테스트하지 않는다.
- Tailwind CSS만 사용한다.
- Unit 4 범위 밖인 export/clipboard/QC 상태 변경은 구현하지 않는다.

## 5. 테스트 및 검증

아래 검증을 실행한다.

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

- CHANGELOG가 변경 유형별 그룹과 항목 수를 표시한다.
- QC Checklist가 테스트 케이스 총량과 상태별 분포를 표시한다.
- Release Note가 공개 항목 중심의 사용자용 카드/섹션 구조로 표시된다.
- Announcement가 생성 텍스트를 선택/복사하기 쉬운 read-only 텍스트 형태로 표시한다.
- `TEST_STATUS_LABEL`이 `entities/release` public API로 중앙화된다.
- Unit 3에서 추가한 릴리즈 항목이 문서 탭에 반영되는 테스트가 유지되거나 보강된다.
- FSD 레이어 역참조와 deep import가 없다.
- `pnpm lint`가 통과한다.
- `pnpm test`가 통과한다.
- `pnpm typecheck`가 통과한다.
- `pnpm build`가 통과한다.
- `WORK_LOG.md`에 Unit 4 결과가 기록된다.
- `REVIEW_LOG.md`에 Unit 4 자체 리뷰 결과가 기록된다.
- `SESSION_STATE.md`가 최신 상태로 갱신된다.

## 7. 구현 지시

```text
Unit 4 문서 미리보기 고도화 작업을 수행한다.

목표:
같은 릴리즈 원본 데이터에서 생성되는 CHANGELOG, QC Checklist, Release Note, Announcement 미리보기의 정보 구조와 읽기 품질을 개선한다.

범위:
- CHANGELOG, QC Checklist, Release Note, Announcement 탭 표시를 고도화한다.
- Unit 3에서 추가한 릴리즈 항목도 모든 문서 미리보기에 일관되게 반영되게 한다.
- TEST_STATUS_LABEL을 entities/release constants로 중앙화한다.
- 핵심 문서 미리보기 흐름 테스트를 보강한다.

제외:
- QC 상태 변경
- export/clipboard 구현
- 실제 API 연동
- Google Drive 백업

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후:
- docs/WORK_LOG.md에 작업 결과를 기록한다.
- docs/REVIEW_LOG.md에 자체 리뷰 결과를 기록한다.
- docs/SESSION_STATE.md를 최신 상태로 갱신한다.
- 커밋은 하지 않는다.
```
