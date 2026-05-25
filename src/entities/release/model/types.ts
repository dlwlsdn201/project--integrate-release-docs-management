import type { ChangeCategory, ReleaseStatus, TestStatus } from './constants';

export interface QCTestCase {
  id: string;
  releaseItemId: string;
  description: string;
  expectedResult: string;
  status: TestStatus;
  testerName: string | null;
  failedReason: string | null;
}

export interface ReleaseItem {
  id: string;
  releaseId: string;
  gitlabIssueUrl: string;
  gitlabMergeRequestUrl: string | null;
  ticketNumber: string;
  title: string;
  category: ChangeCategory;
  isPublic: boolean;
  changelogSummary: string;
  userDescription: string;
  assigneeName: string;
  beforeImageUrls: string[];
  afterImageUrls: string[];
  testCases: QCTestCase[];
  createdAt: string;
  updatedAt: string;
}

export interface Release {
  id: string;
  version: string;
  title: string;
  status: ReleaseStatus;
  releasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
