# ReleaseHub Product Plan

## 1. 배경

현재 사내 릴리즈 형상관리 산출물은 작업 1건을 완료할 때마다 세 문서에 나뉘어 작성된다.

| 산출물 | 현재 형식 | 주요 역할 |
| --- | --- | --- |
| 릴리즈 노트 | Google Docs | 버전 정보, Major/Minor 요약, 이슈별 상세 설명, Before/After 화면, MR 링크 제공 |
| CHANGELOG | Google Sheets | 서비스별 버전 히스토리와 Major/Minor 요약 제공 |
| QC 케이스 보드 | Google Sheets | 릴리즈 전 테스트 절차, 기대 결과, 수행 상태, 최종 판단 관리 |

문제의 핵심은 문서 수가 많다는 점보다, 동일한 이슈 정보를 문서별 포맷에 맞춰 반복 작성한다는 점이다. 따라서 ReleaseHub는 세 문서를 웹 화면으로 그대로 옮기는 서비스가 아니라, 하나의 작업 기록을 원천 데이터로 삼아 세 산출물을 자동 생성하는 서비스여야 한다.

## 2. 제품 목표

### 핵심 목표

- 작업 1건당 릴리즈 정보 입력을 1회로 줄인다.
- 릴리즈 노트, CHANGELOG, QC 케이스를 동일한 원천 데이터에서 생성한다.
- Before/After 이미지와 검증 화면을 표 레이아웃에 끼워 넣지 않고 별도 Evidence 자산으로 관리한다.
- 기존 Google Docs/Sheets 프로세스를 즉시 폐기하지 않고 export 대상으로 유지한다.

### 비목표

- 초기에 GitLab, Google Drive, 사내 메신저를 모두 실시간 양방향 연동하지 않는다.
- Google Docs/Sheets의 모든 편집 기능을 웹에서 재구현하지 않는다.
- 릴리즈 승인, 권한, 감사 로그까지 한 번에 구현하지 않는다.

## 3. 핵심 제품 원칙

### 원천 데이터 우선

릴리즈 노트, CHANGELOG, QC 보드는 편집 원본이 아니라 산출물이다. 사용자는 `ReleaseTask`를 작성하고, 시스템은 산출물별 표현을 생성한다.

### 문서가 아니라 업무 흐름 중심

화면 구조는 기존 문서 단위가 아니라 다음 업무 흐름을 기준으로 설계한다.

1. 릴리즈 버전 생성
2. 작업 항목 등록
3. 증빙 이미지 첨부
4. QC 케이스 작성 및 수행
5. 산출물 미리보기
6. Google Docs/Sheets 또는 Markdown/PDF export

### AI는 작성 보조자이며 사용자가 최종 편집자

GitLab MR에서 수집한 제목, 설명, 커밋, 변경 파일, 라벨을 AI가 분석해 `변경 내용 요약` 초안을 만든다. 초안은 자동 저장되는 최종 결과가 아니며, 사용자가 내용을 검토하고 수정한 뒤 태스크를 저장해야 원천 데이터에 반영된다.

- 최초 MR 선택 시 `변경 내용 요약`이 비어 있으면 AI 초안을 자동 입력한다.
- 사용자가 이미 편집한 내용은 MR 변경이나 재생성 과정에서 자동으로 덮어쓰지 않는다.
- 기존 내용이 있으면 현재 작성본과 새 AI 초안을 비교한 뒤 적용하도록 한다.
- AI 생성에 실패해도 수동 작성과 태스크 저장 흐름은 유지한다.
- AI 초안 여부, 생성 기준 MR SHA, 생성 시각, 사용자 수정 여부를 추적한다.

### 사내 LLM 연동 경계

ReleaseHub는 팀원의 개인 구독 계정이나 외부 LLM API Key를 요구하지 않는다. 프로토타입에서는 실제 모델 호출 대신 결정적인 mock 초안 생성기를 사용하고, 추후 사내 연구소의 내장 LLM을 서버 측 어댑터로 연결한다.

- 브라우저에 외부 또는 사내 LLM API Key 입력 UI를 제공하지 않는다.
- API Key, access token, model credential을 프론트엔드 환경변수나 번들에 포함하지 않는다.
- 프론트엔드는 `SummaryDraftGenerator` 계약만 사용하고 실제 모델 종류를 알지 못한다.
- 현재 구현은 `MockSummaryDraftGenerator`를 사용한다.
- 추후 `InternalLlmSummaryDraftGenerator`가 사내 BFF/API를 호출하도록 교체한다.
- 교체 지점 주석은 generator factory 또는 adapter 한 곳에만 남기고 UI 컴포넌트에는 남기지 않는다.
- MR 원문과 diff를 사내 LLM에 전달할 범위, 보존 기간, 로깅 및 마스킹 정책은 실제 연동 전에 보안 검토한다.

