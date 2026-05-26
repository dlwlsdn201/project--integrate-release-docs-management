# ReleaseHub

GitLab 기반 릴리즈 정보를 하나의 원본 데이터로 관리하고, CHANGELOG, QC Checklist, Release Note, Announcement를 자동 생성하는 SPA 프로토타입입니다.

## 실행 방법

```bash
pnpm install
pnpm dev
```

검증 명령:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

## 구현 범위

- 릴리즈 목록/상세 화면
- hash 기반 목록/상세 라우팅
- GitLab mock Issue/MR 기반 릴리즈 항목 생성 폼
- React Hook Form + Zod 필수값 검증
- 릴리즈 항목 추가 시 문서 탭 즉시 반영
- CHANGELOG, QC Checklist, Release Note, Announcement 미리보기
- QC 테스트 케이스 상태 변경
- Failed/Blocked 사유 입력
- Announcement clipboard 복사
- CHANGELOG CSV, QC CSV, Release Note HTML, Release JSON export
- 주요 흐름 RTL 테스트

## 제외 범위

- 실제 GitLab OAuth/API 연동
- 실제 Google Drive API 연동
- 사내 메신저 자동 발송
- 백엔드 저장
- 인증/권한 관리
- 실시간 협업 편집

## 기술 스택

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- Tailwind CSS
- React Hook Form
- Zod

## 테스트 현황

현재 주요 테스트 파일:

- `src/entities/release/model/generateReleaseDocuments.test.ts`
- `src/entities/release/model/exportReleaseDocuments.test.ts`
- `src/features/release-item-form/ui/ReleaseItemForm.test.tsx`
- `src/widgets/release-list/ui/ReleaseListPanel.test.tsx`
- `src/widgets/release-document-tabs/ui/ReleaseDocumentTabs.test.tsx`
- `src/pages/release-list/ui/ReleaseListPage.test.tsx`
- `src/pages/release-detail/ui/ReleaseDetailPage.test.tsx`
- `src/app/App.test.tsx`

## 문서

- 제품 요구사항: [PRD.mdc](./PRD.mdc)
- 프로젝트 작업 기준: [docs/PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md)
- 작업 로그: [docs/WORK_LOG.md](./docs/WORK_LOG.md)
- 리뷰 로그: [docs/REVIEW_LOG.md](./docs/REVIEW_LOG.md)
