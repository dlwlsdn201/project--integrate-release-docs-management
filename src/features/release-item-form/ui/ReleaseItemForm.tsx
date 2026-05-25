import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm, type UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReleaseItem, QCTestCase } from '@entities/release';
import {
  MOCK_GITLAB_ISSUES,
  MOCK_GITLAB_MRS,
  CHANGE_CATEGORY,
  CHANGE_CATEGORY_LABEL,
  TEST_STATUS,
} from '@entities/release';
import { createId } from '@shared/lib/createId';
import { releaseItemFormSchema, type ReleaseItemFormValues } from '../model/schema';
import {
  mapGitlabIssueToFormValues,
  mapGitlabMrToFormValues,
  type AutoFillValues,
} from '../model/mapGitlabToReleaseItemFormValues';

interface ReleaseItemFormProps {
  releaseId: string;
  onSubmit: (item: ReleaseItem) => void;
  onCancel: () => void;
}

const INPUT_CLASS =
  'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';
const ERROR_CLASS = 'text-xs text-red-500 mt-1';
const FIELD_CLASS = 'flex flex-col';
const SET_VALUE_OPTIONS = { shouldDirty: true, shouldValidate: true } as const;

const applyAutoFillValues = (
  setValue: UseFormSetValue<ReleaseItemFormValues>,
  values: AutoFillValues,
) => {
  setValue('title', values.title, SET_VALUE_OPTIONS);
  setValue('ticketNumber', values.ticketNumber, SET_VALUE_OPTIONS);
  setValue('assigneeName', values.assigneeName, SET_VALUE_OPTIONS);
  setValue('gitlabIssueUrl', values.gitlabIssueUrl, SET_VALUE_OPTIONS);
  setValue('gitlabMergeRequestUrl', values.gitlabMergeRequestUrl, SET_VALUE_OPTIONS);
};