```ts
type GenerateSummaryDraftInput = {
  projectId: string;
  mergeRequestIid: number;
  headSha: string;
};

type GenerateSummaryDraftResult = {
  summary: string;
  generatedAt: string;
  sourceHeadSha: string;
};

type SummaryDraftGenerator = {
  generate: (input: GenerateSummaryDraftInput) => Promise<GenerateSummaryDraftResult>;
};
```

실제 사내 LLM 연동 시에도 프론트엔드는 MR 전체 diff를 직접 전송하지 않는다. 서버가 GitLab 권한을 확인하고 필요한 변경 정보만 수집·정제한 뒤 사내 LLM을 호출해야 한다.

### 이미지 레이아웃 독립

이미지는 문서 표 내부 요소가 아니라 Evidence 자산으로 관리한다. 릴리즈 노트에서는 카드, 비교 뷰, 슬라이더 등 산출물에 맞는 방식으로 렌더링한다.

## 4. 사용자와 역할

| 역할 | 주요 관심사 |
| --- | --- |
| 개발자 | 작업 결과를 한 번만 입력하고 MR, 원인, 변경 내용, 테스트 항목을 빠르게 남긴다. |
| QA/테스터 | 테스트 케이스, 사전 조건, 기대 결과, 실제 결과, 최종 판단을 명확히 본다. |
| 릴리즈 담당자 | 버전별 준비 상태, 누락 항목, 산출물 미리보기, export 상태를 확인한다. |
| 운영/기획/일반 사용자 | 읽기 쉬운 릴리즈 노트와 전사 공지 요약을 확인한다. |

## 5. 현행 문서 필드 분석

### 릴리즈 노트에서 확인한 필드

- 릴리즈 예정 날짜
- 서비스별 릴리즈 버전: WEB, SERVER, LOG, APP
- 작업 기간
- 서비스 구분
- Major/Minor 구분
- 기능 영역: 예시 `지역,허브,장치 관리`, `장치 일괄설정`, `검색 및 분석`, `공통`
- 이슈 코드
- 담당자
- 이슈 유형
- 개발 분석
- 확인 사이트
- Before 화면
- After 화면
- 이슈 내용
- 결과 내용
- GitLab MR 링크

### CHANGELOG에서 확인한 필드

- 버전
- 날짜
- major
- minor
- 비고
- 서비스 탭: web, server, log, android, ios, bba, 개선 탭

### QC 보드에서 확인한 필드

- Test-Code
- Issue-Code
- 연관 페이지
- 테스트명
- 테스트 절차
- 사전 조건
- 예상 결과
- 작업자
- 테스터
- 상태
- 실제 결과
- 결함 정도
- 실패 원인 또는 신규 이슈
- 시행 날짜
- 결함 수정 여부
- 운영팀 확인
- 최종 판단
- 비고

## 6. 원천 데이터 모델

### Release

```ts
type Release = {
  id: string;
  version: string;
  plannedReleaseDate: string | null;
  workPeriod: {
    startedAt: string | null;
    endedAt: string | null;
  };
  status: ReleaseStatus;
  serviceVersions: ServiceVersion[];
  testingSiteUrl: string | null;
};
```

### ReleaseTask

```ts
type ReleaseTask = {
  id: string;
  releaseId: string;
  issueCode: string;
  service: ReleaseService;
  category: string;
  pageName: string;
  changeType: ChangeType;
  releaseImpact: ReleaseImpact;
  title: string;
  changelogSummary: string;
  problemSummary: string;
  analysisSummary: string;
  changeSummary: string;
  resultSummary: string;
  siteScope: string;
  ownerName: string;
  reviewerNames: string[];
  gitlabProjectId: string | null;
  gitlabProjectPath: string | null;
  gitlabMergeRequestIid: number | null;
  gitlabMergeRequestHeadSha: string | null;
  gitlabIssueUrl: string | null;
  gitlabMergeRequestUrls: string[];
  changeSummaryDraft: {
    source: 'MANUAL' | 'AI_FROM_GITLAB_MR';
    generatedAt: string | null;
    isUserEdited: boolean;
  };
  evidenceIds: string[];
  qcCaseIds: string[];
};
```

