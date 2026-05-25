# Claude Code Prompts

## 0. 문서 목적

이 문서는 ReleaseHub 프로토타입을 단위 작업으로 나누어 Claude Code에게 전달할 프롬프트를 누적 관리한다.

실제 실행할 단 하나의 작업은 `CURRENT_TASK.md`에 둔다. 이 문서는 다음 작업을 준비하거나 세션을 재개할 때 재사용 가능한 프롬프트 저장소로 사용한다.

## 공통 지시

모든 Unit 작업에서 Claude Code는 다음 원칙을 따른다.

```text
너는 이 repo의 구현 담당 Claude Code다.

작업 전 반드시 다음 문서를 읽어라.
- AGENTS.md
- PRD.mdc
- docs/README.md
- docs/PROJECT_GUIDE.md
- docs/CURRENT_TASK.md
- docs/WORK_LOG.md
- docs/REVIEW_LOG.md
- docs/SESSION_STATE.md

규칙:
- CURRENT_TASK.md의 포함/제외 범위를 엄격히 지켜라.
- 범위 밖 리팩터링과 전체 포맷 변경은 하지 마라.
- 패키지 매니저는 pnpm을 사용해라.
- React 19 기준으로 불필요한 import React를 작성하지 마라.
- any를 사용하지 마라.
- API 계약, 상수, 타입, 비즈니스 규칙은 SSOT로 관리해라.
- 작업 완료 후 필요한 검증 명령을 실행하고 결과를 기록해라.
- docs/WORK_LOG.md와 docs/SESSION_STATE.md를 최신 상태로 갱신해라.
- 커밋은 하지 마라.
```

## Unit 0 — 프로젝트 스캐폴딩

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 0 프로젝트 스캐폴딩을 수행해라.

작업 전 반드시 다음 문서를 읽어라.
- AGENTS.md
- PRD.mdc
- docs/README.md
- docs/PROJECT_GUIDE.md
- docs/CURRENT_TASK.md
- .rules/project-rules_architecture.mdc
- .rules/project-rules_working.mdc
- .rules/project-rules_naming.mdc
- .rules/project-rules_testing-policy.mdc

목표:
Vite + React 19 + TypeScript 기반 SPA 개발 환경을 구성하고, Tailwind CSS, ESLint, Prettier, Vitest, React Testing Library, TypeScript path alias, FSD 기본 디렉토리를 준비해라.

범위:
- docs/CURRENT_TASK.md의 포함/제외 범위를 엄격히 지켜라.
- 릴리즈 도메인 기능, mock API, 폼, 상세 화면은 구현하지 마라.
- 초기 화면은 ReleaseHub 프로토타입 목적을 보여주는 최소 화면이면 충분하다.

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후:
- docs/WORK_LOG.md 상단에 Unit 0 작업 결과를 기록해라.
- docs/SESSION_STATE.md를 최신 상태로 갱신해라.
- 실패한 검증이 있다면 기존 실패와 신규 실패를 구분해서 기록해라.
- 커밋은 하지 마라.
```

## Unit 1 — 도메인 모델과 mock 데이터

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 1 도메인 모델과 mock 데이터 작업을 수행해라.

작업 전 반드시 AGENTS.md, PRD.mdc, docs/PROJECT_GUIDE.md, docs/CURRENT_TASK.md, docs/WORK_LOG.md, docs/REVIEW_LOG.md, docs/SESSION_STATE.md를 읽어라.

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

완료 후:
- docs/WORK_LOG.md에 작업 결과를 기록해라.
- docs/SESSION_STATE.md를 최신 상태로 갱신해라.
- 커밋은 하지 마라.
```

## Unit 2 — 앱 레이아웃과 릴리즈 목록/상세 기본 화면

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면을 구현해라.

목표:
ReleaseHub의 주요 정보 구조를 확인할 수 있는 SPA 화면 뼈대를 만든다.

범위:
- 앱 레이아웃과 라우팅을 구성한다.
- 릴리즈 목록 화면을 만든다.
- 릴리즈 상세 화면에 Overview, CHANGELOG, QC Checklist, Release Note, Announcement 탭을 구성한다.
- Unit 1의 mock release 데이터를 사용한다.

