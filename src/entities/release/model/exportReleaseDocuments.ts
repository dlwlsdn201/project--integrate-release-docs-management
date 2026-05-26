import { generateChangelog, generateQcChecklist, generateReleaseNote } from './generateReleaseDocuments';
import type { Release, ReleaseItem } from './types';

const toCsvCell = (value: string | number | null): string => {
  const text = value === null ? '' : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
};

const toCsvRow = (values: Array<string | number | null>): string => values.map(toCsvCell).join(',');

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const generateChangelogCsv = (release: Release, items: ReleaseItem[]): string => {
  const changelogData = generateChangelog(release, items);
  const rows = [toCsvRow(['Category', 'Ticket', 'Summary'])];

  for (const group of changelogData.groups) {
    for (const item of group.items) {
      rows.push(toCsvRow([group.label, item.ticketNumber, item.summary]));
    }
  }

  return rows.join('\n');
};

export const generateQcChecklistCsv = (items: ReleaseItem[]): string => {
  const qcData = generateQcChecklist(items);
  const rows = [
    toCsvRow(['Ticket', 'Release Item', 'Scenario', 'Expected Result', 'Status', 'Failed Reason']),
  ];

  for (const entry of qcData) {
    for (const testCase of entry.testCases) {
      rows.push(
        toCsvRow([
          entry.ticketNumber,
          entry.releaseItemTitle,
          testCase.description,
          testCase.expectedResult,
          testCase.status,
          testCase.failedReason,
        ]),
      );
    }
  }

  return rows.join('\n');
};

export const generateReleaseNoteHtml = (release: Release, items: ReleaseItem[]): string => {
  const releaseNoteData = generateReleaseNote(release, items);
  const sections = releaseNoteData.items.map((item) =>
    [
      '<section>',
      `<h2>${escapeHtml(item.title)}</h2>`,
      `<p><strong>${escapeHtml(item.categoryLabel)}</strong> ${escapeHtml(item.ticketNumber)}</p>`,
      `<p>${escapeHtml(item.userDescription)}</p>`,
      '</section>',
    ].join('\n'),
  );

  return [
    '<!doctype html>',
    '<html lang="ko">',
    '<head>',
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(release.title)}</title>`,
    '</head>',
    '<body>',
    `<h1>${escapeHtml(release.title)}</h1>`,
    ...sections,
    '</body>',
    '</html>',
  ].join('\n');
};

export const generateReleaseJson = (release: Release, items: ReleaseItem[]): string =>
  JSON.stringify({ release, items }, null, 2);