### Evidence

```ts
type Evidence = {
  id: string;
  releaseTaskId: string;
  type: 'BEFORE' | 'AFTER' | 'REFERENCE' | 'TEST_RESULT';
  title: string;
  caption: string;
  imageUrl: string;
  linkedQcCaseId: string | null;
  createdAt: string;
};
```

### QcCase

```ts
type QcCase = {
  id: string;
  releaseTaskId: string;
  testCode: string;
  pageName: string;
  title: string;
  steps: string;
  precondition: string;
  expectedResult: string;
  workerName: string;
  testerName: string | null;
  status: QcStatus;
  actualResult: string | null;
  defectSeverity: DefectSeverity | null;
  failureReason: string | null;
  testedAt: string | null;
  isDefectFixed: boolean | null;
  operationTeamConfirmed: boolean | null;
  finalDecision: QcFinalDecision | null;
  note: string | null;
};
```

## 7. 산출물 매핑

| 원천 데이터 | 릴리즈 노트 | CHANGELOG | QC 보드 |
| --- | --- | --- | --- |
| `Release.version` | 릴리즈 버전 | 버전 | 버전별 보드 |
| `Release.plannedReleaseDate` | 릴리즈 예정 날짜 | 날짜 | 시행 일정 참고 |
| `ReleaseTask.service` | WEB/SERVER/LOG/APP 섹션 | 서비스 탭 | WEB_QC/SERVER_QC 분리 |
| `ReleaseTask.releaseImpact` | Major/Minor 섹션 | major/minor 컬럼 | 우선순위 참고 |
| `ReleaseTask.category` | 기능 영역 그룹 | 요약 내 카테고리 | 연관 페이지 보조 |
| `ReleaseTask.issueCode` | 이슈 코드 | 요약 문장 prefix | Issue-Code |
| `ReleaseTask.title` | 요약 제목 | 변경사항 문장 | 테스트명 초안 |
| `ReleaseTask.problemSummary` | 이슈 내용 | 사용 안 함 또는 상세 export | 테스트 목적 참고 |
| `ReleaseTask.resultSummary` | 결과 내용 | 요약 문장 후보 | 예상 결과 후보 |
| `Evidence` | Before/After 화면 | 사용 안 함 | 실제 결과 증빙 |
| `QcCase` | 상세 검증 섹션 선택 표시 | 사용 안 함 | 테스트 케이스 행 |

## 8. 주요 화면 설계

### Release Dashboard

버전별 준비 상태를 한 화면에서 확인한다.

- 버전 선택
- 릴리즈 상태
- 전체 작업 수
- Major/Minor 개수
- QC 작성률
- QC 통과율
- Evidence 누락 수
- 산출물 export 상태
- 최근 변경 작업 목록

### Task Detail Editor

작업 1건의 원천 데이터를 작성하는 핵심 화면이다.

- 좌측: 구조화된 입력 폼
- 우측: 편집 중 항상 확인 가능한 sticky 산출물 미리보기
- 미리보기 탭: Release Note, CHANGELOG, QC Case
- GitLab 연동 순서: `저장소 Search Select → MR Search Select → MR 정보 확인`
- GitLab 연동을 사용하는 경우 저장소는 필수이고 MR은 선택
- MR 선택 시 제목, 설명, 커밋, 변경 파일, 라벨을 기반으로 AI가 `변경 내용 요약` 초안 생성
- AI 상태: 분석 중, 초안 생성 완료, 사용자 수정됨, 생성 실패, MR 변경으로 오래된 초안
- 기존 사용자 입력이 있으면 새 초안으로 자동 덮어쓰지 않고 비교 후 적용
- 저장 전 누락 필드 표시
- Major/Minor, 서비스, 카테고리, 이슈 유형은 상수 기반 선택

#### Task Detail Editor 상태 흐름

1. GitLab 연동을 켜고 저장소를 검색해 선택한다.
2. 선택한 저장소 범위에서 MR을 검색한다.
3. MR을 선택하면 MR 메타데이터와 diff 요약을 조회한다.
4. AI 분석 중에는 `변경 내용 요약`에 진행 상태를 표시하고 직접 입력은 유지한다.
5. 필드가 비어 있으면 생성된 초안을 자동 입력한다.
6. 사용자가 초안을 수정하면 `AI 초안 · 사용자 수정됨` 상태로 표시한다.
7. 우측 미리보기는 현재 폼 값을 실시간 반영한다.
8. 사용자가 최종 내용을 확인하고 저장한다.

