import { vmFrom, FsmEvent, transitions, type State } from './config';
import { JobType, ActionKind, JobState } from '@/app/shared/domain/job.model';

describe('fsm/config', () => {
  it('vmFrom maps (state,type) deterministically', () => {
    const vm = vmFrom(JobState.Idle as State, JobType.Premium);
    expect(vm.header).toMatch(/Premium job is idle/);
    expect(vm.action.kind).toBe(ActionKind.Start);
  });

  it('transition table includes the expected edges', () => {
    const asTuples = transitions.map(t => [t.from, t.event, t.to] as const);
    expect(asTuples).toContainEqual([JobState.Idle, FsmEvent.Start, JobState.Running]);
    expect(asTuples).toContainEqual([JobState.Running, FsmEvent.Fail, JobState.Failed]);
  });
});