제외:
- 릴리즈 항목 등록 폼 구현
- QC 상태 변경
- export 구현
- 실제 API 연동

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 3 — 릴리즈 항목 등록/수정 폼

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 3 릴리즈 항목 등록/수정 폼을 구현해라.

목표:
GitLab mock 데이터를 기반으로 릴리즈 항목을 등록하거나 수정할 수 있는 폼 흐름을 만든다.

범위:
- React Hook Form + Zod 기반 폼을 작성한다.
- GitLab issue/MR URL 또는 mock 선택으로 기본 정보를 채운다.
- CHANGELOG 요약, 사용자용 설명, 테스트 케이스, Before/After 이미지 URL 입력을 지원한다.
- 성공 시 릴리즈 상세 데이터에 반영한다.
- 실패 시 Dialog를 유지하고 성공 시에만 닫는다.

제외:
- 실제 GitLab API 연동
- 파일 업로드 스토리지
- Google Drive 연동

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 4 — 문서 미리보기

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 4 문서 미리보기 화면을 구현해라.

목표:
하나의 릴리즈 원본 데이터에서 CHANGELOG, QC Checklist, Release Note, Announcement 뷰가 생성되는 흐름을 완성한다.

범위:
- CHANGELOG 탭에서 변경 유형별 그룹핑을 표시한다.
- QC Checklist 탭에서 테스트 항목과 기대 결과를 표시한다.
- Release Note 탭에서 공개 항목을 사용자용 상세 변경사항으로 표시한다.
- Announcement 탭에서 전사 메신저 공지문 텍스트를 표시하고 복사 버튼을 제공한다.

제외:
- CSV/HTML 다운로드
- QC 상태 변경 저장
- 실제 clipboard 실패 복잡 처리

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 5 — QC 체크리스트 상태 UX

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 5 QC 체크리스트 상태 변경 UX를 구현해라.

목표:
릴리즈 전 QC 기간에 개발자/테스터가 테스트 상태와 실패 사유를 관리할 수 있게 한다.

범위:
- 테스트 상태를 Not Started, Passed, Failed, Blocked로 변경한다.
- Failed/Blocked 상태에서 사유 입력을 제공한다.
- QC 진행률을 목록/상세에 반영한다.

제외:
- 서버 저장
- 권한 관리
- 실시간 협업

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 6 — Export와 공지문 복사

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 6 Export와 공지문 복사 기능을 구현해라.

목표:
릴리즈 산출물을 Google Drive 백업 전 단계로 파일 또는 텍스트 형태로 내보낼 수 있게 한다.

범위:
- CHANGELOG CSV export
- QC Checklist CSV export
- Release Note HTML export
- 전체 Release JSON export
- Announcement clipboard copy UX

제외:
- 실제 Google Drive API 연동
- PDF 생성
- 사내 메신저 자동 발송

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 7 — UI Polish

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 7 UI Polish 작업을 수행해라.

목표:
프로토타입을 데모 가능한 수준으로 다듬고, 주요 화면에서 텍스트 겹침과 흐름 단절을 제거한다.

범위:
- 데스크톱/모바일 반응형 보완
- 빈 상태, 에러 상태, 로딩 상태 보완
- 버튼, 탭, 폼 컨트롤, 상태 배지 시각 일관성 보완
- 접근성 쿼리 기준에 맞는 label/role 보완

제외:
- 기능 범위 확장
- 디자인 시스템 신규 구축
- 전체 스타일 재작성

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```

## Unit 8 — 테스트/문서 정리

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 8 테스트와 문서 정리 작업을 수행해라.

목표:
프로토타입의 핵심 흐름을 테스트와 문서로 방어하고, README를 실제 구현 상태에 맞게 업데이트한다.

범위:
- 핵심 순수 함수 테스트 보강
- 핵심 feature happy path/failed path 테스트 보강
- README 실행 방법, 주요 기능, 구현 범위 업데이트
- WORK_LOG.md와 SESSION_STATE.md 정리

제외:
- 신규 기능 추가
- 테스트 커버리지 숫자만 맞추기 위한 저가치 테스트
- 스냅샷 테스트

검증:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

완료 후 WORK_LOG.md와 SESSION_STATE.md를 갱신하고 커밋은 하지 마라.
```
