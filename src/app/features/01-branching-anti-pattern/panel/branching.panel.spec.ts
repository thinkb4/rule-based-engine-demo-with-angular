import { selectPanelBranching } from './branching.panel';
import { JobState, JobType } from '@/app/shared/domain/job.model';
import { IdlePanelComponent, RunningPanelComponent, ReadyPanelComponent, FailedPanelComponent } from '@/app/shared/ui/job-state-panels';

describe('selectPanelBranching (anti-pattern mapping)', () => {
  it('returns expected panel by (type,state)', () => {
    expect(selectPanelBranching(JobType.Standard, JobState.Idle)).toBe(IdlePanelComponent);
    expect(selectPanelBranching(JobType.Premium,  JobState.Running)).toBe(RunningPanelComponent);
    expect(selectPanelBranching(JobType.Standard, JobState.Ready)).toBe(ReadyPanelComponent);
    expect(selectPanelBranching(JobType.Premium,  JobState.Failed)).toBe(FailedPanelComponent);
  });
});