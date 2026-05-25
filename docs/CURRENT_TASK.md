# Current Task — Unit 1 도메인 모델과 mock 데이터

## 0. 작업 요약

ReleaseHub의 릴리즈 원본 데이터를 표현하는 타입, 상수, mock 데이터, 문서 생성 순수 함수를 구성한다.

Unit 0에서 Vite + React + TypeScript + pnpm 기반 개발 환경이 준비되었으므로, 이번 작업에서는 UI 구현 없이 도메인 모델과 데이터 생성 로직만 작성한다.

## 1. 반드시 읽을 문서

- `AGENTS.md`
- `PRD.mdc`
- `docs/README.md`
- `docs/PROJECT_GUIDE.md`
- `docs/WORK_LOG.md`
- `docs/REVIEW_LOG.md`
- `docs/SESSION_STATE.md`
- `.rules/project-rules_architecture.mdc`
- `.rules/project-rules_working.mdc`
- `.rules/project-rules_naming.mdc`
- `.rules/project-rules_testing-policy.mdc`

## 2. 작업 범위

### 포함

- Release, ReleaseItem, QCTestCase 타입 정의
- ReleaseStatus, ChangeCategory, TestStatus 상수/타입 정의
- mock GitLab issue/MR 데이터 작성
- mock release/releaseItem/testCase 데이터 작성
- 릴리즈 문서 생성 순수 함수 작성
  - CHANGELOG 그룹핑
  - QC 테스트 케이스 목록 생성
  - Release Note 공개 항목 생성
  - Announcement 텍스트 생성
- 순수 함수 테스트 작성
- `WORK_LOG.md`, `SESSION_STATE.md` 갱신

### 제외

- 실제 API fetcher 구현
- TanStack Query hook 구현
- 화면 UI 구현
- 릴리즈 항목 등록 폼 구현
- export 다운로드 구현
- 실제 GitLab/Google Drive API 연동
- 커밋

## 3. 예상 변경 파일

### 신규 후보

- `src/entities/release/model/types.ts`
- `src/entities/release/model/constants.ts`
- `src/entities/release/model/mock-gitlab.ts`
- `src/entities/release/model/mock-release.ts`
- `src/entities/release/model/generate-release-documents.ts`
- `src/entities/release/model/generate-release-documents.test.ts`
- `src/entities/release/index.ts`

### 수정 후보

- `src/entities/index.ts`
- `docs/WORK_LOG.md`
- `docs/SESSION_STATE.md`

## 4. 구현 규칙

- 패키지 매니저는 `pnpm`을 사용한다.
- FSD 레이어 규칙을 지킨다.
- 릴리즈 도메인은 `entities/release` 슬라이스에서 소유한다.
- UI와 무관한 도메인 타입/상수/순수 함수만 구현한다.
- 매직 스트링은 상수 또는 config 객체로 관리한다.
- `any`를 사용하지 않는다.
- exported 함수에는 JSDoc을 작성한다.
- 테스트는 co-location으로 작성한다.
- 범위 밖 리팩터링과 전체 포맷 변경은 하지 않는다.

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

- 릴리즈 도메인 타입과 상태/분류 상수가 SSOT로 정의되어 있다.
- mock GitLab 데이터와 mock release 데이터가 분리되어 있다.
- 같은 release 원본 데이터에서 CHANGELOG, QC Checklist, Release Note, Announcement 데이터가 생성된다.
- 순수 함수 테스트가 통과한다.
- `pnpm lint`가 통과한다.
- `pnpm test`가 통과한다.
- `pnpm typecheck`가 통과한다.
- `pnpm build`가 통과한다.
- `WORK_LOG.md`에 Unit 1 결과가 기록된다.
- `SESSION_STATE.md`가 최신 상태로 갱신된다.

## 7. Claude Code 지시 프롬프트

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 1 도메인 모델과 mock 데이터 작업을 수행해라.

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
ReleaseHub의 릴리즈 원본 데이터를 표현하는 타입, 상수, mock 데이터, 문서 생성 순수 함수를 작성해라.

범위:
- Release, ReleaseItem, QCTestCase 모델을 정의한다.
- ReleaseStatus, ChangeCategory, TestStatus는 SSOT로 관리한다.
- mock GitLab issue/MR 데이터와 mock release 데이터를 분리한다.
- CHANGELOG, QC Checklist, Release Note, Announcement 생성 순수 함수를 작성한다.
- 순수 함수 테스트를 co-location으로 작성한다.

제외:
- UI 구현, 폼 구현, API 연동, TanStack Query hook 구현은 하지 마라.

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
