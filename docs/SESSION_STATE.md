# Session State — 세션 재개 상태

## 0. 문서 목적

이 문서는 세션이 끊기거나 다음 날 작업을 이어갈 때 현재 상태를 빠르게 복구하기 위한 문서다.

## 1. 현재 상태

- 현재 브랜치: `main`
- 현재 작업: Stitch Task Detail Editor v5 디자인 보완 및 Unit 9 UX 설계
- 마지막 완료 작업: GitLab MR AI 초안 및 우측 실시간 미리보기 하네스 설계 (2026-07-19)
- 마지막 커밋: `12ce7e3` 🔩 프로젝트 환경 구성 및 초기 스캐폴딩
- 커밋 여부: 기획 문서 변경 미커밋
- 리뷰 상태: Unit 1~8 PASS, Stitch Task Detail Editor v4 NOT PASS

## 2. 미완료 작업

- Stitch v5 디자인 생성 및 재검수
- Unit 9 구현 범위 확정 후 `CURRENT_TASK.md` 갱신

## 3. 현재 worktree 주의사항

- 현재 `git status --short` 기준 worktree에는 기획 문서 변경이 있다.
- `docs/PRODUCT_PLAN.md`, `docs/STITCH_DESIGN_BRIEF.md`, `docs/README.md`, `docs/WORK_LOG.md`, `docs/SESSION_STATE.md`에 기획 보강 변경이 있다.
- Mac mini에서 이어서 작업할 때는 최신 `main`을 pull 받은 뒤 `pnpm install`을 실행한다.
- Unit 0 검증 결과: `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` 모두 PASS.
- `.npmrc`는 hoisted linker를 유지한다. 필요 시 Unit 1 전에 isolated 전환 여부를 별도로 결정한다.
- `README.md`는 현재 보일러플레이트 설명이다. 앱 완성 후 ReleaseHub 서비스 README로 교체 예정.
- Unit 1 구현 전에 `PRD.mdc`의 `ReleaseItem`, `QCTestCase` 타입 초안과 `docs/PRODUCT_PLAN.md`의 `ReleaseTask`, `Evidence`, `QcCase` 모델을 통합해 SSOT를 확정한다.
- Stitch v4에는 저장소 입력처럼 보이는 필드가 있었지만 Search Select 식별성과 MR 선택 단계가 부족했다.
- Unit 9는 MR 선택 후 AI 변경 요약 초안을 만들되 사용자 수정 내용을 자동 덮어쓰지 않는 것을 핵심 규칙으로 한다.
- 데스크톱 Task Detail Editor는 좌측 편집, 우측 sticky preview 구조를 유지한다.
- Unit 9는 외부 LLM API Key를 사용하지 않고 `SummaryDraftGenerator` 계약과 mock adapter만 구현한다.
- 실제 사내 LLM은 추후 서버/BFF adapter로 연결하며 프론트엔드에는 credential과 endpoint를 노출하지 않는다.

## 4. 다음 액션

1. `docs/STITCH_DESIGN_BRIEF.md`의 v5 보완 프롬프트를 Stitch에 전달한다.
2. 저장소/MR Search Select, AI 상태, 사용자 입력 보호, 우측 sticky preview를 검수한다.
3. 디자인 승인 후 `docs/NEXT_TASK_DRAFT.md`의 Unit 9 범위를 확정한다.
4. 실제 구현 착수 시에만 `docs/CURRENT_TASK.md`를 Unit 9 지시서로 갱신한다.
5. MR diff 전달 범위, 보안 정책, AI 생성 API 계약, stale 판정 기준을 확정한다.
6. 실제 사내 LLM 연동 전 연구소와 endpoint 인증, 로깅, timeout 정책을 합의한다.

## 5. 재개 시 읽을 문서

- `AGENTS.md`
- `PRD.mdc`
- `docs/README.md`
- `docs/PROJECT_GUIDE.md`
- `docs/PRODUCT_PLAN.md`
- `docs/STITCH_DESIGN_BRIEF.md`
- `docs/CURRENT_TASK.md`
- `docs/NEXT_TASK_DRAFT.md`
- `docs/WORK_LOG.md`
- `docs/REVIEW_LOG.md`
- `docs/CLAUDE_CODE_PROMPTS.md`
