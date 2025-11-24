import { JobState, JobType } from './job.model';
import { deriveFacts, JobFacts } from './job.facts';

/**
 * Rich context we pass to the improved rule engine.
 * It contains both the raw fields and their derived facts.
 */
export type JobCtx = Readonly<{
  type: JobType;
  state: JobState;
  facts: Readonly<JobFacts>;
}>;

/**
 * Construct a typed context for rules to consume.
 * Callers should do this once and pass the same ctx into multiple rule sets.
 */
export function buildJobCtx(type: JobType, state: JobState): JobCtx {
  return { type, state, facts: deriveFacts(type, state) };
}