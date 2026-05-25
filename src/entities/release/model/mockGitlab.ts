export interface GitlabUser {
  name: string;
  username: string;
  avatarUrl: string;
}

export interface GitlabMilestone {
  id: number;
  title: string;
  dueDate: string | null;
}

export interface GitlabIssue {
  id: number;
  iid: number;
  title: string;
  description: string;
  labels: string[];
  assignee: GitlabUser | null;
  milestone: GitlabMilestone | null;
  webUrl: string;
  state: 'opened' | 'closed';
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface GitlabMergeRequest {
  id: number;
  iid: number;
  title: string;
  description: string;
  labels: string[];
  assignee: GitlabUser | null;
  reviewers: GitlabUser[];
  sourceBranch: string;
  targetBranch: string;
  state: 'opened' | 'closed' | 'merged';
  webUrl: string;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
}

export const MOCK_GITLAB_ISSUES: GitlabIssue[] = [
  {
    id: 1001,
    iid: 123,
    title: '로그인 실패 안내 문구 개선',
    description: '로그인 실패 시 실패 원인별로 더 구체적인 안내 문구를 표시한다.',
    labels: ['type::major', 'frontend'],
    assignee: { name: '김개발', username: 'dev.kim', avatarUrl: '' },
    milestone: { id: 1, title: 'v1.8.0', dueDate: '2026-06-30' },
    webUrl: 'https://gitlab.example.com/project/-/issues/123',
    state: 'closed',
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-20T15:30:00Z',
    closedAt: '2026-05-20T15:30:00Z',
  },
  {
    id: 1002,
    iid: 145,
    title: '관리자 대시보드 기간 필터 추가',
    description: '관리자 대시보드에서 기간 필터를 사용하여 데이터를 조회할 수 있도록 한다.',
    labels: ['type::major', 'feature', 'frontend'],
    assignee: { name: '이프론트', username: 'front.lee', avatarUrl: '' },
    milestone: { id: 1, title: 'v1.8.0', dueDate: '2026-06-30' },
    webUrl: 'https://gitlab.example.com/project/-/issues/145',
    state: 'closed',
    createdAt: '2026-05-05T10:00:00Z',
    updatedAt: '2026-05-22T14:00:00Z',
    closedAt: '2026-05-22T14:00:00Z',
  },
  {
    id: 1003,
    iid: 151,
    title: '검색 결과 정렬 기준 개선',
    description: '검색 결과의 기본 정렬 기준을 최신순으로 변경하고 사용자가 정렬 기준을 선택할 수 있도록 한다.',
    labels: ['type::minor', 'frontend'],
    assignee: { name: '박풀스택', username: 'fullstack.park', avatarUrl: '' },
    milestone: { id: 1, title: 'v1.8.0', dueDate: '2026-06-30' },
    webUrl: 'https://gitlab.example.com/project/-/issues/151',
    state: 'closed',
    createdAt: '2026-05-08T11:00:00Z',
    updatedAt: '2026-05-23T16:00:00Z',
    closedAt: '2026-05-23T16:00:00Z',
  },
  {
    id: 1004,
    iid: 160,
    title: '알림 목록 UI 개선',
    description: '알림 목록의 레이아웃과 가독성을 개선한다.',
    labels: ['type::minor', 'ui', 'frontend'],
    assignee: { name: '김개발', username: 'dev.kim', avatarUrl: '' },
    milestone: { id: 1, title: 'v1.8.0', dueDate: '2026-06-30' },
    webUrl: 'https://gitlab.example.com/project/-/issues/160',
    state: 'closed',
    createdAt: '2026-05-10T09:30:00Z',
    updatedAt: '2026-05-24T10:00:00Z',
    closedAt: '2026-05-24T10:00:00Z',
  },
  {
    id: 1005,
    iid: 170,
    title: '날짜 선택기 월 이동 버그 수정',
    description: '달력에서 월을 이동할 때 선택된 날짜가 초기화되는 버그를 수정한다.',
    labels: ['type::bugfix', 'frontend'],
    assignee: { name: '이프론트', username: 'front.lee', avatarUrl: '' },
    milestone: { id: 2, title: 'v1.9.0', dueDate: '2026-07-31' },
    webUrl: 'https://gitlab.example.com/project/-/issues/170',
    state: 'closed',
    createdAt: '2026-05-15T14:00:00Z',
    updatedAt: '2026-05-25T09:00:00Z',
    closedAt: '2026-05-25T09:00:00Z',
  },
];

export const MOCK_GITLAB_MRS: GitlabMergeRequest[] = [
  {
    id: 2001,
    iid: 88,
    title: 'feat: 로그인 실패 안내 문구 개선 (closes #123)',
    description: '### 변경사항\n- 비밀번호 오류, 계정 잠금, 권한 없음 케이스별 안내 문구 분기 처리',
    labels: ['type::major'],
    assignee: { name: '김개발', username: 'dev.kim', avatarUrl: '' },
    reviewers: [{ name: '박풀스택', username: 'fullstack.park', avatarUrl: '' }],
    sourceBranch: 'feature/123-login-error-message',
    targetBranch: 'develop',
    state: 'merged',
    webUrl: 'https://gitlab.example.com/project/-/merge_requests/88',
    createdAt: '2026-05-18T10:00:00Z',
    updatedAt: '2026-05-20T15:30:00Z',
    mergedAt: '2026-05-20T15:30:00Z',
  },
  {
    id: 2002,
    iid: 92,
    title: 'feat: 관리자 대시보드 기간 필터 추가 (closes #145)',
    description: '### 변경사항\n- DateRangePicker 컴포넌트 추가\n- 대시보드 API 기간 파라미터 연동',
    labels: ['type::major', 'feature'],
    assignee: { name: '이프론트', username: 'front.lee', avatarUrl: '' },
    reviewers: [{ name: '김개발', username: 'dev.kim', avatarUrl: '' }],
    sourceBranch: 'feature/145-dashboard-date-filter',
    targetBranch: 'develop',
    state: 'merged',
    webUrl: 'https://gitlab.example.com/project/-/merge_requests/92',
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-05-22T14:00:00Z',
    mergedAt: '2026-05-22T14:00:00Z',
  },
];
