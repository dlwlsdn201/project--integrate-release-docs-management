import { TEST_STATUS } from './constants';
import type { QCTestCase, ReleaseItem } from './types';

export type QCTestCaseUpdate = Partial<Pick<QCTestCase, 'status' | 'testerName' | 'failedReason'>>;

export interface ReleaseQcProgress {
  passed: number;
  total: number;
}

export const getReleaseQcProgress = (items: ReleaseItem[]): ReleaseQcProgress | null => {
  const testCases = items.flatMap((releaseItem) => releaseItem.testCases);
  if (testCases.length === 0) return null;

  return {
    passed: testCases.filter((testCase) => testCase.status === TEST_STATUS.PASSED).length,
    total: testCases.length,
  };
};

export const updateReleaseItemTestCase = (
  items: ReleaseItem[],
  testCaseId: string,
  updates: QCTestCaseUpdate,
): ReleaseItem[] =>
  items.map((releaseItem) => ({
    ...releaseItem,
    testCases: releaseItem.testCases.map((testCase) =>
      testCase.id === testCaseId
        ? {
            ...testCase,
            ...updates,
          }
        : testCase,
    ),
  }));
