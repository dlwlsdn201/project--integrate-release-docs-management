import { useState } from 'react';
import type { Release, ReleaseItem } from '@entities/release';
import {
  generateChangelogCsv,
  generateQcChecklistCsv,
  generateReleaseJson,
  generateReleaseNoteHtml,
} from '@entities/release';

interface ReleaseExportActionsProps {
  release: Release;
  items: ReleaseItem[];
  announcementText: string;
}

type CopyStatus = 'idle' | 'success' | 'error';

const downloadTextFile = (filename: string, contents: string, mimeType: string) => {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const ReleaseExportActions = ({
  release,
  items,
  announcementText,
}: ReleaseExportActionsProps) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleCopyAnnouncement = async () => {
    try {
      await navigator.clipboard.writeText(announcementText);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  };

  const handleChangelogCsvDownload = () => {
    downloadTextFile(`${release.version}-changelog.csv`, generateChangelogCsv(release, items), 'text/csv');
  };

  const handleQcCsvDownload = () => {
    downloadTextFile(`${release.version}-qc-checklist.csv`, generateQcChecklistCsv(items), 'text/csv');
  };

  const handleReleaseNoteHtmlDownload = () => {
    downloadTextFile(
      `${release.version}-release-note.html`,
      generateReleaseNoteHtml(release, items),
      'text/html',
    );
  };

  const handleReleaseJsonDownload = () => {
    downloadTextFile(
      `${release.version}-release.json`,
      generateReleaseJson(release, items),
      'application/json',
    );
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopyAnnouncement}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
        >
          공지문 복사
        </button>
        <button
          type="button"
          onClick={handleChangelogCsvDownload}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
        >
          CHANGELOG CSV
        </button>
        <button
          type="button"
          onClick={handleQcCsvDownload}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
        >
          QC CSV
        </button>
        <button
          type="button"
          onClick={handleReleaseNoteHtmlDownload}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
        >
          Release Note HTML
        </button>
        <button
          type="button"
          onClick={handleReleaseJsonDownload}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100"
        >
          릴리즈 JSON
        </button>
      </div>
      {copyStatus === 'success' && (
        <p role="status" className="mt-2 text-xs text-green-600">
          공지문을 복사했습니다.
        </p>
      )}
      {copyStatus === 'error' && (
        <p role="status" className="mt-2 text-xs text-red-600">
          공지문 복사에 실패했습니다.
        </p>
      )}
    </div>
  );
};
