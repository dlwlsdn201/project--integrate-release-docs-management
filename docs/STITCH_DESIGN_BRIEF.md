# Stitch Design Brief

## 1. 목적

이 문서는 Stitch 또는 유사한 디자인 생성 도구에 전달할 ReleaseHub 디자인 요구사항이다. 목표는 기존 Google Docs 릴리즈 노트, Google Sheets CHANGELOG, Google Sheets QC 보드를 하나의 웹 서비스 흐름으로 통합하는 제품 화면을 설계하는 것이다.

## 2. 제품 컨셉

ReleaseHub is an internal release management web app. Developers write one structured release task record, and the system automatically generates release notes, changelog entries, QC cases, and announcement drafts.

The design must feel like a daily operations tool for developers, QA, and release managers. It should not look like a marketing landing page.

## 3. 핵심 UX 방향

- One source of truth: one task record creates multiple outputs.
- Dense but readable enterprise SaaS UI.
- Tables, forms, preview panes, tabs, status chips, upload cards, and filters should be the primary UI patterns.
- Evidence images must be easy to upload, compare, caption, and link to QC cases.
- Generated outputs must be visible before export.
- Selecting a GitLab MR should generate an editable AI draft, never an irreversible final value.
- On desktop, the document preview must remain visible on the right while the user edits the form.
- The first screen should be the actual dashboard, not a hero page.

## 4. Required Screens

### 4.1 Release Dashboard

Design a release dashboard for version-level management.

Required content:

- Release version selector
- Release status
- Planned release date
- Testing site URL
- Metrics:
  - total tasks
  - major changes
  - minor changes
  - QC case count
  - QC pass rate
  - missing evidence count
- Export status:
  - Release Note
  - CHANGELOG
  - QC Board
  - Announcement
- Recent task table

Table columns:

- Issue Code
- Service
- Category
- Title
- Impact
- Owner
- QC Status
- Evidence
- Updated At

### 4.2 Task Detail Editor

Design the core task editor with a two-column layout.

Left side: structured input form.

Fields:

- Issue Code
- Service: Web, Server, Log, Android, iOS, BBA
- Category
- Related Page
- Change Type
- Major/Minor
- Title
- Problem Summary
- Development Analysis
- Change Summary
- Result Summary
- Site Scope
- Owner
- Tester
- GitLab repository Search Select (required only when GitLab integration is used)
- GitLab Merge Request Search Select (optional and disabled until a repository is selected)
- AI-generated Change Summary draft with generation status and user-edited status

GitLab and AI draft flow:

1. Search and select a repository using its full group/project path.
2. Search MRs only inside the selected repository.
3. Select an MR and show its title, author, source/target branches, labels, commits, and changed files.
4. Analyze the MR and automatically populate an editable Change Summary draft when the field is empty.
5. Show explicit states: analyzing, draft ready, user edited, failed, and stale after the linked MR changes.
6. Never overwrite an existing user-edited summary. Offer compare and apply actions for regeneration.
7. Keep manual entry and save available when AI generation fails.

Right side: generated preview pane.

Preview tabs:

- Release Note
- CHANGELOG
- QC Case
- Announcement

The preview should update visually from the current form values. On desktop it must be a sticky right pane visible while the left form scrolls. On narrow screens use Editor and Preview tabs instead of moving the preview to the bottom.

### 4.3 Evidence Gallery

Design an image management screen.

Required content:

- Before image upload card
- After image upload card
- Reference image upload card
- Test result image upload card
- Caption field
- Linked QC case selector
- Side-by-side comparison view
- Image fit behavior that prevents layout breakage
- Empty state for missing evidence

Important:

- Do not place images inside spreadsheet-like cells.
- Images should be displayed in stable cards or comparison panels.
- Captions and metadata should remain readable regardless of image dimensions.

### 4.4 QC Board

Design a spreadsheet-like QC board.

Required columns:

- Test Code
- Issue Code
- Related Page
- Test Name
- Test Steps
- Preconditions
- Expected Result
- Worker
- Tester
- Status
- Actual Result
- Defect Severity
- Failure Reason
- Test Date
- Defect Fixed
- Operation Confirmed
- Final Decision
- Note

Required interactions:

- Status chip filter
- Issue Code filter
- Service filter
- Failed only toggle
- Inline status change
- Row detail drawer

### 4.5 Export Center

