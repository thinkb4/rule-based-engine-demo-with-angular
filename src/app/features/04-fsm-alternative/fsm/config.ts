import type { Transition } from './engine';
import { ActionKind, JobState, JobType, PrimaryAction } from '@/app/shared/domain/job.model';

/** Events that drive our tiny FSM. */
export enum FsmEvent {
  Start = 'start',
  Complete = 'complete',
  Fail = 'fail',
  Reset = 'reset',
}

/** Reuse domain states as FSM states. */
export type State = JobState;

/**
 * Table of allowed transitions. Keeping it in data makes the lifecycle crystal clear.
 */
export const transitions: readonly Transition<State, FsmEvent>[] = [
  { from: JobState.Idle,    event: FsmEvent.Start,    to: JobState.Running },
  { from: JobState.Running, event: FsmEvent.Complete, to: JobState.Ready },
  { from: JobState.Running, event: FsmEvent.Fail,     to: JobState.Failed },
  { from: JobState.Failed,  event: FsmEvent.Reset,    to: JobState.Idle },
  { from: JobState.Ready,   event: FsmEvent.Reset,    to: JobState.Idle },
];

/**
 * Deterministic mapping of (state, type) -> view-model shape.
 * The FSM keeps business logic out of the component class.
 */
export function vmFrom(state: State, type: JobType): { header: string; action: PrimaryAction } {
  const who = type === JobType.Premium ? 'Premium' : 'Standard';

  // Separate header/action maps keeps the logic readable and testable.
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