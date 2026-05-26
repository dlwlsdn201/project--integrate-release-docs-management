import type { ChangeEvent } from 'react';
import type { QCTestCase, QCTestCaseUpdate, TestStatus } from '@entities/release';
import { TEST_STATUS, TEST_STATUS_LABEL } from '@entities/release';

interface QCTestStatusControlProps {
  testCase: QCTestCase;
  onUpdate: (updates: QCTestCaseUpdate) => void;
}

const STATUS_OPTIONS: TestStatus[] = [
  TEST_STATUS.NOT_STARTED,
  TEST_STATUS.PASSED,
  TEST_STATUS.FAILED,
  TEST_STATUS.BLOCKED,
];

const needsReason = (status: TestStatus) =>
  status === TEST_STATUS.FAILED || status === TEST_STATUS.BLOCKED;

export const QCTestStatusControl = ({ testCase, onUpdate }: QCTestStatusControlProps) => {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as TestStatus;
    onUpdate({
      status: nextStatus,
      failedReason: needsReason(nextStatus) ? testCase.failedReason : null,
    });
  };

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ failedReason: event.target.value });
  };

  return (
    <div className="space-y-2">
      <label className="sr-only" htmlFor={`qc-status-${testCase.id}`}>
        상태 변경: {testCase.description}
      </label>
      <select
        id={`qc-status-${testCase.id}`}
        value={testCase.status}
        onChange={handleStatusChange}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {TEST_STATUS_LABEL[status]}
          </option>
        ))}
      </select>

      {needsReason(testCase.status) && (
        <div>
          <label className="sr-only" htmlFor={`qc-reason-${testCase.id}`}>
            실패/차단 사유: {testCase.description}
          </label>
          <textarea
            id={`qc-reason-${testCase.id}`}
            value={testCase.failedReason ?? ''}
            onChange={handleReasonChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="사유를 입력하세요."
          />
        </div>
      )}
    </div>
  );
};
