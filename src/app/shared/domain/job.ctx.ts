import { JobState, JobType } from './job.model';
import { deriveFacts, JobFacts } from './job.facts';

export type JobCtx = Readonly<{
  type: JobType;
  state: JobState;
  facts: Readonly<JobFacts>;
}>;

export function buildJobCtx(type: JobType, state: JobState): JobCtx {
  return { type, state, facts: deriveFacts(type, state) };
}