import type { Transition } from './engine';

export type State = 'idle' | 'running' | 'ready' | 'failed';
export type FsmEvent = 'start' | 'complete' | 'fail' | 'reset';

export const transitions: readonly Transition<State, FsmEvent>[] = [
  { from: 'idle',   event: 'start',    to: 'running' },
  { from: 'running', event: 'complete', to: 'ready' },
  { from: 'running', event: 'fail',     to: 'failed' },
  { from: 'failed',  event: 'reset',    to: 'idle' },
  { from: 'ready',   event: 'reset',    to: 'idle' },
];

export type JobType = 'standard' | 'premium';

export type PrimaryAction =
  | { kind: 'start'; label: string }
  | { kind: 'view'; label: string }
  | { kind: 'retry'; label: string }
  | { kind: 'none'; label: string };

export function vmFrom(state: State, type: JobType): { header: string; action: PrimaryAction } {
  const who = type === 'premium' ? 'Premium' : 'Standard';

  const headerMap: Record<State, string> = {
    idle: `${who} job is idle`,
    running: `${who} is processing`,
    ready: `${who} result ready`,
    failed: `${who} failed`,
  };

  const actionMap: Record<State, PrimaryAction> = {
    idle: { kind: 'start', label: type === 'premium' ? 'Start Premium' : 'Start Standard' },
    running: { kind: 'none', label: 'Processing…' },
    ready: { kind: 'view', label: 'Open Result' },
    failed: { kind: 'retry', label: 'Retry' },
  };

  return { header: headerMap[state], action: actionMap[state] };
}