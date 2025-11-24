import { computeVmDecisionTable } from '../vm/decision-table.vm';
import { JobType, JobState, ActionKind } from '@/app/shared/domain/job.model';

describe('computeVmDecisionTable', () => {
  it('idle/standard -> start', () => {
    const vm = computeVmDecisionTable(JobType.Standard, JobState.Idle);
    expect(vm.action.kind).toBe(ActionKind.Start);
  });

  it('running/* -> none', () => {
    const vm = computeVmDecisionTable(JobType.Premium, JobState.Running);
    expect(vm.action.kind).toBe(ActionKind.None);
  });

  it('ready/* -> view', () => {
    const vm = computeVmDecisionTable(JobType.Premium, JobState.Ready);
    expect(vm.action.kind).toBe(ActionKind.View);
  });

  it('failed/* -> retry', () => {
    const vm = computeVmDecisionTable(JobType.Standard, JobState.Failed);
    expect(vm.action.kind).toBe(ActionKind.Retry);
  });
});