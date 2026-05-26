import { useState, useEffect } from 'react';
import { ReleaseListPage } from '@pages/release-list';
import { ReleaseDetailPage } from '@pages/release-detail';
import { MOCK_RELEASE_ITEMS } from '@entities/release';
import type { ReleaseItem } from '@entities/release';

const APP_TITLE = 'ReleaseHub';

type Route = { type: 'list' } | { type: 'detail'; releaseId: string };

const parseHash = (hash: string): Route => {
  const path = hash.replace(/^#/, '');
  const match = path.match(/^\/releases\/(.+)$/);
  if (match) return { type: 'detail', releaseId: match[1] };
  return { type: 'list' };
};

export const App = () => {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [items, setItems] = useState<ReleaseItem[]>(MOCK_RELEASE_ITEMS);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleReleaseItemsChange = (releaseId: string, nextReleaseItems: ReleaseItem[]) => {
    setItems((prevItems) => [
      ...prevItems.filter((releaseItem) => releaseItem.releaseId !== releaseId),
      ...nextReleaseItems,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sticky top-0 z-10">
        <button
          onClick={() => navigate('/releases')}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
        >
          {APP_TITLE}
        </button>
      </header>
      <main>
        {route.type === 'list' && (
          <ReleaseListPage
            allItems={items}
            onSelectRelease={(id) => navigate(`/releases/${id}`)}
          />
        )}
        {route.type === 'detail' && (
          <ReleaseDetailPage
            releaseId={route.releaseId}
            items={items.filter((releaseItem) => releaseItem.releaseId === route.releaseId)}
            onItemsChange={(nextReleaseItems) =>
              handleReleaseItemsChange(route.releaseId, nextReleaseItems)
            }
            onBack={() => navigate('/releases')}
          />
        )}
      </main>
    </div>
  );
};
