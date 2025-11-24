import { JobState, JobType } from './job.model';

/**
 * Pre-derived booleans used by rule tables/engines.
 * This keeps conditions trivial at call-sites and more testable.
 */
export type JobFacts = Readonly<{
  isStandard: boolean;
  isPremium: boolean;
  isIdle: boolean;
  isRunning: boolean;
  isReady: boolean;
  isFailed: boolean;
}>;

/**
 * Build derived facts one time per render/evaluation.
 * This reduces repeated comparisons scattered through rules.
 */
export function deriveFacts(type: JobType, state: JobState): JobFacts {
  return {
    isStandard: type === JobType.Standard,
    isPremium: type === JobType.Premium,
    isIdle: state === JobState.Idle,
    isRunning: state === JobState.Running,
    isReady: state === JobState.Ready,
    isFailed: state === JobState.Failed,
  };
}