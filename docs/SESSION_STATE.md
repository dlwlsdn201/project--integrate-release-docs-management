# Session State — 세션 재개 상태

## 0. 문서 목적

이 문서는 세션이 끊기거나 다음 날 작업을 이어갈 때 현재 상태를 빠르게 복구하기 위한 문서다.

## 1. 현재 상태

- 현재 브랜치: `main`
- 현재 작업: Unit 1 도메인 모델과 mock 데이터 착수 대기
- 마지막 완료 작업: Unit 0 2차 보완 — repo 루트 4개 검증 PASS (2026-05-25)
- 커밋 여부: 미커밋 (커밋 금지 지시)
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

- **`node_modules/`**: sandbox 오염 상태 (pnpm+npm 혼합 + `react_tmp_*`, `cssstyle_tmp_*` 위조 패키지). `@types/react_tmp_6_2`에 stub 파일 생성으로 typecheck 통과 상태. **사용자 머신에서 `rm -rf node_modules dist package-lock.json` 후 `pnpm install` 권장**
- **`pnpm-lock.yaml`**: pnpm 10.33.4 + hoisted linker 기준으로 생성됨. 커밋 대상
- **`package-lock.json`**: sandbox EPERM으로 삭제 불가. `.gitignore` 적용됨. 사용자 머신에서 삭제 권장
- **`dist/`**: sandbox EPERM으로 삭제 불가. `.gitignore` 적용됨. 사용자 머신에서 삭제 권장
- **`_tmp_6_*`**: agent 프레임워크 임시 파일. `.gitignore` 적용됨
- **`.npmrc`**: hoisted linker 유지 이유 주석 명시. 필요 시 Unit 1 전에 isolated 전환 결정
- `README.md`는 현재 보일러플레이트 설명. 앱 완성 후 교체 예정

## 4. 다음 액션

1. Claude Code가 `docs/CURRENT_TASK.md`를 기준으로 Unit 1을 수행한다.
2. Claude Code가 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`를 실행한다.
3. Claude Code가 `docs/WORK_LOG.md`와 이 문서를 갱신한다.
4. GPT가 Unit 1 결과를 리뷰한다.

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
