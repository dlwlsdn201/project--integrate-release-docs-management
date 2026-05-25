import { MOCK_RELEASES, MOCK_RELEASE_ITEMS } from '@entities/release';
import { ReleaseListPanel } from '@widgets/release-list';

interface ReleaseListPageProps {
  onSelectRelease: (releaseId: string) => void;
}

export const ReleaseListPage = ({ onSelectRelease }: ReleaseListPageProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">릴리즈 목록</h2>
      <ReleaseListPanel
        releases={MOCK_RELEASES}
        allItems={MOCK_RELEASE_ITEMS}
        onSelectRelease={onSelectRelease}
      />
    </div>
  );
};
