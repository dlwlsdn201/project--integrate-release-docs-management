import type { Release, ReleaseItem, ReleaseStatus } from '@entities/release';
import { RELEASE_STATUS_LABEL, getReleaseQcProgress } from '@entities/release';

interface ReleaseListPanelProps {
  releases: Release[];
  allItems: ReleaseItem[];
  onSelectRelease: (releaseId: string) => void;
}

const STATUS_CLASS: Record<ReleaseStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  QC_READY: 'bg-yellow-100 text-yellow-700',
  RELEASED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-gray-200 text-gray-500',
};

export const ReleaseListPanel = ({ releases, allItems, onSelectRelease }: ReleaseListPanelProps) => {
  if (releases.length === 0) {
    return (
      <div
        role="status"
        className="bg-white border border-gray-200 rounded-lg py-12 text-center text-sm text-gray-400"
      >
        릴리즈가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <table aria-label="릴리즈 목록 테이블" className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">버전</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">상태</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">이슈 수</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">QC 진행률</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => {
            const items = allItems.filter((item) => item.releaseId === release.id);
            const qcProgress = getReleaseQcProgress(items);
            return (
              <tr
                key={release.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-left"
                    onClick={() => onSelectRelease(release.id)}
                  >
                    {release.version}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASS[release.status]}`}
                  >
                    {RELEASE_STATUS_LABEL[release.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{items.length}</td>
                <td className="px-4 py-3 text-gray-700">
                  {qcProgress ? `${qcProgress.passed}/${qcProgress.total}` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
