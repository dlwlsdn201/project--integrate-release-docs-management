// Domain types
export type { Release, ReleaseItem, QCTestCase } from './model/types';

// Constants and derived types (SSOT)
export {
  RELEASE_STATUS,
  CHANGE_CATEGORY,
  TEST_STATUS,
  CHANGE_CATEGORY_LABEL,
  RELEASE_STATUS_LABEL,
  TEST_STATUS_LABEL,
  CHANGELOG_CATEGORY_ORDER,
} from './model/constants';
export type { ReleaseStatus, ChangeCategory, TestStatus } from './model/constants';

// Mock data
export { MOCK_RELEASES, MOCK_RELEASE_ITEMS, getMockReleaseItems } from './model/mockRelease';
export { MOCK_GITLAB_ISSUES, MOCK_GITLAB_MRS } from './model/mockGitlab';
export type { GitlabIssue, GitlabMergeRequest, GitlabUser, GitlabMilestone } from './model/mockGitlab';

// Document generation functions and result types
export {
  generateChangelog,
  generateQcChecklist,
  generateReleaseNote,
  generateAnnouncement,
} from './model/generateReleaseDocuments';
export type {
  ChangelogItem,
  ChangelogGroup,
  ChangelogData,
  QcChecklistEntry,
  QcChecklistData,
  ReleaseNoteItem,
  ReleaseNoteData,
  AnnouncementConfig,
  AnnouncementData,
} from './model/generateReleaseDocuments';

export { getReleaseQcProgress, updateReleaseItemTestCase } from './model/qcStatus';
export type { QCTestCaseUpdate, ReleaseQcProgress } from './model/qcStatus';

export {
  generateChangelogCsv,
  generateQcChecklistCsv,
  generateReleaseNoteHtml,
  generateReleaseJson,
} from './model/exportReleaseDocuments';
