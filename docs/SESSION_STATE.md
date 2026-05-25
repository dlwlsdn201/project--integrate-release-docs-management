# Session State — 세션 재개 상태

## 0. 문서 목적

이 문서는 세션이 끊기거나 다음 날 작업을 이어갈 때 현재 상태를 빠르게 복구하기 위한 문서다.

## 1. 현재 상태

- 현재 브랜치: `main`
- 현재 작업: Unit 2 준비 완료 — Claude Code 구현 대기
- 마지막 완료 작업: Unit 1 릴리즈 도메인 모델과 mock 데이터 구현 (2026-05-25)
- 마지막 커밋: `12ce7e3` 🔩 프로젝트 환경 구성 및 초기 스캐폴딩 (Unit 1은 커밋 없음)
- 커밋 여부: 미커밋 (Unit 1 변경사항이 worktree에 있음)
- 리뷰 상태: Unit 1 PASS WITH WARNINGS

## 2. 미완료 작업

- Unit 2 앱 레이아웃과 릴리즈 목록/상세 기본 화면 (CURRENT_TASK.md 작성 완료, 구현 전)
- Unit 3 릴리즈 항목 등록/수정 폼
- Unit 4 문서 미리보기
- Unit 5 QC 체크리스트 상태 UX
- Unit 6 Export와 공지문 복사
- Unit 7 UI Polish
- Unit 8 테스트/문서 정리

## 3. 현재 worktree 주의사항

- Unit 1 신규 파일들이 미커밋 상태다. Unit 1 리뷰는 PASS WITH WARNINGS이며 커밋 여부는 Unit 2 착수 전 결정한다.
- `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` 모두 PASS (2026-05-25 기준).
- Unit 1에서 생성된 파일: `src/entities/release/` 하위 7개 파일, `src/entities/index.ts` 수정
- test 파일 typecheck 전략은 Unit 8에서 재검토 예정 (tsconfig.app.json에서 test 파일 exclude 유지).

## 4. 다음 액션

1. Claude Code가 `docs/CURRENT_TASK.md`를 읽고 Unit 2를 수행한다.
2. 완료 후 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`를 실행한다.
3. `docs/WORK_LOG.md`와 `docs/SESSION_STATE.md`를 갱신한다.

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
