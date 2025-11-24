/**
 * Domain enums and small DTOs shared across the four demos.
 * We prefer string enums (over unions) to improve hints and template clarity.
 */

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

/** Canonical "no action" fallback with strict typing. */
export const NO_ACTION: PrimaryAction = {
  kind: ActionKind.None,
  label: 'No action',
} as const;

/** Primary CTA available in the current view-model. */
export type PrimaryAction =
  | { kind: ActionKind.Start; label: string }
  | { kind: ActionKind.View; label: string }
  | { kind: ActionKind.Retry; label: string }
  | { kind: ActionKind.None; label: string };

/** Simple view-model that all four approaches produce. */
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

/** Shared lists used by pages for dropdowns and @for rendering. */
export const JOB_TYPES = [JobType.Standard, JobType.Premium] as const;

export const JOB_STATES = [
  JobState.Idle,
  JobState.Running,
  JobState.Ready,
  JobState.Failed,
] as const;