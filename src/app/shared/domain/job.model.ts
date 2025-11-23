export enum JobType {
  Standard = 'standard',
  Premium = 'premium',
}

export enum JobState {
  Idle = 'idle',
  Running = 'running',
  Ready = 'ready',
  Failed = 'failed',
}

export enum ActionKind {
  Start = 'start',
  View = 'view',
  Retry = 'retry',
  None = 'none',
}

export const NO_ACTION: PrimaryAction = {
  kind: ActionKind.None,
  label: 'No action',
} as const;

export type PrimaryAction =
  | { kind: ActionKind.Start; label: string }
  | { kind: ActionKind.View; label: string }
  | { kind: ActionKind.Retry; label: string }
  | { kind: ActionKind.None; label: string };

export type ViewModel = Readonly<{
  header: string;
  flags: Readonly<{
    showIdle: boolean;
    showRunning: boolean;
    showReady: boolean;
    showFailed: boolean;
  }>;
  action: PrimaryAction;
}>;

export const JOB_TYPES = [JobType.Standard, JobType.Premium] as const;
export const JOB_STATES = [
  JobState.Idle,
  JobState.Running,
  JobState.Ready,
  JobState.Failed,
] as const;