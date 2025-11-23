import type { Transition } from './engine';
import { ActionKind, JobState, JobType, PrimaryAction } from '@/app/shared/domain/job.model';

export enum FsmEvent {
  Start = 'start',
  Complete = 'complete',
  Fail = 'fail',
  Reset = 'reset',
}

export type State = JobState;

export const transitions: readonly Transition<State, FsmEvent>[] = [
  { from: JobState.Idle,    event: FsmEvent.Start,    to: JobState.Running },
  { from: JobState.Running, event: FsmEvent.Complete, to: JobState.Ready },
  { from: JobState.Running, event: FsmEvent.Fail,     to: JobState.Failed },
  { from: JobState.Failed,  event: FsmEvent.Reset,    to: JobState.Idle },
  { from: JobState.Ready,   event: FsmEvent.Reset,    to: JobState.Idle },
];

export function vmFrom(state: State, type: JobType): { header: string; action: PrimaryAction } {
  const who = type === JobType.Premium ? 'Premium' : 'Standard';
  const headerMap: Record<State, string> = {
    [JobState.Idle]: `${who} job is idle`,
    [JobState.Running]: `${who} is processing`,
    [JobState.Ready]: `${who} result ready`,
    [JobState.Failed]: `${who} failed`,
  };

  const actionMap: Record<State, PrimaryAction> = {
    [JobState.Idle]: { kind: ActionKind.Start, label: type === JobType.Premium ? 'Start Premium' : 'Start Standard' },
    [JobState.Running]: { kind: ActionKind.None, label: 'Processing…' },
    [JobState.Ready]: { kind: ActionKind.View, label: 'Open Result' },
    [JobState.Failed]: { kind: ActionKind.Retry, label: 'Retry' },
  };

  return { header: headerMap[state], action: actionMap[state] };
}