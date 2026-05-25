import type { GitlabIssue, GitlabMergeRequest } from '@entities/release';
import type { ReleaseItemFormValues } from './schema';

export type AutoFillValues = Pick<
  ReleaseItemFormValues,
  'title' | 'ticketNumber' | 'assigneeName' | 'gitlabIssueUrl' | 'gitlabMergeRequestUrl'
>;

export const mapGitlabIssueToFormValues = (issue: GitlabIssue): AutoFillValues => ({
  title: issue.title,
  ticketNumber: `#${issue.iid}`,
  assigneeName: issue.assignee?.name ?? '',
  gitlabIssueUrl: issue.webUrl,
  gitlabMergeRequestUrl: '',
});

export const mapGitlabMrToFormValues = (mr: GitlabMergeRequest): AutoFillValues => ({
  title: mr.title,
  ticketNumber: `!${mr.iid}`,
  assigneeName: mr.assignee?.name ?? '',
  gitlabIssueUrl: '',
  gitlabMergeRequestUrl: mr.webUrl,
});
