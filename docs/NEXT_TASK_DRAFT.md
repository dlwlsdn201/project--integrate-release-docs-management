# Next Task Draft — Unit 5 QC 체크리스트 상태 UX

## 0. 문서 목적

이 문서는 Unit 4 완료 후 착수할 다음 작업 후보를 정리한다. Unit 5 착수 시 이 내용을 `CURRENT_TASK.md`로 승격한다.

## 1. 다음 작업 후보

Unit 5 — QC 체크리스트 상태 변경 및 실패/차단 사유 입력 UX

## 2. 선행 작업과의 연결점

- Unit 1에서 `QCTestCase`, `TEST_STATUS`, mock 테스트 케이스 데이터를 구성했다.
- Unit 2에서 릴리즈 목록과 상세 문서 탭 기본 화면을 만들었다.
- Unit 3에서 폼 제출 시 `testScenario` + `expectedResult` 입력으로 테스트 케이스가 생성된다.
- Unit 4에서 QC Checklist 미리보기와 상태별 요약 구조를 개선했고, `TEST_STATUS_LABEL`을 `entities/release`로 중앙화했다.
- Unit 5는 QC 상태를 사용자가 변경하고, 변경 결과가 목록/상세/문서 탭에 반영되게 하는 작업이다.

## 3. 예상 범위

### 포함 후보

- QC Checklist 탭에서 테스트 케이스 상태 변경 UI 구현
  - Not Started
  - Passed
  - Failed
  - Blocked
- Failed/Blocked 상태 선택 시 사유 입력 UX 구현
- 상태 변경 시 현재 릴리즈 상세의 items state에 반영
- QC 진행률이 릴리즈 목록 또는 상세 표시와 일관되게 계산되도록 정리
- `TEST_STATUS_LABEL`과 기존 QC 요약 구조 재사용
- 핵심 상태 변경 흐름 RTL 테스트 보강

### 제외 후보

- 실제 저장 API
- TanStack Query/MSW 연동
- 릴리즈 항목 삭제
- 이미지 업로드
- CSV/HTML/JSON export
- clipboard 복사
- Google Drive 백업

## 4. 설계 메모

- 상태 변경 기능은 사용자 상호작용이므로 `features` 레이어 후보로 본다.
- 다만 테스트 케이스 상태 업데이트 계산은 release 도메인 데이터 구조에 밀접하므로 순수 helper를 `entities/release`에 둘지 검토한다.
- 페이지 경계(`ReleaseDetailPage`)가 현재 items state를 소유하므로, Unit 5에서도 상태 변경의 최종 소유자는 page에 두는 방향이 자연스럽다.
- `ReleaseDocumentTabs`가 상태 변경 UI까지 직접 소유하면 위젯 책임이 커질 수 있으므로, feature 컴포넌트로 분리하거나 callback prop을 받는 구조를 검토한다.

## 5. 착수 전 결정 필요 사항

1. QC 상태 변경 UI를 `ReleaseDocumentTabs` 내부에 둘지, 별도 `features/qc-test-status` 슬라이스로 분리할지 결정한다.
2. 실패/차단 사유 입력을 inline textarea로 둘지, 상태 선택 후 조건부 input으로 둘지 결정한다.
3. QC 진행률 계산 helper를 `widgets/release-list` 내부 유지할지, `entities/release`로 이동할지 결정한다.

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

## 7. 구현 지시 프롬프트 초안

```text
Unit 5 QC 체크리스트 상태 변경 및 실패/차단 사유 입력 UX를 구현한다.

목표:
릴리즈 상세 화면의 QC Checklist에서 테스트 케이스 상태를 변경하고, Failed/Blocked 상태에서는 사유를 입력할 수 있게 한다. 변경 결과는 현재 릴리즈 상세의 QC 요약과 문서 탭에 즉시 반영되어야 한다.

범위:
- QC 테스트 케이스 상태 변경 UI를 구현한다.
- Failed/Blocked 상태에서 사유 입력을 제공한다.
- 상태 변경 결과를 ReleaseDetailPage의 items state에 반영한다.
- QC 진행률 계산 구조를 재사용 가능하게 정리한다.
- 핵심 상태 변경 흐름 RTL 테스트를 작성한다.

제외:
- 실제 API 저장
- export/clipboard 구현
- 이미지 업로드
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
