import type { Release } from '@entities/release';
import { RELEASE_STATUS_LABEL } from '@entities/release';

interface ReleaseDetailPanelProps {
  release: Release;
}

const formatDate = (isoString: string | null): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const ReleaseDetailPanel = ({ release }: ReleaseDetailPanelProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{release.version}</h2>
        <span className="text-sm text-gray-500">{release.title}</span>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-gray-500">상태</dt>
          <dd className="mt-1 font-medium text-gray-900">{RELEASE_STATUS_LABEL[release.status]}</dd>
        </div>
        <div>
          <dt className="text-gray-500">생성일</dt>
          <dd className="mt-1 font-medium text-gray-900">{formatDate(release.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">배포일</dt>
          <dd className="mt-1 font-medium text-gray-900">{formatDate(release.releasedAt)}</dd>
        </div>
      </dl>
    </div>
  );
};
