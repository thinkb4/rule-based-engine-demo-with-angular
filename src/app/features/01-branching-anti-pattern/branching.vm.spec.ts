import { computeVmBranching } from './branching.vm';
import { JobState, JobType, ActionKind } from '@/app/shared/domain/job.model';

describe('computeVmBranching (anti-pattern)', () => {
  it('idle/standard -> header + start', () => {
    const vm = computeVmBranching(JobType.Standard, JobState.Idle);
    expect(vm.header).toMatch(/Standard job is idle/);
    expect(vm.action.kind).toBe(ActionKind.Start);
  });

  it('running/premium -> processing + none', () => {
    const vm = computeVmBranching(JobType.Premium, JobState.Running);
    expect(vm.header).toMatch(/Premium is processing/);
    expect(vm.action.kind).toBe(ActionKind.None);
  });

  it('ready/* -> view', () => {
    const std = computeVmBranching(JobType.Standard, JobState.Ready);
    const prm = computeVmBranching(JobType.Premium, JobState.Ready);
    expect(std.action.kind).toBe(ActionKind.View);
    expect(prm.action.kind).toBe(ActionKind.View);
  });

  it('failed/* -> retry', () => {
    const std = computeVmBranching(JobType.Standard, JobState.Failed);
    const prm = computeVmBranching(JobType.Premium, JobState.Failed);
    expect(std.action.kind).toBe(ActionKind.Retry);
    expect(prm.action.kind).toBe(ActionKind.Retry);
  });
});