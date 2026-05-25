export const RELEASE_STATUS = {
  DRAFT: 'DRAFT',
  QC_READY: 'QC_READY',
  RELEASED: 'RELEASED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ReleaseStatus = (typeof RELEASE_STATUS)[keyof typeof RELEASE_STATUS];

export const CHANGE_CATEGORY = {
  MAJOR: 'MAJOR',
  MINOR: 'MINOR',
  PATCH: 'PATCH',
  BUGFIX: 'BUGFIX',
} as const;

export type ChangeCategory = (typeof CHANGE_CATEGORY)[keyof typeof CHANGE_CATEGORY];

export const TEST_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  BLOCKED: 'BLOCKED',
} as const;

export type TestStatus = (typeof TEST_STATUS)[keyof typeof TEST_STATUS];

export const CHANGE_CATEGORY_LABEL: Record<ChangeCategory, string> = {
  MAJOR: 'Major',
  MINOR: 'Minor',
  PATCH: 'Patch',
  BUGFIX: 'Bugfix',
};

export const RELEASE_STATUS_LABEL: Record<ReleaseStatus, string> = {
  DRAFT: 'Draft',
  QC_READY: 'QC Ready',
  RELEASED: 'Released',
  ARCHIVED: 'Archived',
};

export const TEST_STATUS_LABEL: Record<TestStatus, string> = {
  NOT_STARTED: 'Not Started',
  PASSED: 'Passed',
  FAILED: 'Failed',
  BLOCKED: 'Blocked',
};

export const CHANGELOG_CATEGORY_ORDER: readonly ChangeCategory[] = [
  CHANGE_CATEGORY.MAJOR,
  CHANGE_CATEGORY.MINOR,
  CHANGE_CATEGORY.PATCH,
  CHANGE_CATEGORY.BUGFIX,
];
