import { MOCK_RELEASES, getMockReleaseItems } from '@entities/release';
import { ReleaseDetailPanel } from '@widgets/release-detail';
import { ReleaseDocumentTabs } from '@widgets/release-document-tabs';

interface ReleaseDetailPageProps {
  releaseId: string;
  onBack: () => void;
}

export const ReleaseDetailPage = ({ releaseId, onBack }: ReleaseDetailPageProps) => {
  const release = MOCK_RELEASES.find((r) => r.id === releaseId);
  const items = getMockReleaseItems(releaseId);

  if (!release) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
          ← 목록으로
        </button>
        <p className="text-sm text-gray-500">릴리즈를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-4">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
        ← 목록으로
      </button>
      <ReleaseDetailPanel release={release} />
      <ReleaseDocumentTabs release={release} items={items} />
    </div>
  );
};
