import { panelForState, JOB_STATE_PANELS, IdlePanelComponent, RunningPanelComponent, ReadyPanelComponent, FailedPanelComponent } from './job-state-panels';
import { JobState } from '../domain/job.model';

describe('job-state-panels mapping', () => {
  it('panelForState returns the mapped component', () => {
    expect(panelForState(JobState.Idle)).toBe(IdlePanelComponent);
    expect(panelForState(JobState.Running)).toBe(RunningPanelComponent);
    expect(panelForState(JobState.Ready)).toBe(ReadyPanelComponent);
    expect(panelForState(JobState.Failed)).toBe(FailedPanelComponent);
  });

  it('JOB_STATE_PANELS object matches all states', () => {
    expect(Object.keys(JOB_STATE_PANELS).sort()).toEqual(
      [JobState.Idle, JobState.Running, JobState.Ready, JobState.Failed].sort()
    );
  });
});