Design an export management screen.

Required content:

- Export cards:
  - Release Note
  - CHANGELOG
  - QC Board
  - Announcement
  - Markdown
  - PDF
- Last exported time
- Missing required fields warning
- Preview button
- Export button
- Copy announcement button

## 5. Visual Style

- Professional internal B2B SaaS.
- Neutral background.
- Restrained accent color.
- Compact spacing.
- Clear table hierarchy.
- Status chips and badges.
- No decorative hero.
- No large marketing headline.
- No gradient orb background.
- No oversized cards for every section.
- Avoid a one-color theme. Use neutral surfaces with meaningful status colors.
- Keep cards at 8px border radius or less.

## 6. Navigation

Recommended app shell:

- Left sidebar
  - Dashboard
  - Tasks
  - Evidence
  - QC Board
  - Export Center
  - Settings
- Top bar
  - Release version selector
  - Search
  - Export shortcut
  - User menu

## 7. Design Prompt For Stitch

```text
Create a web app UI design for an internal release management service called "ReleaseHub".

ReleaseHub replaces three separate manual documents: Google Docs release notes, Google Sheets CHANGELOG, and Google Sheets QC test boards. The core product idea is: developers write one structured release task record once, then the system automatically generates release notes, changelog entries, QC cases, and announcement drafts.

Design a professional B2B operations dashboard for developers, QA testers, and release managers. Do not create a marketing landing page. The first screen must be the usable release dashboard.

Required screens:

1. Release Dashboard
- version selector
- release status
- planned release date
- testing site URL
- summary metrics: total tasks, major changes, minor changes, QC case count, QC pass rate, missing evidence count
- export status for Release Note, CHANGELOG, QC Board, Announcement
- recent task table with Issue Code, Service, Category, Title, Impact, Owner, QC Status, Evidence, Updated At

2. Task Detail Editor
- two-column layout
- left side: structured form
- right side: sticky generated preview pane that remains visible while the form scrolls
- preview tabs: Release Note, CHANGELOG, QC Case, Announcement
- GitLab integration order: repository Search Select, Merge Request Search Select, connected MR preview
- repository is required only when GitLab integration is enabled
- Merge Request is optional and disabled until a repository is selected
- repository results show the full group/project path and recent repositories
- MR results show IID, title, state, author, and target branch
- selecting an MR starts AI analysis and automatically fills an editable Change Summary draft when empty
- show analyzing, draft ready, user edited, failed, and stale states
- never overwrite user-edited text; show compare and apply actions when regenerating
- manual entry and task saving remain available after AI failure
- fields: Issue Code, Service, Category, Related Page, Change Type, Major/Minor, Title, Problem Summary, Development Analysis, Change Summary, Result Summary, Site Scope, Owner, Tester

3. Evidence Gallery
- before/after/reference/test-result upload cards
- side-by-side comparison view
- caption input
- linked QC case selector
- stable image cards that do not break layout when image dimensions differ
- empty state for missing evidence

4. QC Board
- spreadsheet-like table
- columns: Test Code, Issue Code, Related Page, Test Name, Test Steps, Preconditions, Expected Result, Worker, Tester, Status, Actual Result, Defect Severity, Failure Reason, Test Date, Defect Fixed, Operation Confirmed, Final Decision, Note
- filters for status, issue code, service
- failed-only toggle
- inline status change
- row detail drawer

5. Export Center
- export cards for Release Note, CHANGELOG, QC Board, Announcement, Markdown, PDF
- last exported time
- missing required fields warning
- generated preview
- export and copy buttons

Visual style:
- clean enterprise SaaS
- dense but readable
- neutral background
- restrained accent color
- status chips and badges
- compact tables and forms
- no decorative hero
- no marketing copy
- no gradient orb background
- no large decorative cards
- cards should use 8px radius or less
- use icons for common actions like upload, export, copy, preview, filter, search

Use an app shell with a left sidebar and top bar. Sidebar items: Dashboard, Tasks, Evidence, QC Board, Export Center, Settings. Top bar includes release version selector, search, export shortcut, and user menu.
```

## 8. Acceptance Criteria For Design Review