export const ReleaseItemForm = ({ releaseId, onSubmit, onCancel }: ReleaseItemFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReleaseItemFormValues>({
    resolver: zodResolver(releaseItemFormSchema),
    defaultValues: {
      releaseId,
      ticketNumber: '',
      title: '',
      category: CHANGE_CATEGORY.MAJOR,
      isPublic: true,
      changelogSummary: '',
      userDescription: '',
      testScenario: '',
      expectedResult: '',
      assigneeName: '',
      gitlabSourceUrl: '',
      gitlabIssueUrl: '',
      gitlabMergeRequestUrl: '',
    },
  });

  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [selectedMrId, setSelectedMrId] = useState('');
  const watchedUrl = watch('gitlabSourceUrl');

  useEffect(() => {
    if (!watchedUrl) return;
    const matchedIssue = MOCK_GITLAB_ISSUES.find((i) => i.webUrl === watchedUrl);
    if (matchedIssue) {
      const vals = mapGitlabIssueToFormValues(matchedIssue);
      setSelectedIssueId(String(matchedIssue.id));
      setSelectedMrId('');
      applyAutoFillValues(setValue, vals);
      return;
    }
    const matchedMr = MOCK_GITLAB_MRS.find((m) => m.webUrl === watchedUrl);
    if (matchedMr) {
      const vals = mapGitlabMrToFormValues(matchedMr);
      setSelectedIssueId('');
      setSelectedMrId(String(matchedMr.id));
      applyAutoFillValues(setValue, vals);
    }
  }, [setValue, watchedUrl]);

  const handleIssueSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const issueId = e.target.value;
    setSelectedIssueId(issueId);
    setSelectedMrId('');
    const issue = MOCK_GITLAB_ISSUES.find((i) => i.id === Number(issueId));
    if (!issue) return;
    const vals = mapGitlabIssueToFormValues(issue);
    setValue('gitlabSourceUrl', vals.gitlabIssueUrl, SET_VALUE_OPTIONS);
    applyAutoFillValues(setValue, vals);
  };

  const handleMrSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const mrId = e.target.value;
    setSelectedIssueId('');
    setSelectedMrId(mrId);
    const mr = MOCK_GITLAB_MRS.find((m) => m.id === Number(mrId));
    if (!mr) return;
    const vals = mapGitlabMrToFormValues(mr);
    setValue('gitlabSourceUrl', vals.gitlabMergeRequestUrl, SET_VALUE_OPTIONS);
    applyAutoFillValues(setValue, vals);
  };

  const onFormSubmit = (values: ReleaseItemFormValues) => {
    const now = new Date().toISOString();
    const itemId = createId();

    const testCases: QCTestCase[] =
      values.testScenario && values.expectedResult
        ? [
            {
              id: createId(),
              releaseItemId: itemId,
              description: values.testScenario,
              expectedResult: values.expectedResult,
              status: TEST_STATUS.NOT_STARTED,
              testerName: null,
              failedReason: null,
            },
          ]
        : [];

    onSubmit({
      id: itemId,
      releaseId: values.releaseId,
      gitlabIssueUrl: values.gitlabIssueUrl,
      gitlabMergeRequestUrl: values.gitlabMergeRequestUrl || null,
      ticketNumber: values.ticketNumber,
      title: values.title,
      category: values.category,
      isPublic: values.isPublic,
      changelogSummary: values.changelogSummary,
      userDescription: values.userDescription,
      assigneeName: values.assigneeName,
      beforeImageUrls: [],
      afterImageUrls: [],
      testCases,
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className="bg-white border border-gray-200 rounded-lg p-5 space-y-5"
    >
      <h2 className="text-base font-semibold text-gray-900">릴리즈 항목 추가</h2>

      <input type="hidden" {...register('releaseId')} />

      {/* GitLab 연동 */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          GitLab 연동 (선택)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={FIELD_CLASS}>
            <label htmlFor="gitlab-issue-select" className={LABEL_CLASS}>
              Issue 선택
            </label>
            <select
              id="gitlab-issue-select"
              className={INPUT_CLASS}
              value={selectedIssueId}
              onChange={handleIssueSelect}
            >
              <option value="">선택 안함</option>
              {MOCK_GITLAB_ISSUES.map((issue) => (
                <option key={issue.id} value={issue.id}>
                  #{issue.iid} {issue.title}
                </option>
              ))}
            </select>
          </div>
          <div className={FIELD_CLASS}>
            <label htmlFor="gitlab-mr-select" className={LABEL_CLASS}>
              MR 선택
            </label>
            <select
              id="gitlab-mr-select"
              className={INPUT_CLASS}
              value={selectedMrId}
              onChange={handleMrSelect}
            >
              <option value="">선택 안함</option>
              {MOCK_GITLAB_MRS.map((mr) => (
                <option key={mr.id} value={mr.id}>
                  !{mr.iid} {mr.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={FIELD_CLASS}>
          <label htmlFor="gitlabSourceUrl" className={LABEL_CLASS}>
            URL로 자동 채우기
          </label>
          <input
            id="gitlabSourceUrl"
            {...register('gitlabSourceUrl')}
            className={INPUT_CLASS}
            placeholder="GitLab Issue 또는 MR URL 입력 시 자동 매칭"
          />
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={FIELD_CLASS}>
          <label htmlFor="ticketNumber" className={LABEL_CLASS}>
            이슈 번호 / 티켓 번호 <span className="text-red-500">*</span>
          </label>
          <input
            id="ticketNumber"
            {...register('ticketNumber')}
            className={INPUT_CLASS}
            placeholder="#123"
          />
          {errors.ticketNumber && (
            <p className={ERROR_CLASS}>{errors.ticketNumber.message}</p>
          )}
        </div>
        <div className={FIELD_CLASS}>
          <label htmlFor="assigneeName" className={LABEL_CLASS}>
            담당자 <span className="text-red-500">*</span>
          </label>
          <input
            id="assigneeName"
            {...register('assigneeName')}
            className={INPUT_CLASS}
            placeholder="홍길동"
          />
          {errors.assigneeName && (
            <p className={ERROR_CLASS}>{errors.assigneeName.message}</p>
          )}
        </div>
      </div>

      <div className={FIELD_CLASS}>
        <label htmlFor="title" className={LABEL_CLASS}>
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          {...register('title')}
          className={INPUT_CLASS}
          placeholder="릴리즈 항목 제목"
        />
        {errors.title && <p className={ERROR_CLASS}>{errors.title.message}</p>}
      </div>

      <div className={FIELD_CLASS}>
        <label htmlFor="gitlabMergeRequestUrl" className={LABEL_CLASS}>
          GitLab MR URL
        </label>
        <input
          id="gitlabMergeRequestUrl"
          {...register('gitlabMergeRequestUrl')}
          className={INPUT_CLASS}
          placeholder="https://gitlab.example.com/project/-/merge_requests/88"
        />
      </div>

      {/* 분류 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={FIELD_CLASS}>
          <label htmlFor="category" className={LABEL_CLASS}>
            변경 유형 <span className="text-red-500">*</span>
          </label>
          <select id="category" {...register('category')} className={INPUT_CLASS}>
            {Object.entries(CHANGE_CATEGORY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className={FIELD_CLASS}>
          <span className={LABEL_CLASS}>사용자 노출</span>
          <label className="flex items-center gap-2 mt-1.5 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" {...register('isPublic')} className="h-4 w-4" />
            사용자에게 노출
          </label>
        </div>
      </div>

      {/* 문서 */}
      <div className={FIELD_CLASS}>
        <label htmlFor="changelogSummary" className={LABEL_CLASS}>
          CHANGELOG 요약 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="changelogSummary"
          {...register('changelogSummary')}
          rows={2}
          className={INPUT_CLASS}
          placeholder="변경 내용을 한 줄로 요약해주세요."
        />
        {errors.changelogSummary && (
          <p className={ERROR_CLASS}>{errors.changelogSummary.message}</p>
        )}
      </div>

      <div className={FIELD_CLASS}>
        <label htmlFor="userDescription" className={LABEL_CLASS}>
          사용자용 설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="userDescription"
          {...register('userDescription')}
          rows={3}
          className={INPUT_CLASS}
          placeholder="사용자에게 보여줄 변경 내용 설명을 입력해주세요."
        />
        {errors.userDescription && (
          <p className={ERROR_CLASS}>{errors.userDescription.message}</p>
        )}
      </div>

      {/* 테스트 케이스 */}
      <div className="border border-gray-100 rounded p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          QC 테스트 케이스 (선택)
        </p>
        <div className={FIELD_CLASS}>
          <label htmlFor="testScenario" className={LABEL_CLASS}>
            테스트 시나리오
          </label>
          <textarea
            id="testScenario"
            {...register('testScenario')}
            rows={2}
            className={INPUT_CLASS}
            placeholder="시나리오와 기대 결과 모두 입력하면 테스트 케이스가 생성됩니다."
          />
        </div>
        <div className={FIELD_CLASS}>
          <label htmlFor="expectedResult" className={LABEL_CLASS}>
            기대 결과
          </label>
          <textarea
            id="expectedResult"
            {...register('expectedResult')}
            rows={2}
            className={INPUT_CLASS}
            placeholder="기대 결과를 입력해주세요."
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          저장
        </button>
      </div>
    </form>
  );
};
