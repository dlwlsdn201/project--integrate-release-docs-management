import { RELEASE_STATUS, CHANGE_CATEGORY, TEST_STATUS } from './constants';
import type { Release, ReleaseItem, QCTestCase } from './types';

const mockTestCaseLogin1: QCTestCase = {
  id: 'tc-001',
  releaseItemId: 'ri-001',
  description: '로그인 실패 시 에러 메시지 확인',
  expectedResult: '실패 사유별 안내 문구가 노출된다.',
  status: TEST_STATUS.PASSED,
  testerName: '박QA',
  failedReason: null,
};

const mockTestCaseLogin2: QCTestCase = {
  id: 'tc-002',
  releaseItemId: 'ri-001',
  description: '계정 잠금 상태 안내 문구 확인',
  expectedResult: '계정 잠금 안내 문구와 관리자 문의 링크가 표시된다.',
  status: TEST_STATUS.PASSED,
  testerName: '박QA',
  failedReason: null,
};

const mockTestCaseFilter1: QCTestCase = {
  id: 'tc-003',
  releaseItemId: 'ri-002',
  description: '기간 필터 적용 확인',
  expectedResult: '선택한 기간의 데이터만 표시된다.',
  status: TEST_STATUS.NOT_STARTED,
  testerName: null,
  failedReason: null,
};

const mockTestCaseFilter2: QCTestCase = {
  id: 'tc-004',
  releaseItemId: 'ri-002',
  description: '기간 필터 초기화 확인',
  expectedResult: '초기화 시 전체 기간 데이터가 표시된다.',
  status: TEST_STATUS.NOT_STARTED,
  testerName: null,
  failedReason: null,
};

const mockTestCaseDatePicker1: QCTestCase = {
  id: 'tc-005',
  releaseItemId: 'ri-005',
  description: '날짜 선택기 월 이동 후 날짜 유지 확인',
  expectedResult: '월 이동 후에도 이전에 선택한 날짜가 유지된다.',
  status: TEST_STATUS.PASSED,
  testerName: '박QA',
  failedReason: null,
};

const mockReleaseItemsV180: ReleaseItem[] = [
  {
    id: 'ri-001',
    releaseId: 'release-v1.8.0',
    gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/123',
    gitlabMergeRequestUrl: 'https://gitlab.example.com/project/-/merge_requests/88',
    ticketNumber: 'ABC-123',
    title: '로그인 실패 안내 문구 개선',
    category: CHANGE_CATEGORY.MAJOR,
    isPublic: true,
    changelogSummary: '로그인 실패 안내 문구 개선',
    userDescription:
      '로그인 실패 시 비밀번호 오류, 계정 잠금, 권한 없음 상태에 따라 더 구체적인 안내 문구가 표시됩니다.',
    assigneeName: '김개발',
    beforeImageUrls: [],
    afterImageUrls: [],
    testCases: [mockTestCaseLogin1, mockTestCaseLogin2],
    createdAt: '2026-05-20T15:30:00Z',
    updatedAt: '2026-05-20T15:30:00Z',
  },
  {
    id: 'ri-002',
    releaseId: 'release-v1.8.0',
    gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/145',
    gitlabMergeRequestUrl: 'https://gitlab.example.com/project/-/merge_requests/92',
    ticketNumber: 'ABC-145',
    title: '관리자 대시보드 기간 필터 추가',
    category: CHANGE_CATEGORY.MAJOR,
    isPublic: true,
    changelogSummary: '관리자 대시보드 기간 필터 추가',
    userDescription: '관리자 대시보드에서 기간 필터를 사용하여 원하는 기간의 데이터를 조회할 수 있습니다.',
    assigneeName: '이프론트',
    beforeImageUrls: [],
    afterImageUrls: [],
    testCases: [mockTestCaseFilter1, mockTestCaseFilter2],
    createdAt: '2026-05-22T14:00:00Z',
    updatedAt: '2026-05-22T14:00:00Z',
  },
  {
    id: 'ri-003',
    releaseId: 'release-v1.8.0',
    gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/151',
    gitlabMergeRequestUrl: null,
    ticketNumber: 'ABC-151',
    title: '검색 결과 정렬 기준 개선',
    category: CHANGE_CATEGORY.MINOR,
    isPublic: true,
    changelogSummary: '검색 결과 정렬 기준 개선',
    userDescription: '검색 결과의 기본 정렬 기준이 최신순으로 변경되었으며, 정렬 기준을 직접 선택할 수 있습니다.',
    assigneeName: '박풀스택',
    beforeImageUrls: [],
    afterImageUrls: [],
    testCases: [],
    createdAt: '2026-05-23T16:00:00Z',
    updatedAt: '2026-05-23T16:00:00Z',
  },
  {
    id: 'ri-004',
    releaseId: 'release-v1.8.0',
    gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/160',
    gitlabMergeRequestUrl: null,
    ticketNumber: 'ABC-160',
    title: '알림 목록 UI 개선',
    category: CHANGE_CATEGORY.MINOR,
    isPublic: false,
    changelogSummary: '알림 목록 UI 개선',
    userDescription: '알림 목록의 레이아웃과 가독성을 개선하였습니다.',
    assigneeName: '김개발',
    beforeImageUrls: [],
    afterImageUrls: [],
    testCases: [],
    createdAt: '2026-05-24T10:00:00Z',
    updatedAt: '2026-05-24T10:00:00Z',
  },
];

const mockReleaseItemsV190: ReleaseItem[] = [
  {
    id: 'ri-005',
    releaseId: 'release-v1.9.0',
    gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/170',
    gitlabMergeRequestUrl: null,
    ticketNumber: 'ABC-170',
    title: '날짜 선택기 월 이동 버그 수정',
    category: CHANGE_CATEGORY.BUGFIX,
    isPublic: true,
    changelogSummary: '날짜 선택기 월 이동 시 선택값 초기화 버그 수정',
    userDescription: '날짜 선택기에서 월을 이동해도 이전에 선택한 날짜가 유지됩니다.',
    assigneeName: '이프론트',
    beforeImageUrls: [],
    afterImageUrls: [],
    testCases: [mockTestCaseDatePicker1],
    createdAt: '2026-05-25T09:00:00Z',
    updatedAt: '2026-05-25T09:00:00Z',
  },
];

export const MOCK_RELEASES: Release[] = [
  {
    id: 'release-v1.8.0',
    version: 'v1.8.0',
    title: 'v1.8.0 릴리즈',
    status: RELEASE_STATUS.RELEASED,
    releasedAt: '2026-05-25T10:00:00Z',
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-05-25T10:00:00Z',
  },
  {
    id: 'release-v1.9.0',
    version: 'v1.9.0',
    title: 'v1.9.0 릴리즈',
    status: RELEASE_STATUS.QC_READY,
    releasedAt: null,
    createdAt: '2026-05-25T09:00:00Z',
    updatedAt: '2026-05-25T09:00:00Z',
  },
];

export const MOCK_RELEASE_ITEMS: ReleaseItem[] = [...mockReleaseItemsV180, ...mockReleaseItemsV190];

/**
 * releaseId에 해당하는 mock 릴리즈 항목 목록을 반환한다.
 */
export const getMockReleaseItems = (releaseId: string): ReleaseItem[] =>
  MOCK_RELEASE_ITEMS.filter((item) => item.releaseId === releaseId);