- The design clearly communicates that ReleaseTask is the source and documents are generated outputs.
- The dashboard exposes missing QC/evidence/export readiness without opening each task.
- The task editor makes duplicate writing unnecessary.
- The GitLab controls are visibly recognizable as Search Select components, not plain text inputs.
- The MR selector is scoped to the selected repository and clearly disabled before repository selection.
- MR selection visibly progresses through analyzing, AI draft, user editing, and final save states.
- AI regeneration cannot silently overwrite user-edited content.
- The desktop preview remains visible on the right throughout form editing and reflects current unsaved values.
- Evidence images are not constrained by spreadsheet cell layout.
- QC board remains scannable for testers.
- Export Center keeps compatibility with current Google Docs/Sheets workflow.
- The UI feels like an internal work tool, not a promotional website.

## 9. Stitch Revision Prompt — Task Detail Editor v5

```text
Revise the existing "태스크 상세 편집기 v4 - GitLab 연동 강화" screen into "태스크 상세 편집기 v5 - GitLab MR AI 초안 및 실시간 미리보기".

Keep the existing ReleaseHub app shell, compact enterprise SaaS visual language, typography, colors, and form density. Focus on the task editing workflow. Do not redesign unrelated navigation or dashboard screens.

Desktop layout:
- Use a stable two-column workspace.
- The left column is the scrollable task editor and takes approximately 55-60% of the content width.
- The right column is a sticky generated document preview and takes approximately 40-45%.
- Keep the preview visible while the user scrolls and edits the left form.
- Do not place Preview mode at the bottom of the form.
- The preview reflects current unsaved form values in real time.
- Preview tabs: Release Note, CHANGELOG, QC Case, Announcement.
- On narrow screens, replace the columns with an Editor / Preview segmented tab. Do not append preview below the entire form.

GitLab integration section:
- The section is optional, but if GitLab integration is used, repository selection is required.
- Remove the separate GitLab Group select and the plain Project text input.
- Place controls in this exact order:
  1. `GitLab 저장소 *` Search Select
  2. `Merge Request` Search Select
  3. Connected MR information and AI analysis status
- The repository Search Select placeholder is `저장소 이름 또는 그룹 경로 검색...`.
- Repository results show the full `group / project` path, repository icon, visibility, default branch, and a Recent section.
- Make it visually unmistakable that this is a searchable dropdown selector, not a normal text input.
- Disable the MR Search Select until a repository is selected and show `먼저 GitLab 저장소를 선택해 주세요.`.
- The MR Search Select placeholder is `MR 번호 또는 제목 검색...`.
- Scope MR results to the selected repository only.
- MR results show IID, title, Open/Merged/Closed status, author, source branch, and target branch.
- MR selection is optional. Allow saving with only a repository connected.

AI Change Summary workflow:
- When the user selects an MR, show an inline `MR 변경 내용 분석 중` progress state.
- Analyze the MR title, description, labels, commits, and changed files.
- If the Change Summary field is empty, automatically insert an editable AI-generated draft.
- Label the populated field with `AI 초안` and provide a subtle `다시 생성` action.
- After the user edits the draft, change the status to `AI 초안 · 사용자 수정됨`.
- The user remains the final editor and saves the task only after reviewing and editing the draft.
- Never silently overwrite user-edited text.
- If the MR is changed or regenerate is selected while user text exists, open a compact compare view or confirmation dialog with `현재 내용 유지`, `새 초안 적용`, and `나란히 비교` actions.
- If the linked MR head commit changes, show `MR 변경 감지 · 초안 업데이트 필요` without replacing the current text.
- If AI generation fails, show a concise error with `다시 시도` and `직접 작성` actions. The task must remain editable and saveable.
- Do not design an API key input, model selector, billing prompt, or external AI provider settings.
- The AI provider is an internal implementation detail and should not appear in the task editor UI.

Connected MR preview:
- Show repository path, MR IID and title, status, author, source/target branch, labels, commit count, changed file count, and last updated time.
- Provide `MR 변경` and `연결 해제` actions.

Show the final design in the successful state where:
- a repository and MR are selected,
- the AI draft has been generated,
- the Change Summary is marked as user edited,
- and the right-side Release Note preview visibly reflects that edited summary.

Also include small adjacent state examples or a state specification for:
- repository not selected,
- AI analyzing,
- AI failure,
- and stale draft after the MR changes.

Use clear Korean UI labels. Keep controls compact, keyboard accessible, and suitable for repeated daily developer work. Avoid decorative cards, oversized headings, gradients, and marketing-style explanations.
```
