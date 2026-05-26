import { useEffect, useState } from 'react';
import type { QCTestCaseUpdate, ReleaseItem } from '@entities/release';
import { MOCK_RELEASES, getMockReleaseItems, updateReleaseItemTestCase } from '@entities/release';
import { ReleaseDetailPanel } from '@widgets/release-detail';
import { ReleaseDocumentTabs } from '@widgets/release-document-tabs';
import { ReleaseItemForm } from '@features/release-item-form';

interface ReleaseDetailPageProps {
  releaseId: string;
  onBack: () => void;
  items?: ReleaseItem[];
  onItemsChange?: (items: ReleaseItem[]) => void;
}

export const ReleaseDetailPage = ({
  releaseId,
  onBack,
  items: externalItems,
  onItemsChange,
}: ReleaseDetailPageProps) => {
  const release = MOCK_RELEASES.find((r) => r.id === releaseId);
  const [items, setItems] = useState<ReleaseItem[]>(() => getMockReleaseItems(releaseId));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const currentItems = externalItems ?? items;

  useEffect(() => {
    setItems(getMockReleaseItems(releaseId));
    setIsFormOpen(false);
  }, [releaseId]);

  const updateItems = (updater: (prevItems: ReleaseItem[]) => ReleaseItem[]) => {
    const nextItems = updater(currentItems);
    if (onItemsChange) {
      onItemsChange(nextItems);
      return;
    }
    setItems(nextItems);
  };

  const handleItemSubmit = (newItem: ReleaseItem) => {
    updateItems((prev) => [...prev, newItem]);
    setIsFormOpen(false);
  };

  const handleTestCaseUpdate = (testCaseId: string, updates: QCTestCaseUpdate) => {
    updateItems((prev) => updateReleaseItemTestCase(prev, testCaseId, updates));
  };

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
      {isFormOpen ? (
        <ReleaseItemForm
          releaseId={releaseId}
          onSubmit={handleItemSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + 릴리즈 항목 추가
          </button>
        </div>
      )}
      <ReleaseDocumentTabs
        release={release}
        items={currentItems}
        onUpdateTestCase={handleTestCaseUpdate}
      />
    </div>
  );
};
