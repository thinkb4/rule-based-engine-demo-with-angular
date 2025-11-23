import { Type } from '@angular/core';
import { pickByRules } from '@/app/shared/rules/decision-table';
import { JobState, JobType } from '@/app/shared/domain/job.model';
import {
  IdlePanelComponent,
  RunningPanelComponent,
  ReadyPanelComponent,
  FailedPanelComponent,
  JobStatePanel,
} from '@/app/shared/ui/job-state-panels';

export function selectPanelByRules(type: JobType, state: JobState): Type<JobStatePanel> {
  const isStd = type === JobType.Standard;
  const isPrm = type === JobType.Premium;
  const isIdle = state === JobState.Idle;
  const isRun = state === JobState.Running;
  const isReady = state === JobState.Ready;
  const isFail = state === JobState.Failed;

  return pickByRules<Type<JobStatePanel>>(
    [
      { when: isIdle && isStd, value: IdlePanelComponent },
      { when: isIdle && isPrm, value: IdlePanelComponent },
      { when: isRun, value: RunningPanelComponent },
      { when: isReady, value: ReadyPanelComponent },
      { when: isFail, value: FailedPanelComponent },
    ],
    IdlePanelComponent,
  );
}