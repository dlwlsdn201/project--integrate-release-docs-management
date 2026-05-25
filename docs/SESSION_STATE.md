# Session State — 세션 재개 상태

## 0. 문서 목적

이 문서는 세션이 끊기거나 다음 날 작업을 이어갈 때 현재 상태를 빠르게 복구하기 위한 문서다.

## 1. 현재 상태

- 현재 브랜치: `main`
- 현재 작업: Unit 1 도메인 모델과 mock 데이터 착수 대기
- 마지막 완료 작업: Unit 0 프로젝트 환경 구성 및 초기 스캐폴딩 커밋 완료 (2026-05-25)
- 마지막 커밋: `12ce7e3` 🔩 프로젝트 환경 구성 및 초기 스캐폴딩
- 커밋 여부: 커밋 완료, worktree clean
- 리뷰 상태: Unit 0 PASS WITH WARNINGS

## 2. 미완료 작업

- Unit 1 릴리즈 도메인 모델과 mock 데이터
- Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면
- Unit 3 릴리즈 항목 등록/수정 폼
- Unit 4 문서 미리보기
- Unit 5 QC 체크리스트 상태 UX
- Unit 6 Export와 공지문 복사
- Unit 7 UI Polish
- Unit 8 테스트/문서 정리

## 3. 현재 worktree 주의사항

- 현재 `git status --short` 기준 worktree는 clean 상태다.
- Mac mini에서 이어서 작업할 때는 최신 `main`을 pull 받은 뒤 `pnpm install`을 실행한다.
- Unit 0 검증 결과: `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` 모두 PASS.
- `.npmrc`는 hoisted linker를 유지한다. 필요 시 Unit 1 전에 isolated 전환 여부를 별도로 결정한다.
- `README.md`는 현재 보일러플레이트 설명이다. 앱 완성 후 ReleaseHub 서비스 README로 교체 예정.

## 4. 다음 액션

1. Mac mini에서 repo를 최신화한다.
2. `pnpm install`을 실행한다.
3. `docs/CURRENT_TASK.md`를 기준으로 Claude Code가 Unit 1을 수행한다.
4. Claude Code가 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`를 실행한다.
5. Claude Code가 `docs/WORK_LOG.md`와 이 문서를 갱신한다.
6. GPT가 Unit 1 결과를 리뷰한다.

## 5. 재개 시 읽을 문서

- `AGENTS.md`
- `PRD.mdc`
- `docs/README.md`
- `docs/PROJECT_GUIDE.md`
- `docs/CURRENT_TASK.md`
- `docs/NEXT_TASK_DRAFT.md`
- `docs/WORK_LOG.md`
- `docs/REVIEW_LOG.md`
- `docs/CLAUDE_CODE_PROMPTS.md`
