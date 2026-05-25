import { useState } from 'react';
import type { Release, ReleaseItem } from '@entities/release';
import {
  generateChangelog,
  generateQcChecklist,
  generateReleaseNote,
  generateAnnouncement,
  CHANGE_CATEGORY_LABEL,
} from '@entities/release';
import type { TestStatus } from '@entities/release';

type TabId = 'overview' | 'changelog' | 'qcChecklist' | 'releaseNote' | 'announcement';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'changelog', label: 'CHANGELOG' },
  { id: 'qcChecklist', label: 'QC Checklist' },
  { id: 'releaseNote', label: 'Release Note' },
  { id: 'announcement', label: 'Announcement' },
];

const TEST_STATUS_LABEL: Record<TestStatus, string> = {
  NOT_STARTED: 'Not Started',
  PASSED: 'Passed',
  FAILED: 'Failed',
  BLOCKED: 'Blocked',
};

const TEST_STATUS_CLASS: Record<TestStatus, string> = {
  NOT_STARTED: 'text-gray-500',
  PASSED: 'text-green-600',
  FAILED: 'text-red-600',
  BLOCKED: 'text-orange-500',
};

interface ReleaseDocumentTabsProps {
  release: Release;
  items: ReleaseItem[];
}

export const ReleaseDocumentTabs = ({ release, items }: ReleaseDocumentTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const changelogData = generateChangelog(release, items);
  const qcData = generateQcChecklist(items);
  const releaseNoteData = generateReleaseNote(release, items);
  const announcementData = generateAnnouncement(release, items);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav role="tablist" className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">포함 항목 ({items.length})</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left font-medium text-gray-600">티켓</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">제목</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">유형</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">담당자</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">{item.ticketNumber}</td>
                      <td className="px-4 py-2 text-gray-900">{item.title}</td>
                      <td className="px-4 py-2 text-gray-600">{CHANGE_CATEGORY_LABEL[item.category]}</td>
                      <td className="px-4 py-2 text-gray-600">{item.assigneeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <p className="text-center py-6 text-sm text-gray-400">항목이 없습니다.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="space-y-4">
            {changelogData.groups.length === 0 ? (
              <p className="text-sm text-gray-400">변경사항이 없습니다.</p>
            ) : (
              changelogData.groups.map((group) => (
                <div key={group.category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h4>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.ticketNumber} className="flex gap-3 text-sm">
                        <span className="font-mono text-gray-400 shrink-0">{item.ticketNumber}</span>
                        <span className="text-gray-700">{item.summary}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'qcChecklist' && (
          <div className="space-y-4">
            {qcData.length === 0 ? (
              <p className="text-sm text-gray-400">QC 테스트 케이스가 없습니다.</p>
            ) : (
              qcData.map((entry) => (
                <div key={entry.releaseItemId}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <span className="font-mono text-gray-400 mr-2">{entry.ticketNumber}</span>
                    {entry.releaseItemTitle}
                  </h4>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">테스트 항목</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">기대 결과</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.testCases.map((tc) => (
                          <tr key={tc.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-3 py-2 text-gray-700">{tc.description}</td>
                            <td className="px-3 py-2 text-gray-600">{tc.expectedResult}</td>
                            <td className={`px-3 py-2 ${TEST_STATUS_CLASS[tc.status]}`}>
                              {TEST_STATUS_LABEL[tc.status]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'releaseNote' && (
          <div className="space-y-3">
            {releaseNoteData.items.length === 0 ? (
              <p className="text-sm text-gray-400">공개 릴리즈 노트 항목이 없습니다.</p>
            ) : (
              releaseNoteData.items.map((item) => (
                <div key={item.ticketNumber} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                      {item.categoryLabel}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.userDescription}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'announcement' && (
          <pre className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed">
            {announcementData.text}
          </pre>
        )}
      </div>
    </div>
  );
};
