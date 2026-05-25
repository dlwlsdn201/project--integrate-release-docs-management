import { CHANGE_CATEGORY } from '@entities/release';
import { z } from 'zod';

const CHANGE_CATEGORY_VALUES = [
  CHANGE_CATEGORY.MAJOR,
  CHANGE_CATEGORY.MINOR,
  CHANGE_CATEGORY.PATCH,
  CHANGE_CATEGORY.BUGFIX,
] as const;

export const releaseItemFormSchema = z.object({
  releaseId: z.string().min(1),
  ticketNumber: z.string().min(1, '이슈 번호를 입력해주세요.'),
  title: z.string().min(1, '제목을 입력해주세요.'),
  category: z.enum(CHANGE_CATEGORY_VALUES),
  isPublic: z.boolean(),
  changelogSummary: z.string().min(1, 'CHANGELOG 요약을 입력해주세요.'),
  userDescription: z.string().min(1, '사용자용 설명을 입력해주세요.'),
  testScenario: z.string(),
  expectedResult: z.string(),
  assigneeName: z.string().min(1, '담당자를 입력해주세요.'),
  gitlabSourceUrl: z.string(),
  gitlabIssueUrl: z.string(),
  gitlabMergeRequestUrl: z.string(),
});

export type ReleaseItemFormValues = z.infer<typeof releaseItemFormSchema>;