데스크톱은 좌측 편집 영역과 우측 sticky 미리보기를 동시에 표시한다. 좁은 화면에서는 편집/미리보기 탭으로 전환하며, 미리보기를 문서 최하단으로 이동시키지 않는다.

### Evidence Gallery

Before/After 화면을 안정적으로 관리한다.

- 이미지 업로드
- Before/After 페어링
- 캡션 입력
- 관련 QC 케이스 연결
- 카드형 목록
- 비교 뷰
- 원본 보기

### QC Board

기존 스프레드시트의 장점인 표 기반 스캔성을 유지한다.

- Test-Code 자동 발급
- Issue-Code 필터
- 페이지/기능 영역 필터
- 상태 칩
- 실패 항목만 보기
- 실제 결과와 결함 사유 인라인 편집
- 최종 판단 관리

### Export Center

기존 업무 프로세스와 연결하기 위한 산출물 관리 화면이다.

- 릴리즈 노트 export
- CHANGELOG export
- QC 보드 export
- Markdown/PDF export
- 마지막 생성 시각
- export 전 누락 항목 경고

## 9. MVP 범위

### 포함

- 릴리즈 버전 생성 및 목록
- 작업 항목 등록/수정
- Evidence 이미지 등록 UI
- QC 케이스 등록/상태 변경
- 릴리즈 노트 미리보기
- CHANGELOG 미리보기
- QC 보드 미리보기
- 전사 공지문 복사
- CSV/Markdown export
- mock GitLab 데이터

### 제외

- 실제 GitLab OAuth
- 실제 Google Drive 쓰기 연동
- 실시간 공동 편집
- 권한 관리
- 실제 AI 모델 호출과 대규모 diff 분석. MVP에서는 mock AI 초안 생성 상태와 사용자 검토 UX만 검증
- 외부 상용 LLM API 및 사용자별 API Key 입력·저장
- 브라우저에서 사내 LLM 또는 GitLab API를 직접 호출하는 구조
- 사내 메신저 자동 발송

## 10. 단계별 로드맵

### Phase 1: Local Prototype

- mock 데이터 기반 전체 흐름 구현
- 한 번 입력해서 세 산출물 미리보기 생성
- 이미지 첨부 UX 검증
- QC 상태 관리 검증

### Phase 2: Export 강화

- CSV export
- Markdown export
- PDF export
- Google Docs/Sheets로 붙여넣기 쉬운 구조 제공

### Phase 3: GitLab 연동

- GitLab 저장소 Search Select와 저장소 범위 MR Search Select
- 제목, 설명, 담당자, 라벨, 브랜치, 커밋, 변경 파일 자동 수집
- 라벨 기반 changeType/releaseImpact 추천
- MR 변경 내용을 기반으로 AI `변경 내용 요약` 초안 생성
- 사용자 수정 보호, 재생성 비교, 실패 fallback, MR SHA 기반 stale 상태 처리
- `SummaryDraftGenerator` 포트와 mock adapter 구성

### Phase 3.5: 사내 LLM 연동

- 서버/BFF에 `InternalLlmSummaryDraftGenerator` adapter 구현
- GitLab 권한 확인 후 MR 데이터 수집 및 프롬프트 입력 정제
- 사내 모델 endpoint, 인증, timeout, retry, audit 정책 적용
- mock adapter를 사내 LLM adapter로 교체하되 프론트엔드 UI와 폼 계약은 유지

### Phase 4: Google Drive 연동

- 릴리즈 노트 Google Docs 생성
- CHANGELOG Google Sheets 업데이트
- QC 보드 Google Sheets 업데이트
- 기존 문서 포맷과 호환되는 백업 export

## 11. 성공 기준

- 작업 1건 등록 후 릴리즈 노트, CHANGELOG, QC 케이스가 동시에 생성된다.
- 동일한 이슈 코드와 제목을 세 산출물에 반복 입력하지 않는다.
- 이미지 크기가 달라도 릴리즈 노트 레이아웃이 깨지지 않는다.
- 릴리즈 담당자가 버전별 누락 항목을 Dashboard에서 확인할 수 있다.
- 기존 Google Docs/Sheets 산출물과 최소한의 호환성을 유지한다.
