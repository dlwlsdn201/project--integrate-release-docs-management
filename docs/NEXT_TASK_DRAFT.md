# Next Task Draft — Unit 4 문서 미리보기 고도화

## 0. 문서 목적

이 문서는 Unit 3 완료 후 착수할 다음 작업 후보를 정리한다. Unit 3 리뷰가 PASS 또는 PASS WITH WARNINGS 상태가 되면 이 내용을 `CURRENT_TASK.md`로 승격한다.

## 1. 다음 작업 후보

Unit 4 — CHANGELOG, QC Checklist, Release Note, Announcement 미리보기 구현 고도화

## 2. 선행 작업과의 연결점

- Unit 1에서 release 도메인 타입, mock 데이터, 문서 생성 순수 함수를 구성했다.
- Unit 2에서 릴리즈 목록/상세 화면과 문서 탭 기본 구조를 만들었다.
- Unit 3에서 사용자가 폼으로 추가한 릴리즈 항목이 상세 화면 상태에 반영된다.
- Unit 4는 같은 원본 데이터에서 생성되는 문서 미리보기의 정보 구조와 읽기 품질을 개선한다.

## 3. 예상 범위

### 포함 후보

- CHANGELOG 미리보기 레이아웃 개선
- QC Checklist 표 구조 개선
- Release Note 카드/섹션 구조 개선
- Announcement 텍스트 미리보기 개선
- 공개/비공개 항목 표시 정책 정리
- 문서 생성 결과가 사용자 추가 항목과 일관되게 반영되는지 테스트 보강

### 제외 후보

- QC 상태 변경
- 실패 사유 입력
- CSV/HTML/JSON export
- clipboard 복사
- 실제 API 연동
- Google Drive 백업

## 4. 설계 메모

- Unit 1 순수 함수의 반환 구조를 우선 사용한다.
- 위젯 내부에서 반복되는 표시 라벨은 `entities/release` constants로 올릴지 검토한다.
- Unit 2 Warning의 탭 URL 상태 반영을 Unit 4에서 같이 처리할지 결정한다.
- Release Note는 일반 사용자가 읽기 쉬운 구조를 우선한다.
- Announcement는 Unit 6에서 clipboard 복사가 붙을 예정이므로 텍스트 구조를 유지한다.

## 5. 착수 전 결정 필요 사항

1. 탭 상태를 Unit 4에서 URL에 반영할지, Unit 7로 넘길지 결정한다.
2. `TEST_STATUS_LABEL`을 `entities/release`로 중앙화할지 결정한다.
3. Release Note에 Before/After 이미지 placeholder를 Unit 4에서 표시할지 결정한다.

## 6. 예상 검증

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

## 7. Claude Code 지시 프롬프트 초안

```text
너는 이 repo의 구현 담당 Claude Code다. Unit 4 문서 미리보기 고도화 작업을 수행해라.

작업 전 반드시 AGENTS.md, PRD.mdc, docs/PROJECT_GUIDE.md, docs/CURRENT_TASK.md, docs/WORK_LOG.md, docs/REVIEW_LOG.md, docs/SESSION_STATE.md를 읽어라.

목표:
같은 릴리즈 원본 데이터에서 생성되는 CHANGELOG, QC Checklist, Release Note, Announcement 미리보기의 정보 구조와 읽기 품질을 개선한다.

범위:
- CHANGELOG, QC Checklist, Release Note, Announcement 탭 표시를 고도화한다.
- Unit 3에서 추가한 릴리즈 항목도 모든 문서 미리보기에 일관되게 반영되게 한다.
- 필요한 표시 라벨/상수 중앙화를 검토하고 적용한다.
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
- docs/WORK_LOG.md에 작업 결과를 기록해라.
- docs/SESSION_STATE.md를 최신 상태로 갱신해라.
- 커밋은 하지 마라.
```
