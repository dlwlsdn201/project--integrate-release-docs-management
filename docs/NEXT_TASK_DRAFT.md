# Next Task Draft

Unit 8까지 완료된 상태다.

## 다음 후보

- Unit 9: GitLab 저장소/MR 선택, AI 변경 요약 초안, 우측 실시간 미리보기 UX
- Unit 1~8 변경사항을 기능 단위로 커밋
- 실제 GitLab API 연동 설계
- TanStack Query/MSW 기반 mock API 레이어 도입
- Google Drive 백업/export 확장
- 브라우저 기반 시각 QA 보강

## 우선 후보 — Unit 9

### 목표

GitLab 연동을 `저장소 → MR` 순서로 명확히 만들고, MR 선택 후 AI가 생성한 `변경 내용 요약` 초안을 사용자가 검토·수정한 뒤 저장하는 human-in-the-loop 흐름을 구현한다. 편집 중 생성 산출물은 데스크톱 우측 sticky preview에서 실시간 확인한다.

### UX 상태

- GitLab 미연동
- 저장소 선택 전
- 저장소 선택 완료 / MR 미선택
- MR 조회 중 / 선택 완료
- AI 분석 중
- AI 초안 생성 완료
- AI 초안 사용자 수정됨
- AI 생성 실패
- MR 변경으로 초안 stale

### 주요 규칙

- GitLab 연동을 사용하는 경우 저장소는 필수, MR은 선택이다.
- MR은 선택한 저장소 범위에서만 검색한다.
- 최초 MR 선택 시 변경 요약이 비어 있으면 AI 초안을 자동 입력한다.
- 사용자 입력이 있으면 자동 덮어쓰지 않고 비교 후 적용한다.
- AI 실패는 태스크 저장을 막지 않는다.
- 미리보기는 저장된 값이 아니라 현재 폼 값을 반영한다.
- 프로토타입은 외부 LLM API나 개인 API Key를 사용하지 않는다.
- UI는 모델 구현이 아니라 `SummaryDraftGenerator` 포트에 의존한다.
- 현재 adapter는 테스트 가능한 deterministic mock으로 구현한다.
- 사내 LLM 연결 주석은 adapter factory 한 곳에만 남긴다.

### 예상 변경 범위

- GitLab project/MR mock 타입과 데이터
- release item form schema 및 mapper
- 저장소/MR Search Select UI
- AI draft 상태 모델과 mock 생성 함수
- `SummaryDraftGenerator` port, mock adapter, adapter factory
- Change Summary 편집 및 재생성 비교 UX
- Task Detail Editor 2-column sticky preview 레이아웃
- happy path, 사용자 입력 보호, AI 실패 테스트

### 착수 전 결정

- `SummaryDraftGenerator` 입력·출력 계약
- MR diff 원문을 AI에 전달할 범위와 보안 정책
- stale 판정 기준으로 사용할 MR head SHA 저장 방식
- 데스크톱 split 비율과 좁은 화면 전환 breakpoint를 디자인 토큰으로 확정

### 사내 LLM 후속 연결 원칙

- 외부 상용 LLM과 개인 API Key는 사용하지 않는다.
- 사내 연구소 LLM은 서버/BFF의 `InternalLlmSummaryDraftGenerator` adapter에서 호출한다.
- 프론트엔드에는 endpoint, token, model credential을 노출하지 않는다.
- 서버가 GitLab 권한을 확인하고 MR 데이터를 수집·정제한다.
- timeout, retry, audit log, 민감정보 마스킹 정책은 실제 연동 Unit에서 확정한다.
- Unit 9에서는 실제 네트워크 연동 코드를 미리 만들지 않고 교체 지점과 계약만 남긴다.
