import {
  generateChangelog,
  generateQcChecklist,
  generateReleaseNote,
  generateAnnouncement,
} from './generateReleaseDocuments';
import { CHANGE_CATEGORY, RELEASE_STATUS, TEST_STATUS } from './constants';
import type { Release, ReleaseItem, QCTestCase } from './types';

const makeRelease = (overrides?: Partial<Release>): Release => ({
  id: 'release-test',
  version: 'v1.0.0',
  title: 'v1.0.0 릴리즈',
  status: RELEASE_STATUS.RELEASED,
  releasedAt: '2026-05-25T10:00:00Z',
  createdAt: '2026-05-01T09:00:00Z',
  updatedAt: '2026-05-25T10:00:00Z',
  ...overrides,
});

const makeTestCase = (overrides?: Partial<QCTestCase>): QCTestCase => ({
  id: 'tc-test',
  releaseItemId: 'ri-test',
  description: '테스트 항목 설명',
  expectedResult: '기대 결과',
  status: TEST_STATUS.NOT_STARTED,
  testerName: null,
  failedReason: null,
  ...overrides,
});

const makeItem = (overrides?: Partial<ReleaseItem>): ReleaseItem => ({
  id: 'ri-test',
  releaseId: 'release-test',
  gitlabIssueUrl: 'https://gitlab.example.com/project/-/issues/1',
  gitlabMergeRequestUrl: null,
  ticketNumber: 'TEST-001',
  title: '기본 항목 제목',
  category: CHANGE_CATEGORY.MINOR,
  isPublic: true,
  changelogSummary: '기본 변경사항 요약',
  userDescription: '사용자용 설명',
  assigneeName: '담당자',
  beforeImageUrls: [],
  afterImageUrls: [],
  testCases: [],
  createdAt: '2026-05-01T09:00:00Z',
  updatedAt: '2026-05-01T09:00:00Z',
  ...overrides,
});

describe('generateChangelog', () => {
  it('항목이 없으면 groups 배열이 비어 있다', () => {
    const release = makeRelease();
    const result = generateChangelog(release, []);

    expect(result.version).toBe('v1.0.0');
    expect(result.groups).toHaveLength(0);
  });

  it('항목을 변경 유형별로 그룹화한다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', ticketNumber: 'A-001', category: CHANGE_CATEGORY.MAJOR }),
      makeItem({ id: 'ri-2', ticketNumber: 'A-002', category: CHANGE_CATEGORY.MINOR }),
    ];
    const result = generateChangelog(release, items);

    expect(result.groups).toHaveLength(2);
    expect(result.groups[0].category).toBe(CHANGE_CATEGORY.MAJOR);
    expect(result.groups[1].category).toBe(CHANGE_CATEGORY.MINOR);
  });

  it('MAJOR → MINOR → PATCH → BUGFIX 순서로 그룹을 반환한다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', category: CHANGE_CATEGORY.BUGFIX }),
      makeItem({ id: 'ri-2', category: CHANGE_CATEGORY.MAJOR }),
      makeItem({ id: 'ri-3', category: CHANGE_CATEGORY.PATCH }),
      makeItem({ id: 'ri-4', category: CHANGE_CATEGORY.MINOR }),
    ];
    const result = generateChangelog(release, items);

    const categories = result.groups.map((group) => group.category);
    expect(categories).toEqual([
      CHANGE_CATEGORY.MAJOR,
      CHANGE_CATEGORY.MINOR,
      CHANGE_CATEGORY.PATCH,
      CHANGE_CATEGORY.BUGFIX,
    ]);
  });

  it('항목이 없는 변경 유형 그룹은 결과에서 제외한다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [makeItem({ category: CHANGE_CATEGORY.MAJOR })];
    const result = generateChangelog(release, items);

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].category).toBe(CHANGE_CATEGORY.MAJOR);
  });

  it('같은 변경 유형의 항목을 하나의 그룹으로 묶는다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', ticketNumber: 'A-001', category: CHANGE_CATEGORY.MAJOR }),
      makeItem({ id: 'ri-2', ticketNumber: 'A-002', category: CHANGE_CATEGORY.MAJOR }),
    ];
    const result = generateChangelog(release, items);

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].items).toHaveLength(2);
  });

  it('각 항목에 ticketNumber, title, summary가 포함된다', () => {
    const release = makeRelease();
    const item = makeItem({
      ticketNumber: 'ABC-123',
      title: '로그인 개선',
      changelogSummary: 'CHANGELOG 요약문',
      category: CHANGE_CATEGORY.MAJOR,
    });
    const result = generateChangelog(release, [item]);

    const changelogItem = result.groups[0].items[0];
    expect(changelogItem.ticketNumber).toBe('ABC-123');
    expect(changelogItem.title).toBe('로그인 개선');
    expect(changelogItem.summary).toBe('CHANGELOG 요약문');
  });
});

