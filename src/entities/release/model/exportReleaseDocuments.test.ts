import { describe, expect, it } from 'vitest';
import { MOCK_RELEASES, getMockReleaseItems } from './mockRelease';
import {
  generateChangelogCsv,
  generateQcChecklistCsv,
  generateReleaseJson,
  generateReleaseNoteHtml,
} from './exportReleaseDocuments';

describe('exportReleaseDocuments', () => {
  const release = MOCK_RELEASES[0];
  const items = getMockReleaseItems(release.id);

  it('CHANGELOG CSV를 변경 유형과 티켓 기준으로 생성한다', () => {
    const csv = generateChangelogCsv(release, items);

    expect(csv).toContain('Category,Ticket,Summary');
    expect(csv).toContain('Major,ABC-123,로그인 실패 안내 문구 개선');
  });

  it('QC Checklist CSV에 상태와 실패 사유를 포함한다', () => {
    const failedItems = items.map((item) =>
      item.id === 'ri-002'
        ? {
            ...item,
            testCases: item.testCases.map((testCase) =>
              testCase.id === 'tc-003'
                ? { ...testCase, status: 'FAILED' as const, failedReason: '기간 API 지연' }
                : testCase,
            ),
          }
        : item,
    );

    const csv = generateQcChecklistCsv(failedItems);

    expect(csv).toContain('Ticket,Release Item,Scenario,Expected Result,Status,Failed Reason');
    expect(csv).toContain('ABC-145,관리자 대시보드 기간 필터 추가,기간 필터 적용 확인');
    expect(csv).toContain('FAILED,기간 API 지연');
  });

  it('Release Note HTML은 공개 항목만 포함한다', () => {
    const html = generateReleaseNoteHtml(release, items);

    expect(html).toContain('<h1>v1.8.0 릴리즈</h1>');
    expect(html).toContain('로그인 실패 안내 문구 개선');
    expect(html).not.toContain('알림 목록 UI 개선');
  });

  it('릴리즈 JSON은 release와 items를 직렬화한다', () => {
    const json = generateReleaseJson(release, items);
    const parsed = JSON.parse(json) as { release: { id: string }; items: unknown[] };

    expect(parsed.release.id).toBe('release-v1.8.0');
    expect(parsed.items).toHaveLength(4);
  });
});
