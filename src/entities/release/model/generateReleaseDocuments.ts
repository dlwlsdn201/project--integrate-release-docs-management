import { CHANGE_CATEGORY, CHANGELOG_CATEGORY_ORDER, CHANGE_CATEGORY_LABEL } from './constants';
import type { ChangeCategory } from './constants';
import type { Release, ReleaseItem, QCTestCase } from './types';

export interface ChangelogItem {
  ticketNumber: string;
  title: string;
  summary: string;
}

export interface ChangelogGroup {
  category: ChangeCategory;
  label: string;
  items: ChangelogItem[];
}

export interface ChangelogData {
  version: string;
  groups: ChangelogGroup[];
}

export interface QcChecklistEntry {
  releaseItemId: string;
  ticketNumber: string;
  releaseItemTitle: string;
  testCases: QCTestCase[];
}

export type QcChecklistData = QcChecklistEntry[];

export interface ReleaseNoteItem {
  ticketNumber: string;
  title: string;
  category: ChangeCategory;
  categoryLabel: string;
  userDescription: string;
  beforeImageUrls: string[];
  afterImageUrls: string[];
}

export interface ReleaseNoteData {
  version: string;
  releasedAt: string | null;
  items: ReleaseNoteItem[];
}

export interface AnnouncementConfig {
  releaseNoteUrl?: string;
  contactChannel?: string;
}

export interface AnnouncementData {
  version: string;
  releasedAt: string | null;
  majorItems: ChangelogItem[];
  minorItems: ChangelogItem[];
  releaseNoteUrl: string;
  contactChannel: string;
  text: string;
}

const ANNOUNCEMENT_TEXT_CONFIG = {
  defaultContactChannel: '#개발팀',
  defaultReleaseNoteUrl: '',
  titleTemplate: (version: string) => `[${version} 릴리즈 변경사항]`,
  releaseNoteLabel: '릴리즈 노트',
  contactLabel: '문의',
} as const;

const toChangelogItem = (item: ReleaseItem): ChangelogItem => ({
  ticketNumber: item.ticketNumber,
  title: item.title,
  summary: item.changelogSummary,
});

/**
 * 릴리즈 항목을 변경 유형별로 그룹화하여 CHANGELOG 데이터를 생성한다.
 * 항목이 없는 변경 유형 그룹은 결과에서 제외된다.
 */
export const generateChangelog = (release: Release, items: ReleaseItem[]): ChangelogData => {
  const groupMap = new Map<ChangeCategory, ChangelogItem[]>();

  for (const item of items) {
    const existing = groupMap.get(item.category) ?? [];
    groupMap.set(item.category, [...existing, toChangelogItem(item)]);
  }

  const groups: ChangelogGroup[] = CHANGELOG_CATEGORY_ORDER.filter((category) => groupMap.has(category)).map(
    (category) => ({
      category,
      label: CHANGE_CATEGORY_LABEL[category],
      items: groupMap.get(category) ?? [],
    }),
  );

  return { version: release.version, groups };
};

/**
 * 릴리즈 항목의 테스트 케이스 목록을 QC 체크리스트 형태로 반환한다.
 * 테스트 케이스가 없는 항목은 결과에서 제외된다.
 */
export const generateQcChecklist = (items: ReleaseItem[]): QcChecklistData =>
  items
    .filter((item) => item.testCases.length > 0)
    .map((item) => ({
      releaseItemId: item.id,
      ticketNumber: item.ticketNumber,
      releaseItemTitle: item.title,
      testCases: item.testCases,
    }));

/**
 * 공개 대상 릴리즈 항목을 필터링하여 릴리즈 노트 데이터를 생성한다.
 * isPublic이 false인 항목은 결과에서 제외된다.
 */
export const generateReleaseNote = (release: Release, items: ReleaseItem[]): ReleaseNoteData => {
  const publicItems: ReleaseNoteItem[] = items
    .filter((item) => item.isPublic)
    .map((item) => ({
      ticketNumber: item.ticketNumber,
      title: item.title,
      category: item.category,
      categoryLabel: CHANGE_CATEGORY_LABEL[item.category],
      userDescription: item.userDescription,
      beforeImageUrls: item.beforeImageUrls,
      afterImageUrls: item.afterImageUrls,
    }));

  return { version: release.version, releasedAt: release.releasedAt, items: publicItems };
};

/**
 * 전사 메신저 공지문 데이터를 생성한다.
 * MAJOR, MINOR 항목만 포함되며, 구조화된 데이터와 포맷된 텍스트를 함께 반환한다.
 * config를 통해 릴리즈 노트 URL과 문의 채널을 지정할 수 있다.
 */
export const generateAnnouncement = (
  release: Release,
  items: ReleaseItem[],
  config?: AnnouncementConfig,
): AnnouncementData => {
  const contactChannel = config?.contactChannel ?? ANNOUNCEMENT_TEXT_CONFIG.defaultContactChannel;
  const releaseNoteUrl = config?.releaseNoteUrl ?? ANNOUNCEMENT_TEXT_CONFIG.defaultReleaseNoteUrl;

  const majorItems = items.filter((item) => item.category === CHANGE_CATEGORY.MAJOR).map(toChangelogItem);
  const minorItems = items.filter((item) => item.category === CHANGE_CATEGORY.MINOR).map(toChangelogItem);

  const sections: string[] = [ANNOUNCEMENT_TEXT_CONFIG.titleTemplate(release.version)];

  if (majorItems.length > 0) {
    sections.push(
      [
        CHANGE_CATEGORY_LABEL[CHANGE_CATEGORY.MAJOR],
        ...majorItems.map((item) => `- ${item.ticketNumber} ${item.summary}`),
      ].join('\n'),
    );
  }

  if (minorItems.length > 0) {
    sections.push(
      [
        CHANGE_CATEGORY_LABEL[CHANGE_CATEGORY.MINOR],
        ...minorItems.map((item) => `- ${item.ticketNumber} ${item.summary}`),
      ].join('\n'),
    );
  }

  const footerLines: string[] = [];
  if (releaseNoteUrl) {
    footerLines.push(`${ANNOUNCEMENT_TEXT_CONFIG.releaseNoteLabel}: ${releaseNoteUrl}`);
  }
  footerLines.push(`${ANNOUNCEMENT_TEXT_CONFIG.contactLabel}: ${contactChannel}`);
  sections.push(footerLines.join('\n'));

  return {
    version: release.version,
    releasedAt: release.releasedAt,
    majorItems,
    minorItems,
    releaseNoteUrl,
    contactChannel,
    text: sections.join('\n\n'),
  };
};