describe('generateQcChecklist', () => {
  it('테스트 케이스가 없으면 빈 배열을 반환한다', () => {
    const result = generateQcChecklist([]);
    expect(result).toHaveLength(0);
  });

  it('테스트 케이스가 없는 항목을 제외한다', () => {
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', testCases: [] }),
      makeItem({ id: 'ri-2', testCases: [makeTestCase()] }),
    ];
    const result = generateQcChecklist(items);

    expect(result).toHaveLength(1);
    expect(result[0].releaseItemId).toBe('ri-2');
  });

  it('테스트 케이스가 있는 항목의 체크리스트 항목을 반환한다', () => {
    const testCase = makeTestCase({ id: 'tc-1', description: '테스트 설명' });
    const item = makeItem({ id: 'ri-1', ticketNumber: 'A-001', title: '항목 제목', testCases: [testCase] });
    const result = generateQcChecklist([item]);

    expect(result[0].releaseItemId).toBe('ri-1');
    expect(result[0].ticketNumber).toBe('A-001');
    expect(result[0].releaseItemTitle).toBe('항목 제목');
    expect(result[0].testCases).toHaveLength(1);
    expect(result[0].testCases[0].description).toBe('테스트 설명');
  });
});

describe('generateReleaseNote', () => {
  it('항목이 없으면 items 배열이 비어 있다', () => {
    const release = makeRelease();
    const result = generateReleaseNote(release, []);

    expect(result.version).toBe('v1.0.0');
    expect(result.items).toHaveLength(0);
  });

  it('isPublic이 false인 항목을 제외한다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', isPublic: true }),
      makeItem({ id: 'ri-2', isPublic: false }),
    ];
    const result = generateReleaseNote(release, items);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].ticketNumber).toBe(items[0].ticketNumber);
  });

  it('릴리즈 버전과 releasedAt을 포함한다', () => {
    const release = makeRelease({ version: 'v2.0.0', releasedAt: '2026-06-01T00:00:00Z' });
    const result = generateReleaseNote(release, []);

    expect(result.version).toBe('v2.0.0');
    expect(result.releasedAt).toBe('2026-06-01T00:00:00Z');
  });

  it('releasedAt이 null이면 null을 반환한다', () => {
    const release = makeRelease({ releasedAt: null });
    const result = generateReleaseNote(release, []);

    expect(result.releasedAt).toBeNull();
  });

  it('공개 항목에 categoryLabel이 포함된다', () => {
    const release = makeRelease();
    const item = makeItem({ isPublic: true, category: CHANGE_CATEGORY.MAJOR });
    const result = generateReleaseNote(release, [item]);

    expect(result.items[0].categoryLabel).toBe('Major');
  });
});

describe('generateAnnouncement', () => {
  it('항목이 없으면 majorItems, minorItems가 빈 배열이다', () => {
    const release = makeRelease();
    const result = generateAnnouncement(release, []);

    expect(result.majorItems).toHaveLength(0);
    expect(result.minorItems).toHaveLength(0);
  });

  it('MAJOR 항목만 majorItems에 포함된다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', category: CHANGE_CATEGORY.MAJOR }),
      makeItem({ id: 'ri-2', category: CHANGE_CATEGORY.MINOR }),
      makeItem({ id: 'ri-3', category: CHANGE_CATEGORY.BUGFIX }),
    ];
    const result = generateAnnouncement(release, items);

    expect(result.majorItems).toHaveLength(1);
    expect(result.minorItems).toHaveLength(1);
  });

  it('PATCH, BUGFIX 항목은 majorItems, minorItems에 포함되지 않는다', () => {
    const release = makeRelease();
    const items: ReleaseItem[] = [
      makeItem({ id: 'ri-1', category: CHANGE_CATEGORY.PATCH }),
      makeItem({ id: 'ri-2', category: CHANGE_CATEGORY.BUGFIX }),
    ];
    const result = generateAnnouncement(release, items);

    expect(result.majorItems).toHaveLength(0);
    expect(result.minorItems).toHaveLength(0);
  });

  it('config가 없으면 기본 contactChannel을 사용한다', () => {
    const release = makeRelease();
    const result = generateAnnouncement(release, []);

    expect(result.contactChannel).toBe('#개발팀');
  });

  it('config.contactChannel을 지정하면 해당 값을 사용한다', () => {
    const release = makeRelease();
    const result = generateAnnouncement(release, [], { contactChannel: '#release-team' });

    expect(result.contactChannel).toBe('#release-team');
  });

  it('config.releaseNoteUrl을 지정하면 text에 포함된다', () => {
    const release = makeRelease();
    const result = generateAnnouncement(release, [], {
      releaseNoteUrl: 'https://example.com/release/v1.0.0',
    });

    expect(result.text).toContain('https://example.com/release/v1.0.0');
  });

  it('릴리즈 버전이 text 첫 줄에 포함된다', () => {
    const release = makeRelease({ version: 'v1.8.0' });
    const result = generateAnnouncement(release, []);

    expect(result.text).toContain('[v1.8.0 릴리즈 변경사항]');
  });

  it('Major 항목이 있으면 text에 해당 섹션이 포함된다', () => {
    const release = makeRelease();
    const item = makeItem({
      category: CHANGE_CATEGORY.MAJOR,
      ticketNumber: 'ABC-123',
      changelogSummary: '로그인 개선',
    });
    const result = generateAnnouncement(release, [item]);

    expect(result.text).toContain('Major');
    expect(result.text).toContain('- ABC-123 로그인 개선');
  });
});
