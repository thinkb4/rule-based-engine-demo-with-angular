import { JobState, JobType } from './job.model';

export type JobFacts = Readonly<{
  isStandard: boolean;
  isPremium: boolean;
  isIdle: boolean;
  isRunning: boolean;
  isReady: boolean;
  isFailed: boolean;
}>;

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